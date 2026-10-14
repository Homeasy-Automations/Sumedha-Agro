// In-memory driver: for local development without a database and for tests.
// Data is lost when the process exits.
import { randomUUID } from "node:crypto";
import { entities } from "../../entities.js";
import { assertPlainWhere, DuplicateKeyError, normalizeSearch } from "../../errors.js";

const PROTECTED = new Set(["id", "createdAt", "updatedAt"]);

class MemoryRepository {
  #unique;
  #rows = new Map(); // id -> { record, seq }
  #seq = 0;

  constructor({ unique }) {
    this.#unique = unique;
  }

  #assertUnique(data, ignoreId) {
    for (const field of this.#unique) {
      if (data[field] == null) continue;
      for (const { record } of this.#rows.values()) {
        if (record.id !== ignoreId && record[field] === data[field]) throw new DuplicateKeyError(field);
      }
    }
  }

  #matches(record, where) {
    return Object.entries(where).every(([field, value]) => record[field] === value);
  }

  #found(record, search) {
    if (!search) return true;
    const needle = search.text.toLowerCase();
    return search.fields.some((field) => typeof record[field] === "string" && record[field].toLowerCase().includes(needle));
  }

  async create(data) {
    this.#assertUnique(data);
    const now = new Date();
    const record = { ...structuredClone(data), id: randomUUID(), createdAt: now, updatedAt: now };
    this.#rows.set(record.id, { record, seq: ++this.#seq });
    return structuredClone(record);
  }

  async findById(id) {
    const row = this.#rows.get(String(id));
    return row ? structuredClone(row.record) : null;
  }

  async findOne(where = {}) {
    assertPlainWhere(where);
    for (const { record } of this.#rows.values()) {
      if (this.#matches(record, where)) return structuredClone(record);
    }
    return null;
  }

  async list({ where = {}, search, limit = 20, offset = 0 } = {}) {
    assertPlainWhere(where);
    const terms = normalizeSearch(search);
    const matched = [...this.#rows.values()]
      .filter(({ record }) => this.#matches(record, where) && this.#found(record, terms))
      .sort((a, b) => b.record.createdAt - a.record.createdAt || b.seq - a.seq);
    return {
      items: matched.slice(offset, offset + limit).map(({ record }) => structuredClone(record)),
      total: matched.length,
    };
  }

  async update(id, patch) {
    const row = this.#rows.get(String(id));
    if (!row) return null;
    const changes = Object.fromEntries(Object.entries(patch).filter(([key]) => !PROTECTED.has(key)));
    this.#assertUnique(changes, row.record.id);
    Object.assign(row.record, structuredClone(changes), { updatedAt: new Date() });
    return structuredClone(row.record);
  }

  async delete(id) {
    return this.#rows.delete(String(id));
  }
}

class MemoryCounters {
  #values = new Map();

  async get(name) {
    return this.#values.get(name) ?? 0;
  }

  async increment(name, by = 1) {
    const next = (this.#values.get(name) ?? 0) + by;
    this.#values.set(name, next);
    return next;
  }
}

export function createDriver() {
  const repositories = Object.fromEntries(
    Object.entries(entities).map(([name, entity]) => [name, new MemoryRepository(entity)]),
  );
  return {
    name: "memory",
    async connect() {},
    async close() {},
    async ping() {
      return true;
    },
    repositories,
    counters: new MemoryCounters(),
  };
}
