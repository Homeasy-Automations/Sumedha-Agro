import { Router } from "express";
import { rateLimit } from "../middleware/index.js";

// An applicant needs one upload per submission; retries and a few mistakes fit well within this.
const SCREENSHOT_UPLOADS = { windowMs: 60 * 60 * 1000, max: 20 };

export function publicRoutes({ services, db, storage }) {
  const router = Router();

  // Liveness only: never touches the database. Used by the keep-awake workflow and Render's
  // health check, so frequent pings add no database load and a brief database outage
  // doesn't make Render restart the API.
  router.get("/ping", (req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({ ok: true });
  });

  // Also checks the database connection. For manual checks and monitoring, not frequent pings.
  router.get("/health", async (req, res) => {
    const up = await db.ping();
    res.status(up ? 200 : 503).json({ ok: up, db: { driver: db.name, status: up ? "up" : "down" } });
  });

  router.post("/training/apply", async (req, res) => {
    const application = await services.training.apply(req.body);
    res.status(201).json({ ok: true, referenceId: application.referenceId });
  });

  // Signed parameters for uploading the applicant's payment screenshot straight to media
  // storage (one file per signature); its public_id is then sent as paymentScreenshotId.
  router.post("/training/payment-upload", rateLimit(SCREENSHOT_UPLOADS), (req, res) => {
    res.json({ ok: true, upload: storage.createUpload("screenshot") });
  });

  router.post("/contact", async (req, res) => {
    await services.contact.submit(req.body);
    res.status(201).json({ ok: true, message: "Thank you! Your message has been received." });
  });

  router.post("/quote", async (req, res) => {
    const quote = await services.quotes.submit(req.body);
    res.status(201).json({ ok: true, referenceId: quote.referenceId });
  });

  router.post("/subscribe", async (req, res) => {
    const { created } = await services.subscribers.subscribe(req.body);
    res
      .status(created ? 201 : 200)
      .json({ ok: true, message: created ? "Subscribed successfully." : "You're already subscribed." });
  });

  router.get("/visitors", async (req, res) => {
    res.json({ ok: true, count: await services.visitors.count() });
  });

  // The frontend calls this once per browser session.
  router.post("/visitors/hit", async (req, res) => {
    res.json({ ok: true, count: await services.visitors.hit() });
  });

  return router;
}
