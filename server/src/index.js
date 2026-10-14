import "dotenv/config";
import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { createDatabase } from "./db/index.js";
import { createMailer } from "./mail/mailer.js";
import { createStorage } from "./storage/index.js";

const { config, errors, warnings } = loadConfig();
for (const warning of warnings) console.warn(`[config] ${warning}`);
if (errors.length > 0) {
  for (const error of errors) console.error(`[config] ${error}`);
  process.exit(1);
}

let db;
try {
  db = await createDatabase(config);
} catch (err) {
  console.error(`[db] could not connect (${config.db.driver}): ${err.message}`);
  process.exit(1);
}

const app = createApp({ config, db, mailer: createMailer(config.mail), storage: createStorage(config) });
const server = app.listen(config.port, () => {
  console.log(`Sumedha Agro API listening on port ${config.port} (db: ${db.name}, env: ${config.nodeEnv})`);
});

async function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  server.close();
  await db.close();
  process.exit(0);
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
