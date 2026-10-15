// Behaviour every database driver must share. Add new drivers to `drivers` below.
// The PostgreSQL suite runs when TEST_DATABASE_URL is set, MongoDB when TEST_MONGODB_URI is set.
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { loadConfig } from "../src/config.js";
import { createDatabase } from "../src/db/index.js";
import { DuplicateKeyError, InvalidQueryError } from "../src/db/errors.js";
import { dropTestDatabase, testEnv } from "./support/testServer.js";

const drivers = [
  { name: "memory", env: { DB_DRIVER: "memory" } },
  {
    name: "postgres",
    env: { DB_DRIVER: "postgres" },
    skip: !process.env.TEST_DATABASE_URL && "TEST_DATABASE_URL not set",
  },
  { name: "mongodb", env: { DB_DRIVER: "mongodb" }, skip: !process.env.TEST_MONGODB_URI && "TEST_MONGODB_URI not set" },
];

for (const driver of drivers) {
  describe(`${driver.name} driver`, { skip: driver.skip }, () => {
    let db;
    let repo;
    let config;

    before(async () => {
      ({ config } = loadConfig(testEnv(driver.env)));
      db = await createDatabase(config);
      repo = db.repositories.subscribers;
    });

    after(async () => {
      await db?.close();
      if (config) await dropTestDatabase(config);
    });

    it("exposes a repository for every entity, plus counters", () => {
      for (const name of ["trainingApplications", "contactMessages", "quoteRequests", "subscribers"]) {
        assert.ok(db.repositories[name], `missing repository ${name}`);
      }
      assert.equal(typeof db.counters.increment, "function");
    });

    it("create() returns the record with id and timestamps", async () => {
      const record = await repo.create({ email: "create@example.com", tags: "a" });
      assert.equal(typeof record.id, "string");
      assert.ok(record.createdAt instanceof Date);
      assert.ok(record.updatedAt instanceof Date);
      assert.equal(record.email, "create@example.com");
    });

    it("findById() finds records and returns null for unknown or malformed ids", async () => {
      const record = await repo.create({ email: "find@example.com" });
      assert.equal((await repo.findById(record.id)).email, "find@example.com");
      assert.equal(await repo.findById("does-not-exist"), null);
      assert.equal(await repo.findById("0123456789abcdef01234567"), null);
    });

    it("findOne() matches on equality", async () => {
      await repo.create({ email: "one@example.com" });
      assert.equal((await repo.findOne({ email: "one@example.com" })).email, "one@example.com");
      assert.equal(await repo.findOne({ email: "nobody@example.com" }), null);
    });

    it("rejects object filter values (operator injection)", async () => {
      await assert.rejects(repo.findOne({ email: { $ne: "" } }), InvalidQueryError);
      await assert.rejects(repo.list({ where: { email: { $gt: "" } } }), InvalidQueryError);
    });

    it("list() returns newest first with total and pagination", async () => {
      const contacts = db.repositories.contactMessages;
      for (const n of [1, 2, 3, 4, 5]) await contacts.create({ name: `c${n}`, topic: n % 2 ? "odd" : "even" });

      const first = await contacts.list({ limit: 2 });
      assert.equal(first.total, 5);
      assert.deepEqual(first.items.map((r) => r.name), ["c5", "c4"]);

      const second = await contacts.list({ limit: 2, offset: 2 });
      assert.deepEqual(second.items.map((r) => r.name), ["c3", "c2"]);

      const odd = await contacts.list({ where: { topic: "odd" } });
      assert.equal(odd.total, 3);
      assert.deepEqual(odd.items.map((r) => r.name), ["c5", "c3", "c1"]);
    });

    it("list() searches text fields (case-insensitive, literal) and combines it with where", async () => {
      const apps = db.repositories.trainingApplications;
      await apps.create({ referenceId: "SAG-TR-SRCH1", name: "Asha Verma", email: "asha@example.com", status: "new" });
      await apps.create({ referenceId: "SAG-TR-SRCH2", name: "Ravi Kumar", email: "ravi@example.com", status: "accepted" });
      await apps.create({ referenceId: "SAG-TR-SRCH3", name: "100% _Sure_ \\ (test)", email: "x@example.com", status: "new" });
      const fields = ["referenceId", "name", "email"];
      const search = (text, where) => apps.list({ search: { text, fields }, where });
      const refs = async (text, where) => (await search(text, where)).items.map((r) => r.referenceId);

      assert.deepEqual(await refs("asha"), ["SAG-TR-SRCH1"]);
      assert.deepEqual(await refs("VERMA"), ["SAG-TR-SRCH1"]);
      assert.deepEqual(await refs("ravi@"), ["SAG-TR-SRCH2"]);
      assert.equal((await search("sag-tr-srch")).total, 3);
      assert.deepEqual(await refs("sag-tr-srch", { status: "new" }), ["SAG-TR-SRCH3", "SAG-TR-SRCH1"]);
      // LIKE and regex special characters match themselves only
      assert.deepEqual(await refs("%"), ["SAG-TR-SRCH3"]);
      assert.deepEqual(await refs("_sure_"), ["SAG-TR-SRCH3"]);
      assert.deepEqual(await refs("\\"), ["SAG-TR-SRCH3"]);
      assert.deepEqual(await refs("(test)"), ["SAG-TR-SRCH3"]);
      assert.equal((await search(".*")).total, 0);
      assert.equal((await search("a_ha")).total, 0);
      // blank text means no search
      assert.equal((await search("   ")).total, (await apps.list()).total);
      // field names must be plain names
      await assert.rejects(apps.list({ search: { text: "x", fields: ["$where"] } }), InvalidQueryError);
      await assert.rejects(apps.list({ search: { text: "x", fields: ["a.b"] } }), InvalidQueryError);
      await assert.rejects(apps.list({ search: { text: "x", fields: [] } }), InvalidQueryError);
    });

    it("update() patches fields, bumps updatedAt and ignores protected fields", async () => {
      const record = await repo.create({ email: "update@example.com", status: "new" });
      await new Promise((r) => setTimeout(r, 5));
      const updated = await repo.update(record.id, { status: "done", id: "hacked", createdAt: new Date(0) });
      assert.equal(updated.id, record.id);
      assert.equal(updated.status, "done");
      assert.equal(updated.createdAt.getTime(), record.createdAt.getTime());
      assert.ok(updated.updatedAt > record.updatedAt);
      assert.equal(await repo.update("does-not-exist", { status: "x" }), null);
    });

    it("enforces unique fields on create and update", async () => {
      await repo.create({ email: "unique@example.com" });
      await assert.rejects(repo.create({ email: "unique@example.com" }), (err) => {
        assert.ok(err instanceof DuplicateKeyError);
        assert.equal(err.field, "email");
        return true;
      });
      const other = await repo.create({ email: "other@example.com" });
      await assert.rejects(repo.update(other.id, { email: "unique@example.com" }), DuplicateKeyError);
    });

    it("counters start at 0 and increment atomically", async () => {
      assert.equal(await db.counters.get("contract-test"), 0);
      await Promise.all(Array.from({ length: 20 }, () => db.counters.increment("contract-test")));
      assert.equal(await db.counters.get("contract-test"), 20);
      assert.equal(await db.counters.increment("contract-test", 5), 25);
    });

    it("delete() removes a record and reports whether it existed", async () => {
      const news = db.repositories.newsItems;
      const record = await news.create({ title: "To delete" });
      assert.equal(await news.delete(record.id), true);
      assert.equal(await news.findById(record.id), null);
      assert.equal(await news.delete(record.id), false);
      assert.equal(await news.delete("not-an-id"), false);
    });

    it("ping() reports the connection is up", async () => {
      assert.equal(await db.ping(), true);
    });
  });
}
