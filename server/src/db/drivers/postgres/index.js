// PostgreSQL driver (`pg`). Works with Neon, Supabase, Render Postgres or any PostgreSQL 13+.
//
// Each collection in entities.js is a table:
//   id uuid, seq bigserial (stable ordering), data jsonb (the record's fields),
//   created_at / updated_at timestamptz.
// Unique fields get a unique index on data->>'field'. Tables and indexes are created on
// startup if they don't exist, so there are no migrations to run.
import pg from "pg";
import { entities } from "../../entities.js";
import { assertPlainWhere, DuplicateKeyError, normalizeSearch } from "../../errors.js";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PROTECTED = new Set(["id", "createdAt", "updatedAt"]);
const SCHEMA_LOCK = 72_640_991; // arbitrary constant for pg_advisory_xact_lock

// trainingApplications -> training_applications
export const tableName = (entity) => entity.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
const quote = (identifier) => `"${identifier.replace(/"/g, '""')}"`;
const uniqueIndexName = (table, field) => `${table}__${field}__uniq`;

const fields = (data) =>
  JSON.stringify(Object.fromEntries(Object.entries(data).filter(([k, v]) => !PROTECTED.has(k) && v !== undefined)));

// WHERE clause and parameters for list(): equality filter plus optional text search.
// The search text is a single LIKE pattern with %, _ and \ escaped, so it matches literally.
function listFilter(where, search) {
  const params = [JSON.stringify(assertPlainWhere(where))];
  let sql = "data @> $1::jsonb";
  const terms = normalizeSearch(search);
  if (terms) {
    params.push(`%${terms.text.replace(/[\\%_]/g, (c) => `\\${c}`)}%`);
    const pattern = `$${params.length}::text`;
    const matches = terms.fields.map((field) => {
      params.push(field);
      return `(data->>($${params.length}::text)) ILIKE ${pattern}`;
    });
    sql += ` AND (${matches.join(" OR ")})`;
  }
  return { sql, params };
}

const toRecord = (row) =>
  row ? { ...row.data, id: row.id, createdAt: row.created_at, updatedAt: row.updated_at } : null;

function translateError(err) {
  if (err?.code === "23505") {
    const match = /__(.+)__uniq$/.exec(err.constraint ?? "");
    return new DuplicateKeyError(match ? match[1] : "key");
  }
  return err;
}

function schemaStatements() {
  const statements = [];
  for (const [entity, { unique }] of Object.entries(entities)) {
    const table = tableName(entity);
    const t = quote(table);
    statements.push(
      `CREATE TABLE IF NOT EXISTS ${t} (
         id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
         seq bigserial NOT NULL,
         data jsonb NOT NULL DEFAULT '{}'::jsonb,
         created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
         updated_at timestamptz NOT NULL DEFAULT clock_timestamp()
       )`,
      `CREATE INDEX IF NOT EXISTS ${quote(`${table}__created`)} ON ${t} (created_at DESC, seq DESC)`,
      `CREATE INDEX IF NOT EXISTS ${quote(`${table}__data`)} ON ${t} USING gin (data jsonb_path_ops)`,
      ...unique.map(
        (field) =>
          `CREATE UNIQUE INDEX IF NOT EXISTS ${quote(uniqueIndexName(table, field))} ON ${t} ((data->>${pg.escapeLiteral(field)}))`,
      ),
    );
  }
  statements.push(`CREATE TABLE IF NOT EXISTS counters (name text PRIMARY KEY, value bigint NOT NULL DEFAULT 0)`);
  return statements;
}

class PostgresRepository {
  constructor(pool, entity) {
    this.pool = pool;
    this.table = quote(tableName(entity));
  }

  async create(data) {
    try {
      const { rows } = await this.pool.query(`INSERT INTO ${this.table} (data) VALUES ($1::jsonb) RETURNING *`, [fields(data)]);
      return toRecord(rows[0]);
    } catch (err) {
      throw translateError(err);
    }
  }

  async findById(id) {
    if (!UUID.test(String(id))) return null;
    const { rows } = await this.pool.query(`SELECT * FROM ${this.table} WHERE id = $1`, [id]);
    return toRecord(rows[0]);
  }

  async findOne(where = {}) {
    const { rows } = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE data @> $1::jsonb ORDER BY created_at DESC, seq DESC LIMIT 1`,
      [JSON.stringify(assertPlainWhere(where))],
    );
    return toRecord(rows[0]);
  }

  async list({ where = {}, search, limit = 20, offset = 0 } = {}) {
    const { sql, params } = listFilter(where, search);
    const n = params.length;
    const [page, count] = await Promise.all([
      this.pool.query(
        `SELECT * FROM ${this.table} WHERE ${sql} ORDER BY created_at DESC, seq DESC LIMIT $${n + 1} OFFSET $${n + 2}`,
        [...params, limit, offset],
      ),
      this.pool.query(`SELECT count(*)::int AS total FROM ${this.table} WHERE ${sql}`, params),
    ]);
    return { items: page.rows.map(toRecord), total: count.rows[0].total };
  }

  async update(id, patch) {
    if (!UUID.test(String(id))) return null;
    try {
      const { rows } = await this.pool.query(
        `UPDATE ${this.table} SET data = data || $2::jsonb, updated_at = clock_timestamp() WHERE id = $1 RETURNING *`,
        [id, fields(patch)],
      );
      return toRecord(rows[0]);
    } catch (err) {
      throw translateError(err);
    }
  }

  async delete(id) {
    if (!UUID.test(String(id))) return false;
    const { rowCount } = await this.pool.query(`DELETE FROM ${this.table} WHERE id = $1`, [id]);
    return rowCount === 1;
  }
}

class PostgresCounters {
  constructor(pool) {
    this.pool = pool;
  }

  async get(name) {
    const { rows } = await this.pool.query("SELECT value FROM counters WHERE name = $1", [name]);
    return rows[0] ? Number(rows[0].value) : 0;
  }

  async increment(name, by = 1) {
    const { rows } = await this.pool.query(
      `INSERT INTO counters (name, value) VALUES ($1, $2)
       ON CONFLICT (name) DO UPDATE SET value = counters.value + EXCLUDED.value
       RETURNING value`,
      [name, by],
    );
    return Number(rows[0].value);
  }
}

function sslOption(setting) {
  if (setting === "true") return { rejectUnauthorized: true };
  if (setting === "no-verify") return { rejectUnauthorized: false };
  return undefined; // decided by DATABASE_URL (e.g. ?sslmode=require)
}

export function createDriver(config) {
  const pool = new pg.Pool({
    connectionString: config.db.databaseUrl,
    ssl: sslOption(config.db.databaseSsl),
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    application_name: "sumedha-agro-api",
  });
  // An idle connection dropped by the server must not crash the process.
  pool.on("error", (err) => console.error(`[db] idle PostgreSQL connection error: ${err.message}`));
  const schema = config.db.databaseSchema;
  if (schema) pool.on("connect", (client) => client.query(`SET search_path TO ${quote(schema)}`));

  return {
    name: "postgres",
    async connect() {
      const client = await pool.connect();
      try {
        // Names and addresses may be in Hindi or contain "₹"; other encodings reject them.
        const { rows } = await client.query("SHOW server_encoding");
        if (!["UTF8", "SQL_ASCII"].includes(rows[0].server_encoding)) {
          throw new Error(`the database uses ${rows[0].server_encoding} encoding; create it with ENCODING 'UTF8'.`);
        }
        await client.query("BEGIN");
        await client.query("SELECT pg_advisory_xact_lock($1)", [SCHEMA_LOCK]);
        if (schema) await client.query(`CREATE SCHEMA IF NOT EXISTS ${quote(schema)}`);
        for (const statement of schemaStatements()) await client.query(statement);
        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK").catch(() => {});
        throw err;
      } finally {
        client.release();
      }
    },
    async close() {
      await pool.end();
    },
    async ping() {
      try {
        await pool.query("SELECT 1");
        return true;
      } catch {
        return false;
      }
    },
    repositories: Object.fromEntries(Object.keys(entities).map((name) => [name, new PostgresRepository(pool, name)])),
    counters: new PostgresCounters(pool),
  };
}
