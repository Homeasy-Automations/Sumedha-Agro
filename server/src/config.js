// Reads and validates environment variables once, at startup.
import { availableDrivers } from "./db/index.js";

const list = (value) =>
  (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const int = (value, fallback) => {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) ? n : fallback;
};

// CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name> (as shown in the Cloudinary console),
// or the three CLOUDINARY_* variables separately.
function cloudinaryConfig(env) {
  let cloudName = env.CLOUDINARY_CLOUD_NAME || "";
  let apiKey = env.CLOUDINARY_API_KEY || "";
  let apiSecret = env.CLOUDINARY_API_SECRET || "";
  let urlError = "";
  if (env.CLOUDINARY_URL) {
    try {
      const url = new URL(env.CLOUDINARY_URL);
      if (url.protocol !== "cloudinary:") throw new Error();
      cloudName = url.hostname;
      apiKey = decodeURIComponent(url.username);
      apiSecret = decodeURIComponent(url.password);
    } catch {
      urlError = "CLOUDINARY_URL must look like cloudinary://<api_key>:<api_secret>@<cloud_name>.";
    }
  }
  return {
    enabled: Boolean(cloudName && apiKey && apiSecret),
    cloudName,
    apiKey,
    apiSecret,
    folder: (env.CLOUDINARY_FOLDER || "sumedha-agro").replace(/^\/+|\/+$/g, ""),
    // Overridable for tests or a proxy; normally left unset.
    apiBaseUrl: env.CLOUDINARY_API_BASE || "https://api.cloudinary.com",
    deliveryBaseUrl: env.CLOUDINARY_DELIVERY_BASE || "https://res.cloudinary.com",
    urlError,
  };
}

export function loadConfig(env = process.env) {
  const nodeEnv = env.NODE_ENV || "development";
  const isProduction = nodeEnv === "production";

  const config = {
    nodeEnv,
    isProduction,
    port: int(env.PORT, 5000),
    db: {
      driver: (env.DB_DRIVER || "mongodb").toLowerCase(),
      mongodbUri: env.MONGODB_URI || "",
      mongodbDb: env.MONGODB_DB || "",
    },
    corsOrigins: list(env.CORS_ORIGIN),
    adminApiKey: env.ADMIN_API_KEY || "",
    adminPassword: env.ADMIN_PASSWORD || "",
    cloudinary: cloudinaryConfig(env),
    mail: {
      enabled: Boolean(env.RESEND_API_KEY && env.MAIL_FROM),
      resendApiKey: env.RESEND_API_KEY || "",
      // Must use a domain verified in Resend, e.g. "Sumedha Agro <info@sumedhaagro.com>".
      from: env.MAIL_FROM || "",
      companyEmail: env.COMPANY_EMAIL || "",
    },
  };

  const errors = [];
  const warnings = [];

  if (!availableDrivers.includes(config.db.driver)) {
    errors.push(`DB_DRIVER="${config.db.driver}" is not supported. Use mongodb, or memory to run without a database.`);
  }
  if (config.db.driver === "mongodb" && !config.db.mongodbUri) {
    errors.push("MONGODB_URI is required (your MongoDB Atlas connection string), or set DB_DRIVER=memory to run without a database.");
  }
  if (config.cloudinary.urlError) errors.push(config.cloudinary.urlError);
  if (isProduction && config.db.driver === "memory") {
    warnings.push("DB_DRIVER=memory in production: all data is lost when the server restarts.");
  }
  if (isProduction && config.corsOrigins.length === 0) {
    warnings.push("CORS_ORIGIN is not set: the API accepts requests from any website.");
  }
  if (!config.cloudinary.enabled) {
    warnings.push("Cloudinary is not configured: image and video uploads in the admin panel are disabled.");
  }
  if (!config.mail.enabled) {
    warnings.push("RESEND_API_KEY or MAIL_FROM is not set: submissions are saved but no emails are sent.");
  } else if (!config.mail.companyEmail) {
    warnings.push("COMPANY_EMAIL is not set: no notification emails will be sent to the company.");
  }
  if (!config.adminPassword && !config.adminApiKey) {
    warnings.push("ADMIN_PASSWORD and ADMIN_API_KEY are not set: the admin panel and /api/admin are disabled.");
  } else if (!config.adminPassword) {
    warnings.push("ADMIN_PASSWORD is not set: the admin panel login is disabled (ADMIN_API_KEY still works for scripts).");
  } else if (isProduction && config.adminPassword.length < 12) {
    warnings.push("ADMIN_PASSWORD is shorter than 12 characters: use a longer password in production.");
  }

  return { config, errors, warnings };
}
