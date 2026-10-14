// MongoDB driver (official `mongodb` package). Works with MongoDB Atlas or any MongoDB 5+ server.
import { MongoClient, ObjectId } from "mongodb";
import { entities } from "../../entities.js";
import { assertPlainWhere, DuplicateKeyError, normalizeSearch } from "../../errors.js";

const DEFAULT_DB_NAME = "sumedha_agro";
const OBJECT_ID = /^[0-9a-f]{24}$/i;
const PROTECTED = new Set(["id", "_id", "createdAt", "updatedAt"]);

const toRecord = (doc) => {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { id: _id.toHexString(), ...rest };
};

// Equality filter plus optional text search; the search text is regex-escaped so it matches literally.
function listFilter(where, search) {
  const filter = { ...assertPlainWhere(where) };
  const terms = normalizeSearch(search);
  if (terms) {
    const pattern = new RegExp(terms.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = terms.fields.map((field) => ({ [field]: pattern }));
  }
  return filter;
}

const toObjectId = (id) => (OBJECT_ID.test(String(id)) ? new ObjectId(String(id)) : null);

const withoutProtected = (data) => Object.fromEntries(Object.entries(data).filter(([key]) => !PROTECTED.has(key)));

function translateError(err) {
  if (err?.code === 11000) {
    const field = Object.keys(err.keyPattern ?? err.keyValue ?? {})[0] ?? "key";
    return new DuplicateKeyError(field);
  }
  return err;
}

class MongoRepository {
  constructor(collection) {
    this.collection = collection;
  }

  async create(data) {
    const now = new Date();
    const doc = { ...withoutProtected(data), createdAt: now, updatedAt: now };
    try {
      const { insertedId } = await this.collection().insertOne(doc);
      return toRecord({ ...doc, _id: insertedId });
    } catch (err) {
      throw translateError(err);
    }
  }

  async findById(id) {
    const _id = toObjectId(id);
    return _id ? toRecord(await this.collection().findOne({ _id })) : null;
  }

  async findOne(where = {}) {
    return toRecord(await this.collection().findOne(assertPlainWhere(where)));
  }

  async list({ where = {}, search, limit = 20, offset = 0 } = {}) {
    const filter = listFilter(where, search);
    const [docs, total] = await Promise.all([
      this.collection().find(filter).sort({ createdAt: -1, _id: -1 }).skip(offset).limit(limit).toArray(),
      this.collection().countDocuments(filter),
    ]);
    return { items: docs.map(toRecord), total };
  }

  async update(id, patch) {
    const _id = toObjectId(id);
    if (!_id) return null;
    try {
      const doc = await this.collection().findOneAndUpdate(
        { _id },
        { $set: { ...withoutProtected(patch), updatedAt: new Date() } },
        { returnDocument: "after" },
      );
      return toRecord(doc);
    } catch (err) {
      throw translateError(err);
    }
  }

  async delete(id) {
    const _id = toObjectId(id);
    if (!_id) return false;
    const { deletedCount } = await this.collection().deleteOne({ _id });
    return deletedCount === 1;
  }
}

class MongoCounters {
  constructor(collection) {
    this.collection = collection;
  }

  async get(name) {
    const doc = await this.collection().findOne({ _id: name });
    return doc?.value ?? 0;
  }

  async increment(name, by = 1) {
    const doc = await this.collection().findOneAndUpdate(
      { _id: name },
      { $inc: { value: by } },
      { upsert: true, returnDocument: "after" },
    );
    return doc.value;
  }
}

export function createDriver(config) {
  const client = new MongoClient(config.db.mongodbUri, {
    serverSelectionTimeoutMS: 10_000,
    maxPoolSize: 10,
    appName: "sumedha-agro-api",
  });
  let db;
  const collection = (name) => () => {
    if (!db) throw new Error("MongoDB is not connected.");
    return db.collection(name);
  };

  return {
    name: "mongodb",
    async connect() {
      await client.connect();
      db = client.db(config.db.mongodbDb || DEFAULT_DB_NAME);
      // One createIndexes call per collection; a no-op when the indexes already exist.
      for (const [name, { unique }] of Object.entries(entities)) {
        await db.collection(name).createIndexes([
          { key: { createdAt: -1 } },
          ...unique.map((field) => ({ key: { [field]: 1 }, unique: true })),
        ]);
      }
    },
    async close() {
      await client.close();
    },
    async ping() {
      try {
        await db.command({ ping: 1 });
        return true;
      } catch {
        return false;
      }
    },
    repositories: Object.fromEntries(
      Object.keys(entities).map((name) => [name, new MongoRepository(collection(name))]),
    ),
    counters: new MongoCounters(collection("counters")),
  };
}
