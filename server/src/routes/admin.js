import { Router } from "express";
import { adminAuth, fail } from "../middleware/index.js";
import { TRAINING_STATUSES } from "../validation/schemas.js";

const MAX_PAGE = 100;

const toInt = (value, fallback) => {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
};

const pagination = (query) => ({
  limit: Math.min(Math.max(toInt(query.limit, 20), 1), MAX_PAGE),
  offset: Math.max(toInt(query.offset, 0), 0),
});

// POST (create), PUT /:id (replace editable fields), DELETE /:id for a content service.
function crudRoutes(router, path, service) {
  router.post(path, async (req, res) => res.status(201).json({ ok: true, item: await service.create(req.body) }));

  router.put(`${path}/:id`, async (req, res) => {
    const item = await service.update(req.params.id, req.body);
    if (!item) return fail(res, 404, "Not found.");
    return res.json({ ok: true, item });
  });

  router.delete(`${path}/:id`, async (req, res) => {
    if (!(await service.delete(req.params.id))) return fail(res, 404, "Not found.");
    return res.json({ ok: true });
  });
}

// Admin panel API. Everything except /login requires a session token or ADMIN_API_KEY.
export function adminRoutes({ services, config, sessions }) {
  const router = Router();

  router.post("/login", (req, res) => {
    if (!sessions) return fail(res, 404, "Admin login is not configured (set ADMIN_PASSWORD).");
    if (!sessions.checkPassword(req.body?.password)) return fail(res, 401, "Incorrect password.");
    return res.json({ ok: true, ...sessions.issue() });
  });

  router.use(adminAuth({ apiKey: config.adminApiKey, sessions }));

  router.get("/session", (req, res) => res.json({ ok: true }));

  router.get("/stats", async (req, res) => {
    res.json({ ok: true, totals: await services.stats() });
  });

  // --- Training applications ------------------------------------------------
  router.get("/training-applications", async (req, res) => {
    const status = typeof req.query.status === "string" ? req.query.status : "";
    if (status && !TRAINING_STATUSES.includes(status)) {
      return fail(res, 400, `status must be one of: ${TRAINING_STATUSES.join(", ")}.`);
    }
    const q = typeof req.query.q === "string" ? req.query.q : ""; // search text
    return res.json({ ok: true, ...(await services.training.list({ ...pagination(req.query), status, q })) });
  });

  router.get("/training-applications/:id", async (req, res) => {
    const application = await services.training.get(req.params.id);
    if (!application) return fail(res, 404, "Training application not found.");
    return res.json({ ok: true, item: application });
  });

  router.patch("/training-applications/:id", async (req, res) => {
    const application = await services.training.updateStatus(req.params.id, req.body);
    if (!application) return fail(res, 404, "Training application not found.");
    return res.json({ ok: true, item: application });
  });

  // --- Other submissions: list and delete (e.g. spam) -------------------------
  const submissions = {
    "training-applications": services.training,
    "contact-messages": services.contact,
    "quote-requests": services.quotes,
    subscribers: services.subscribers,
  };
  for (const [path, service] of Object.entries(submissions)) {
    if (path !== "training-applications") {
      router.get(`/${path}`, async (req, res) => {
        res.json({ ok: true, ...(await service.list(pagination(req.query))) });
      });
    }
    router.delete(`/${path}/:id`, async (req, res) => {
      if (!(await service.delete(req.params.id))) return fail(res, 404, "Not found.");
      return res.json({ ok: true });
    });
  }

  // --- Website content ----------------------------------------------------------
  // Signed parameters for uploading an image or video straight from the browser to
  // media storage; the result is then saved with POST /gallery or POST /videos.
  router.post("/uploads", (req, res) => {
    res.json({ ok: true, upload: services.uploads.create(req.body) });
  });

  crudRoutes(router, "/gallery", services.gallery);
  crudRoutes(router, "/videos", services.videos);
  crudRoutes(router, "/news", services.news);
  crudRoutes(router, "/trainings", services.trainings);

  // Several calendar batches at once (only while the calendar is empty).
  router.post("/trainings/import", async (req, res) => {
    res.status(201).json({ ok: true, items: await services.trainings.importMany(req.body) });
  });

  // Training page text: save (replaces the saved text) or reset to the website's defaults.
  router.put("/training-page", async (req, res) => {
    const page = await services.trainingPage.save(req.body);
    res.json({ ok: true, item: page.content, updatedAt: page.updatedAt });
  });

  router.delete("/training-page", async (req, res) => {
    await services.trainingPage.reset();
    res.json({ ok: true });
  });

  return router;
}
