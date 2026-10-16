import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { ADMIN_KEY, startTestServer, validApplication } from "./support/testServer.js";

const admin = { headers: { "x-admin-key": ADMIN_KEY } };

describe("API", () => {
  let t;
  before(async () => {
    t = await startTestServer();
  });
  after(() => t.close());

  describe("GET /api/ping", () => {
    it("answers without touching the database", async () => {
      const realPing = t.db.ping;
      let dbCalls = 0;
      t.db.ping = async () => {
        dbCalls++;
        return realPing.call(t.db);
      };
      try {
        const res = await t.api("GET", "/api/ping");
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { ok: true });
        assert.equal(res.headers.get("cache-control"), "no-store");
        assert.equal(dbCalls, 0);

        await t.api("GET", "/api/health");
        assert.equal(dbCalls, 1, "/api/health should still check the database");
      } finally {
        t.db.ping = realPing;
      }
    });
  });

  describe("GET /api/health", () => {
    it("reports the database status", async () => {
      const res = await t.api("GET", "/api/health");
      assert.equal(res.status, 200);
      assert.deepEqual(res.body, { ok: true, db: { driver: t.db.name, status: "up" } });
    });
  });

  describe("POST /api/training/apply", () => {
    it("saves a valid application and returns { ok, referenceId }", async () => {
      t.mailer.sent.length = 0;
      const res = await t.api("POST", "/api/training/apply", {
        body: validApplication({ clientReferenceId: "SAG-TR-ABCDE" }),
      });
      assert.equal(res.status, 201);
      assert.deepEqual(res.body, { ok: true, referenceId: "SAG-TR-ABCDE" });

      const stored = await t.db.repositories.trainingApplications.findOne({ referenceId: "SAG-TR-ABCDE" });
      assert.equal(stored.mobile, "9876543210");
      assert.equal(stored.aadhar, "123456789012");
      assert.equal(stored.status, "new");
      assert.equal(stored.clientReferenceId, undefined);
    });

    it("emails the company (Aadhar masked) and the applicant", async () => {
      const [company, applicant] = t.mailer.sent;
      assert.equal(company.to, "company@example.com");
      assert.equal(company.replyTo, "test@example.com");
      assert.match(company.html, /XXXX XXXX 9012/);
      assert.ok(!company.html.includes("123456789012"));
      assert.equal(applicant.to, "test@example.com");
      assert.match(applicant.text, /SAG-TR-ABCDE/);
    });

    it("saves the Training Calendar batch with the application and names it in the emails", async () => {
      t.mailer.sent.length = 0;
      const res = await t.api("POST", "/api/training/apply", {
        body: validApplication({
          clientReferenceId: "SAG-TR-BATCH",
          trainingBatchId: "cultivation-2026-6",
          trainingBatch: "S. No. 6 · 16-27 Nov 2026",
        }),
      });
      assert.equal(res.status, 201);
      const stored = await t.db.repositories.trainingApplications.findOne({ referenceId: "SAG-TR-BATCH" });
      assert.equal(stored.trainingBatchId, "cultivation-2026-6");
      assert.equal(stored.trainingBatch, "S. No. 6 · 16-27 Nov 2026");

      const [company, applicant] = t.mailer.sent;
      assert.match(company.text, /Batch: S\. No\. 6 · 16-27 Nov 2026/);
      assert.match(applicant.text, /Spawn Production Training \(S\. No\. 6 · 16-27 Nov 2026\)/);

      const tooLong = await t.api("POST", "/api/training/apply", { body: validApplication({ trainingBatch: "x".repeat(301) }) });
      assert.equal(tooLong.status, 400);
      assert.ok(tooLong.body.errors.trainingBatch);
    });

    it("issues a new reference when the client one is taken or malformed", async () => {
      const taken = await t.api("POST", "/api/training/apply", {
        body: validApplication({ clientReferenceId: "SAG-TR-ABCDE" }),
      });
      assert.equal(taken.status, 201);
      assert.notEqual(taken.body.referenceId, "SAG-TR-ABCDE");
      assert.match(taken.body.referenceId, /^SAG-TR-[A-Z2-9]{5}$/);

      const bad = await t.api("POST", "/api/training/apply", {
        body: validApplication({ clientReferenceId: "DROP TABLE" }),
      });
      assert.match(bad.body.referenceId, /^SAG-TR-[A-Z2-9]{5}$/);
    });

    it("returns 400 with a message for each of the 16 required fields", async () => {
      const res = await t.api("POST", "/api/training/apply", { body: {} });
      assert.equal(res.status, 400);
      assert.equal(res.body.ok, false);
      assert.equal(res.body.message, "Please correct the highlighted fields.");
      assert.equal(Object.keys(res.body.errors).length, 16);
      assert.equal(res.body.errors.name, "This field is required.");
      assert.equal(res.body.errors.trainingDate, "This field is required.");
      assert.equal(res.body.errors.previousTrainingDetails, undefined);
    });

    it("no longer stores a training module number", async () => {
      const res = await t.api("POST", "/api/training/apply", {
        body: validApplication({ trainingModuleNo: "2" }),
      });
      assert.equal(res.status, 201);
      const stored = await t.db.repositories.trainingApplications.findOne({ referenceId: res.body.referenceId });
      assert.equal(stored.trainingModuleNo, undefined);
    });

    it("needs the training date only when no batch is named", async () => {
      const withBatch = await t.api("POST", "/api/training/apply", {
        body: validApplication({ trainingDate: "", trainingBatch: "S. No. 5 · 2026" }),
      });
      assert.equal(withBatch.status, 201, JSON.stringify(withBatch.body));
      const stored = await t.db.repositories.trainingApplications.findOne({ referenceId: withBatch.body.referenceId });
      assert.equal(stored.trainingDate, "");

      const neither = await t.api("POST", "/api/training/apply", { body: validApplication({ trainingDate: "" }) });
      assert.equal(neither.status, 400);
      assert.deepEqual(neither.body.errors, { trainingDate: "This field is required." });

      const badDate = await t.api("POST", "/api/training/apply", {
        body: validApplication({ trainingDate: "2026-02-31", trainingBatch: "S. No. 1 · 25-30 Oct 2026" }),
      });
      assert.equal(badDate.body.errors.trainingDate, "Enter a valid date.", "a date that is sent must still be valid");
    });

    it("validates formats and options", async () => {
      const res = await t.api("POST", "/api/training/apply", {
        body: validApplication({
          mobile: "12345",
          aadhar: "12",
          email: "not-an-email",
          dateOfBirth: "2999-01-01",
          trainingDate: "2026-02-31",
          gender: "Other",
          state: "Atlantis",
          previousTraining: "Maybe",
        }),
      });
      assert.equal(res.status, 400);
      assert.deepEqual(res.body.errors, {
        mobile: "Enter a 10-digit mobile number.",
        aadhar: "Enter a 12-digit Aadhar number.",
        email: "Enter a valid email address.",
        dateOfBirth: "Date of birth must be in the past.",
        trainingDate: "Enter a valid date.",
        gender: "Select a valid option.",
        state: "Select a valid option.",
        previousTraining: "Select a valid option.",
      });
    });

    it("drops previous-training details when the answer is No, and ignores unknown fields", async () => {
      const res = await t.api("POST", "/api/training/apply", {
        body: validApplication({ previousTraining: "No", isAdmin: true, status: "accepted", $where: "1" }),
      });
      const stored = await t.db.repositories.trainingApplications.findOne({ referenceId: res.body.referenceId });
      assert.equal(stored.previousTrainingDetails, "");
      assert.equal(stored.isAdmin, undefined);
      assert.equal(stored.$where, undefined);
      assert.equal(stored.status, "new");
    });

    it("escapes HTML in emails", async () => {
      t.mailer.sent.length = 0;
      await t.api("POST", "/api/training/apply", { body: validApplication({ name: "<script>alert(1)</script>" }) });
      assert.ok(t.mailer.sent.every((m) => !m.html.includes("<script>")));
      assert.ok(t.mailer.sent[0].html.includes("&lt;script&gt;"));
    });
  });

  describe("POST /api/contact", () => {
    it("accepts the Contact page payload (fullName) and saves it", async () => {
      const res = await t.api("POST", "/api/contact", {
        body: { fullName: "Asha", email: "asha@example.com", phone: "9999999999", interest: "Mushroom Spawn", message: "Hi" },
      });
      assert.equal(res.status, 201);
      assert.equal(res.body.ok, true);
      assert.equal(typeof res.body.message, "string");
      const { items } = await t.db.repositories.contactMessages.list();
      assert.equal(items[0].name, "Asha");
      assert.equal(items[0].message, "Hi");
    });

    it("returns message and error fields on validation failure", async () => {
      const res = await t.api("POST", "/api/contact", { body: { name: "No email" } });
      assert.equal(res.status, 400);
      assert.equal(res.body.errors.email, "This field is required.");
      assert.equal(res.body.error, res.body.message);
    });
  });

  describe("POST /api/quote", () => {
    it("saves the quote and returns a referenceId", async () => {
      const res = await t.api("POST", "/api/quote", {
        body: { product: "Oyster spawn", volume: "50", name: "Ravi", email: "ravi@example.com", country: "India" },
      });
      assert.equal(res.status, 201);
      assert.match(res.body.referenceId, /^SAG-QT-[A-Z2-9]{5}$/);
    });

    it("requires product, name and email", async () => {
      const res = await t.api("POST", "/api/quote", { body: { name: "Ravi" } });
      assert.equal(res.status, 400);
      assert.deepEqual(Object.keys(res.body.errors).sort(), ["email", "product"]);
    });
  });

  describe("POST /api/subscribe", () => {
    it("subscribes once per email address (case-insensitive)", async () => {
      const first = await t.api("POST", "/api/subscribe", { body: { email: "News@Example.com" } });
      assert.equal(first.status, 201);
      const again = await t.api("POST", "/api/subscribe", { body: { email: "news@example.com" } });
      assert.equal(again.status, 200);
      assert.equal(again.body.message, "You're already subscribed.");
      assert.equal((await t.db.repositories.subscribers.list()).total, 1);
    });
  });

  describe("visitor counter", () => {
    it("counts hits", async () => {
      const start = (await t.api("GET", "/api/visitors")).body.count;
      const hit = await t.api("POST", "/api/visitors/hit");
      assert.equal(hit.body.count, start + 1);
      assert.equal((await t.api("GET", "/api/visitors")).body.count, start + 1);
    });
  });

  describe("admin API", () => {
    it("rejects missing or wrong keys", async () => {
      assert.equal((await t.api("GET", "/api/admin/stats")).status, 401);
      assert.equal((await t.api("GET", "/api/admin/stats", { headers: { "x-admin-key": "nope" } })).status, 401);
      const bearer = await t.api("GET", "/api/admin/stats", { headers: { Authorization: `Bearer ${ADMIN_KEY}` } });
      assert.equal(bearer.status, 200);
    });

    it("returns totals", async () => {
      const res = await t.api("GET", "/api/admin/stats", admin);
      assert.ok(res.body.totals.trainingApplications >= 4);
      assert.ok(res.body.totals.visitors >= 1);
    });

    it("lists applications with masked Aadhar, and shows the full number in the detail view", async () => {
      const list = await t.api("GET", "/api/admin/training-applications?limit=2", admin);
      assert.equal(list.status, 200);
      assert.equal(list.body.items.length, 2);
      assert.ok(list.body.total >= 4);
      assert.equal(list.body.items[0].aadhar, "XXXX XXXX 9012");

      const detail = await t.api("GET", `/api/admin/training-applications/${list.body.items[0].id}`, admin);
      assert.equal(detail.body.item.aadhar, "123456789012");
    });

    it("searches applications by name, email, mobile, reference number, training and batch", async () => {
      await t.api("POST", "/api/training/apply", {
        body: validApplication({
          clientReferenceId: "SAG-TR-FNDAB",
          name: "Kavita Srivastava",
          email: "kavita.s@example.com",
          mobile: "9988776655",
          trainingAppliedFor: "Training on Mushroom Spawn Production Technology 10 Nos Per Batch",
          trainingBatch: "S. No. 4 · 28-30 Oct 2026",
        }),
      });
      const search = async (q, extra = "") =>
        (await t.api("GET", `/api/admin/training-applications?q=${encodeURIComponent(q)}${extra}`, admin)).body;
      const refs = (body) => body.items.map((item) => item.referenceId);

      assert.deepEqual(refs(await search("kavita")), ["SAG-TR-FNDAB"]);
      assert.deepEqual(refs(await search("SRIVASTAVA")), ["SAG-TR-FNDAB"]);
      assert.deepEqual(refs(await search("kavita.s@")), ["SAG-TR-FNDAB"]);
      assert.deepEqual(refs(await search("99887 76655")), ["SAG-TR-FNDAB"]); // spaces ignored for numbers
      assert.deepEqual(refs(await search("sag-tr-fndab")), ["SAG-TR-FNDAB"]);
      assert.deepEqual(refs(await search("28-30 Oct")), ["SAG-TR-FNDAB"]);
      assert.deepEqual(refs(await search("spawn production technology")), ["SAG-TR-FNDAB"]);

      const found = await search("kavita");
      assert.equal(found.total, 1);
      assert.equal(found.items[0].aadhar, "XXXX XXXX 9012"); // still masked
      assert.equal((await search("kavita", "&status=accepted")).total, 0); // combines with the status filter
      assert.equal((await search("nobody-matches-this")).total, 0);
      assert.equal((await search("%")).total, 0); // wildcards are matched literally
      assert.equal((await search("   ")).total, (await search("")).total); // blank = no search
    });

    it("updates the status of an application", async () => {
      const { items } = (await t.api("GET", "/api/admin/training-applications", admin)).body;
      const res = await t.api("PATCH", `/api/admin/training-applications/${items[0].id}`, {
        ...admin,
        body: { status: "accepted" },
      });
      assert.equal(res.body.item.status, "accepted");

      const filtered = await t.api("GET", "/api/admin/training-applications?status=accepted", admin);
      assert.equal(filtered.body.total, 1);

      const bad = await t.api("PATCH", `/api/admin/training-applications/${items[0].id}`, {
        ...admin,
        body: { status: "deleted" },
      });
      assert.equal(bad.status, 400);
      assert.equal((await t.api("GET", "/api/admin/training-applications?status=bogus", admin)).status, 400);
      assert.equal((await t.api("GET", "/api/admin/training-applications/unknown-id", admin)).status, 404);
    });

    it("lists contact messages, quote requests and subscribers", async () => {
      for (const path of ["contact-messages", "quote-requests", "subscribers"]) {
        const res = await t.api("GET", `/api/admin/${path}`, admin);
        assert.equal(res.status, 200, path);
        assert.ok(res.body.total >= 1, path);
      }
    });
  });

  describe("errors", () => {
    it("rejects malformed JSON with 400", async () => {
      const res = await t.api("POST", "/api/contact", { raw: "{not json" });
      assert.equal(res.status, 400);
      assert.equal(res.body.message, "Request body must be valid JSON.");
    });

    it("returns JSON 404 for unknown routes", async () => {
      const res = await t.api("GET", "/api/nope");
      assert.equal(res.status, 404);
      assert.equal(res.body.ok, false);
    });
  });
});

describe("configuration", () => {
  it("disables the admin API when ADMIN_API_KEY is empty", async () => {
    const t = await startTestServer({ ADMIN_API_KEY: "" });
    try {
      assert.equal((await t.api("GET", "/api/admin/stats", admin)).status, 404);
    } finally {
      await t.close();
    }
  });

  it("only allows configured CORS origins", async () => {
    const t = await startTestServer({ CORS_ORIGIN: "https://sumedhaagro.com,https://www.sumedhaagro.com" });
    try {
      const allowed = await t.api("GET", "/api/health", { headers: { Origin: "https://www.sumedhaagro.com" } });
      assert.equal(allowed.headers.get("access-control-allow-origin"), "https://www.sumedhaagro.com");
      const blocked = await t.api("GET", "/api/health", { headers: { Origin: "https://evil.example" } });
      assert.equal(blocked.headers.get("access-control-allow-origin"), null);
    } finally {
      await t.close();
    }
  });

  it("refuses to start without a database URL for the chosen driver", async () => {
    const { loadConfig } = await import("../src/config.js");
    const prod = loadConfig({ NODE_ENV: "production" });
    assert.equal(prod.config.db.driver, "mongodb", "MongoDB is the default driver");
    assert.ok(prod.errors.some((e) => e.includes("MONGODB_URI")));
    assert.ok(loadConfig({ DB_DRIVER: "postgres", MONGODB_URI: "mongodb://x" }).errors.some((e) => e.includes("DB_DRIVER")));
    assert.deepEqual(loadConfig({ DB_DRIVER: "memory" }).errors, []);
  });

  it("reads Cloudinary settings from CLOUDINARY_URL", async () => {
    const { loadConfig } = await import("../src/config.js");
    const { config } = loadConfig({ DB_DRIVER: "memory", CLOUDINARY_URL: "cloudinary://key123:sec%2F456@my-cloud" });
    assert.equal(config.cloudinary.enabled, true);
    assert.equal(config.cloudinary.cloudName, "my-cloud");
    assert.equal(config.cloudinary.apiKey, "key123");
    assert.equal(config.cloudinary.apiSecret, "sec/456");
    assert.ok(loadConfig({ DB_DRIVER: "memory", CLOUDINARY_URL: "https://nope" }).errors.length > 0);
  });
});
