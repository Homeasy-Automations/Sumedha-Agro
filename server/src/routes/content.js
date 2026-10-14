import { Router } from "express";

// Public, read-only content shown on the website (managed from the admin panel).
export function contentRoutes({ services }) {
  const router = Router();

  const lists = { gallery: services.gallery, videos: services.videos, news: services.news, trainings: services.trainings };
  for (const [name, service] of Object.entries(lists)) {
    router.get(`/content/${name}`, async (req, res) => {
      // Always revalidate (Express adds an ETag), so admin changes show up immediately.
      res.set("Cache-Control", "no-cache");
      res.json({ ok: true, items: await service.list() });
    });
  }

  return router;
}
