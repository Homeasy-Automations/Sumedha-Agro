// Content managed from the admin panel: gallery images, videos, news, the training calendar
// and the Training page text.
// Collections are small, so lists are read in full and sorted here; the repository
// contract stays simple (newest first) for every database driver.
// Image and video files live in media storage (Cloudinary); records keep their public_id.
import { DuplicateKeyError } from "../db/errors.js";
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
import { validateTrainingPage } from "../validation/trainingPage.js";
import { validate, ValidationError } from "../validation/validate.js";

const MAX_ITEMS = 500;
const MAX_IMPORT = 100;
const TRAINING_PAGE_KEY = "trainingPage";

const all = async (repository) => (await repository.list({ limit: MAX_ITEMS })).items;
const oldestFirst = (a, b) => a.createdAt - b.createdAt;
const toInt = (value) => (value ? Number.parseInt(value, 10) : null);

// `check` runs after the schema, for rules that involve several fields.
function crud(repository, schema, toPublic, sort, check = (fields) => fields) {
  return {
    async list() {
      const items = await all(repository);
      return (sort ? items.sort(sort) : items).map(toPublic);
    },
    async create(input) {
      return toPublic(await repository.create(check(validate(input, schema))));
    },
    async update(id, input) {
      const record = await repository.update(id, check(validate(input, schema)));
      return record ? toPublic(record) : null;
    },
    delete: (id) => repository.delete(id),
  };
}

// Registration needs both its opening and closing date (or neither), and no range may end
// before it starts. ISO dates compare correctly as strings.
function checkTrainingDates(fields) {
  const errors = {};
  if (Boolean(fields.registrationStart) !== Boolean(fields.registrationEnd)) {
    errors[fields.registrationStart ? "registrationEnd" : "registrationStart"] = "Enter both registration dates, or neither.";
  } else if (fields.registrationEnd < fields.registrationStart) {
    errors.registrationEnd = "Must be on or after the opening date.";
  }
  if (fields.startDate && fields.endDate && fields.endDate < fields.startDate) {
    errors.endDate = "Must be on or after the start date.";
  }
  if (Object.keys(errors).length > 0) throw new ValidationError(errors);
  return fields;
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

  // --- Training calendar batches (in the order rows were added) ------------
  // Rows saved before the calendar fields existed have none of them; they read as "".
  const toPublicTraining = (r) => ({
    id: r.id,
    ...Object.fromEntries(Object.keys(trainingProgramSchema).map((field) => [field, r[field] ?? ""])),
    createdAt: r.createdAt,
  });
  const trainings = {
    ...crud(repositories.trainingPrograms, trainingProgramSchema, toPublicTraining, oldestFirst, checkTrainingDates),

    // Adds several batches at once (e.g. the website's built-in calendar), in the given order.
    // Everything is validated first, so a bad row adds nothing. Only allowed while the calendar
    // is empty, so importing twice can't duplicate it.
    async importMany(input) {
      const rows = Array.isArray(input?.items) ? input.items : [];
      if (rows.length === 0) throw new ValidationError({ items: "Nothing to import." });
      if (rows.length > MAX_IMPORT) throw new ValidationError({ items: `At most ${MAX_IMPORT} batches at a time.` });
      if ((await repositories.trainingPrograms.list({ limit: 1 })).total > 0) {
        throw new ValidationError({ items: "The calendar already has batches. Add new batches one by one instead." });
      }

      const errors = {};
      const valid = rows.map((row, i) => {
        try {
          return checkTrainingDates(validate(row, trainingProgramSchema));
        } catch (err) {
          if (!(err instanceof ValidationError)) throw err;
          for (const [field, message] of Object.entries(err.errors)) errors[`items.${i}.${field}`] = message;
          return null;
        }
      });
      if (Object.keys(errors).length > 0) throw new ValidationError(errors);

      const created = [];
      for (const fields of valid) created.push(toPublicTraining(await repositories.trainingPrograms.create(fields)));
      return created;
    },
  };

  // --- Training page text (calendar notes, Training Details, Course Contents) -----
  // One record; null until saved from the admin panel (the website then shows its defaults).
  const findTrainingPage = () => repositories.siteSettings.findOne({ key: TRAINING_PAGE_KEY });
  const toPublicPage = (record) => (record ? { content: JSON.parse(record.value), updatedAt: record.updatedAt } : null);

  const trainingPage = {
    get: async () => toPublicPage(await findTrainingPage()),

    async save(input) {
      const value = JSON.stringify(validateTrainingPage(input));
      const existing = await findTrainingPage();
      if (existing) return toPublicPage(await repositories.siteSettings.update(existing.id, { value }));
      try {
        return toPublicPage(await repositories.siteSettings.create({ key: TRAINING_PAGE_KEY, value }));
      } catch (err) {
        if (!(err instanceof DuplicateKeyError)) throw err;
        // Another save created it a moment ago: update that one instead.
        const created = await findTrainingPage();
        return toPublicPage(await repositories.siteSettings.update(created.id, { value }));
      }
    },

    // Back to the website's default text.
    async reset() {
      const existing = await findTrainingPage();
      if (existing) await repositories.siteSettings.delete(existing.id);
    },
  };

  return { uploads, gallery, videos, news, trainings, trainingPage };
}
