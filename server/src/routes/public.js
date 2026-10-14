import { Router } from "express";

export function publicRoutes({ services, db }) {
  const router = Router();

  // Liveness only: never touches the database. Used by the keep-awake workflow and Render's
  // health check, so pinging the API doesn't wake a scale-to-zero database (e.g. Neon)
  // and burn its free compute hours.
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
