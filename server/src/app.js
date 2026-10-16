import cors from "cors";
import express from "express";
import helmet from "helmet";
import { createTemplates } from "./mail/templates.js";
import { errorHandler, notFound } from "./middleware/index.js";
import { adminRoutes } from "./routes/admin.js";
import { contentRoutes } from "./routes/content.js";
import { publicRoutes } from "./routes/public.js";
import { createServices } from "./services/index.js";
import { createAdminSessions } from "./utils/adminSession.js";

// Builds the Express app from its dependencies, so tests can pass an in-memory
// database, a fake mailer and fake media storage.
export function createApp({ config, db, mailer, storage, logger = console }) {
  const services = createServices({
    db,
    storage,
    mailer,
    templates: createTemplates({ companyEmail: config.mail.companyEmail }),
    logger,
  });

  const sessions = createAdminSessions({ password: config.adminPassword });

  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1); // Render and most hosts sit behind one proxy.

  app.use(helmet());
  app.use(cors({ origin: config.corsOrigins.length > 0 ? config.corsOrigins : true }));
  app.use(express.json({ limit: "100kb" }));

  app.get("/", (req, res) => res.json({ ok: true, name: "Sumedha Agro API" }));
  app.use("/api/admin", adminRoutes({ services, config, sessions }));
  app.use("/api", publicRoutes({ services, db, storage }));
  app.use("/api", contentRoutes({ services }));

  app.use(notFound);
  app.use(errorHandler(logger));
  return app;
}
