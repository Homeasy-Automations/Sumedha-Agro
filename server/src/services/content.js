// Content managed from the admin panel: gallery images, videos, news and the training schedule.
// Collections are small, so lists are read in full and sorted here; the repository
// contract stays simple (newest first) for every database driver.
// Image and video files live in media storage (Cloudinary); records keep their public_id.
import { parseVideoUrl, videoUrls as linkUrls } from "../utils/media.js";
import {
  galleryImageSchema,
  galleryUpdateSchema,
  newsItemSchema,
  trainingProgramSchema,
  uploadRequestSchema,
  videoLinkSchema,
  videoUpdateSchema,
  videoUploadSchema,
} from "../validation/schemas.js";
import { validate, ValidationError } from "../validation/validate.js";

const MAX_ITEMS = 500;

const all = async (repository) => (await repository.list({ limit: MAX_ITEMS })).items;
const oldestFirst = (a, b) => a.createdAt - b.createdAt;
const toInt = (value) => (value ? Number.parseInt(value, 10) : null);

function crud(repository, schema, toPublic, sort) {
  return {
    async list() {
      const items = await all(repository);
      return (sort ? items.sort(sort) : items).map(toPublic);
    },
    async create(input) {
      return toPublic(await repository.create(validate(input, schema)));
    },
    async update(id, input) {
      const record = await repository.update(id, validate(input, schema));
      return record ? toPublic(record) : null;
    },
    delete: (id) => repository.delete(id),
  };
}

export function createContentServices({ db, storage, logger = console }) {
  const { repositories } = db;

  // Remove the file from media storage after its record is gone. A failure here only
  // leaves an unused file in Cloudinary, so it is logged rather than reported.
  const destroyAsset = (kind, publicId) =>
    storage.destroy(kind, publicId).catch((err) => logger.error(`[storage] could not delete ${publicId}: ${err.message}`));

  const requireOwnAsset = (kind, publicId) => {
    if (!storage.isOwnAsset(kind, publicId)) {
      throw new ValidationError({ publicId: "Upload the file again; it was not found in this site's media storage." });
    }
  };

  // --- Uploads: signature for a direct browser-to-Cloudinary upload ----------
  const uploads = {
    create(input) {
      const { kind } = validate(input, uploadRequestSchema);
      return storage.createUpload(kind);
    },
  };

  // --- Gallery --------------------------------------------------------------
  const toPublicImage = (r) => ({
    id: r.id,
    ...storage.imageUrls(r.publicId),
    alt: r.alt,
    caption: r.caption,
    width: r.width,
    height: r.height,
    createdAt: r.createdAt,
  });

  const gallery = {
    async list() {
      return (await all(repositories.galleryImages)).map(toPublicImage);
    },
    async create(input) {
      const fields = validate(input, galleryImageSchema);
      requireOwnAsset("image", fields.publicId);
      const record = await repositories.galleryImages.create({
        publicId: fields.publicId,
        alt: fields.alt,
        caption: fields.caption,
        width: toInt(fields.width),
        height: toInt(fields.height),
      });
      return toPublicImage(record);
    },
    async update(id, input) {
      const record = await repositories.galleryImages.update(id, validate(input, galleryUpdateSchema));
      return record ? toPublicImage(record) : null;
    },
    async delete(id) {
      const record = await repositories.galleryImages.findById(id);
      if (!record || !(await repositories.galleryImages.delete(id))) return false;
      await destroyAsset("image", record.publicId);
      return true;
    },
  };

  // --- Videos: uploaded files (Cloudinary) or YouTube / Vimeo links ----------
  const toPublicVideo = (r) => {
    if (r.provider === "upload") {
      const { videoUrl, posterUrl } = storage.videoUrls(r.publicId);
      return { id: r.id, title: r.title, provider: "upload", videoUrl, thumbnailUrl: posterUrl, createdAt: r.createdAt };
    }
    return { id: r.id, title: r.title, provider: r.provider, videoId: r.videoId, ...linkUrls(r), createdAt: r.createdAt };
  };

  const videos = {
    async list() {
      return (await all(repositories.videos)).map(toPublicVideo);
    },
    async create(input) {
      if (input?.publicId) {
        const { publicId, title } = validate(input, videoUploadSchema);
        requireOwnAsset("video", publicId);
        return toPublicVideo(await repositories.videos.create({ title, provider: "upload", publicId }));
      }
      const { url, title } = validate(input, videoLinkSchema);
      const parsed = parseVideoUrl(url);
      if (!parsed) throw new ValidationError({ url: "Paste a YouTube or Vimeo video link." });
      return toPublicVideo(await repositories.videos.create({ title, url, ...parsed }));
    },
    async update(id, input) {
      const record = await repositories.videos.update(id, validate(input, videoUpdateSchema));
      return record ? toPublicVideo(record) : null;
    },
    async delete(id) {
      const record = await repositories.videos.findById(id);
      if (!record || !(await repositories.videos.delete(id))) return false;
      if (record.provider === "upload") await destroyAsset("video", record.publicId);
      return true;
    },
  };

  // --- News & announcements (latest date first) ----------------------------
  const toPublicNews = (r) => ({ id: r.id, title: r.title, date: r.date, body: r.body, link: r.link, createdAt: r.createdAt });
  const news = crud(
    repositories.newsItems,
    newsItemSchema,
    toPublicNews,
    (a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt,
  );

  // --- Training schedule (in the order rows were added) --------------------
  const toPublicTraining = (r) => ({
    id: r.id,
    title: r.title,
    dates: r.dates,
    duration: r.duration,
    fees: r.fees,
    admissionStatus: r.admissionStatus,
    createdAt: r.createdAt,
  });
  const trainings = crud(repositories.trainingPrograms, trainingProgramSchema, toPublicTraining, oldestFirst);

  return { uploads, gallery, videos, news, trainings };
}
