// Starts the API on a random port with a fake mailer.
// Uses the in-memory driver unless TEST_DB_DRIVER=mongodb (with TEST_MONGODB_URI) is set.
import { randomBytes } from "node:crypto";
import { createApp } from "../../src/app.js";
import { loadConfig } from "../../src/config.js";
import { createDatabase } from "../../src/db/index.js";
import { createStorage } from "../../src/storage/index.js";
import { createCloudinaryStorage } from "../../src/storage/cloudinary.js";

export const ADMIN_KEY = "test-admin-key";
export const ADMIN_PASSWORD = "correct horse battery staple";

export function fakeMailer() {
  const sent = [];
  return {
    enabled: true,
    sent,
    async send(message) {
      sent.push(message);
    },
    sendInBackground(messages) {
      sent.push(...messages.filter(Boolean));
    },
  };
}

export const silentLogger = { log() {}, warn() {}, error() {} };

export const CLOUDINARY = {
  cloudName: "demo-cloud",
  apiKey: "1234567890",
  apiSecret: "test-secret",
  folder: "sumedha-test",
  apiBaseUrl: "https://api.cloudinary.test",
  deliveryBaseUrl: "https://res.cloudinary.test",
};

// Real Cloudinary signing and URL building; deletions are recorded instead of sent.
export function fakeStorage() {
  const destroyed = [];
  const storage = createCloudinaryStorage(CLOUDINARY, {
    fetchImpl: async (url, options) => {
      destroyed.push({ url, params: Object.fromEntries(new URLSearchParams(String(options.body))) });
      return new Response(JSON.stringify({ result: "ok" }), { status: 200 });
    },
  });
  return Object.assign(storage, { destroyed });
}

export function testEnv(overrides = {}) {
  return {
    NODE_ENV: "test",
    DB_DRIVER: process.env.TEST_DB_DRIVER || "memory",
    MONGODB_URI: process.env.TEST_MONGODB_URI || "",
    MONGODB_DB: `sumedha_test_${randomBytes(4).toString("hex")}`,
    ADMIN_API_KEY: ADMIN_KEY,
    COMPANY_EMAIL: "company@example.com",
    ...overrides,
  };
}

// Against MongoDB every test server gets its own database (MONGODB_DB above). Drop it afterwards,
// so repeated runs don't fill a hosted cluster (Atlas's free tier caps databases and collections).
export async function dropTestDatabase(config) {
  if (config.db.driver !== "mongodb") return;
  const { MongoClient } = await import("mongodb");
  const client = new MongoClient(config.db.mongodbUri, { serverSelectionTimeoutMS: 10_000 });
  try {
    await client.db(config.db.mongodbDb).dropDatabase();
  } finally {
    await client.close();
  }
}

// options.storage: "fake" (default) or "disabled" (no Cloudinary configured).
export async function startTestServer(overrides = {}, options = {}) {
  const { config, errors } = loadConfig(testEnv(overrides));
  if (errors.length > 0) throw new Error(errors.join(" "));

  const db = await createDatabase(config);
  const mailer = fakeMailer();
  const storage = options.storage === "disabled" ? createStorage(config) : fakeStorage();
  const app = createApp({ config, db, mailer, storage, logger: silentLogger });
  const server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  // `body` may be a plain object (sent as JSON) or FormData (sent as multipart).
  async function api(method, path, { body, headers = {}, raw } = {}) {
    const isForm = body instanceof FormData;
    const res = await fetch(baseUrl + path, {
      method,
      headers: isForm ? headers : { "Content-Type": "application/json", ...headers },
      body: raw ?? (isForm ? body : body === undefined ? undefined : JSON.stringify(body)),
    });
    const bytes = Buffer.from(await res.arrayBuffer());
    let json = null;
    try {
      json = JSON.parse(bytes.toString("utf8"));
    } catch {
      // non-JSON response (e.g. an image)
    }
    return { status: res.status, body: json, bytes, headers: res.headers };
  }

  return {
    api,
    db,
    mailer,
    storage,
    config,
    async close() {
      await new Promise((resolve) => server.close(resolve));
      await db.close();
      await dropTestDatabase(config);
    },
  };
}

export function validApplication(overrides = {}) {
  return {
    trainingAppliedFor: "Spawn Production Training",
    trainingDate: "2026-11-20",
    name: "Test Applicant",
    gender: "Female",
    category: "OBC",
    postalAddress: "Line 1\nLucknow",
    state: "Uttar Pradesh",
    mobile: "98765 43210",
    aadhar: "1234 5678 9012",
    email: "test@example.com",
    dateOfBirth: "1995-05-05",
    education: "B.Sc.",
    livingPlace: "Lucknow",
    employment: "Farmer",
    previousTraining: "Yes",
    previousTrainingDetails: "3-day course, KVK, 2024",
    cultivatedBefore: "No",
    ...overrides,
  };
}
