// Business logic. Services only use the repository contract from src/db, so they work
// with any database driver.
import { COUNTERS } from "../db/entities.js";
import { DuplicateKeyError } from "../db/errors.js";
import { createContentServices } from "./content.js";
import { createWithReference, PREFIXES } from "../utils/reference.js";
import {
  contactMessageSchema,
  quoteRequestSchema,
  statusUpdateSchema,
  subscriberSchema,
  trainingApplicationSchema,
} from "../validation/schemas.js";
import { stripSeparators, validate, ValidationError } from "../validation/validate.js";

export const maskAadhar = (aadhar) => (aadhar ? `XXXX XXXX ${String(aadhar).slice(-4)}` : "");

// Fields the admin search box looks in.
const APPLICATION_SEARCH_FIELDS = ["referenceId", "name", "email", "mobile", "trainingAppliedFor", "trainingBatch", "state"];

// With a batch named, the training date may be empty (the batch label carries the dates).
const APPLICATION_WITH_BATCH = {
  ...trainingApplicationSchema,
  trainingDate: { ...trainingApplicationSchema.trainingDate, required: false },
};
const hasBatch = (input) => typeof input?.trainingBatch === "string" && input.trainingBatch.trim() !== "";

// A phone number typed as "98765 43210" or "98765-43210" finds the stored "9876543210".
function searchText(q) {
  const text = typeof q === "string" ? q.trim() : "";
  const digits = stripSeparators(text);
  return /^\d+$/.test(digits) ? digits : text;
}

// The payment screenshot the applicant must upload while media storage is set up.
function paymentScreenshotError(input, storage) {
  if (!storage.enabled) return "";
  const id = typeof input?.paymentScreenshotId === "string" ? input.paymentScreenshotId.trim() : "";
  if (!id) return "Upload a screenshot of your payment.";
  return storage.isOwnAsset("screenshot", id) ? "" : "Upload the payment screenshot again.";
}

// `storage` holds the applicants' payment screenshots.
function createTrainingService({ repository, mailer, templates, storage, logger }) {
  // Links to the payment screenshot (a PDF receipt is shown by its first page; `file` is the PDF).
  const screenshot = (record) =>
    record.paymentScreenshotId
      ? storage.screenshotUrls(record.paymentScreenshotId, record.paymentScreenshotFormat)
      : { src: "", thumbnailSrc: "", file: "" };

  // Lists, CSV exports and emails show only the last 4 Aadhar digits;
  // the full number appears only in the admin detail view.
  const toAdminView = (record, { reveal = false } = {}) => {
    const shot = screenshot(record);
    return {
      ...record,
      aadhar: reveal ? record.aadhar : maskAadhar(record.aadhar),
      paymentScreenshotUrl: shot.src,
      paymentScreenshotThumbUrl: shot.thumbnailSrc, // small square, for the admin list
      paymentScreenshotFileUrl: shot.file, // the uploaded file itself (the PDF, for a PDF)
    };
  };

  return {
    async apply(input) {
      const schema = hasBatch(input) ? APPLICATION_WITH_BATCH : trainingApplicationSchema;
      // The screenshot is reported together with the other fields' errors.
      const errors = {};
      let fields;
      try {
        fields = validate(input, schema);
      } catch (err) {
        if (!(err instanceof ValidationError)) throw err;
        Object.assign(errors, err.errors);
      }
      const screenshotError = paymentScreenshotError(input, storage);
      if (screenshotError) errors.paymentScreenshotId = screenshotError;
      if (Object.keys(errors).length > 0) throw new ValidationError(errors);

      const { clientReferenceId, ...values } = fields;
      if (values.previousTraining !== "Yes") values.previousTrainingDetails = "";
      if (!storage.enabled) {
        values.paymentScreenshotId = "";
        values.paymentScreenshotFormat = "";
      }

      const record = await createWithReference(repository, PREFIXES.training, { ...values, status: "new" }, clientReferenceId);
      mailer.sendInBackground(templates.trainingApplication({ ...record, paymentScreenshotUrl: screenshot(record).file }, maskAadhar(record.aadhar)));
      return record;
    },

    async list({ limit, offset, status, q }) {
      const page = await repository.list({
        where: status ? { status } : {},
        search: { text: searchText(q), fields: APPLICATION_SEARCH_FIELDS },
        limit,
        offset,
      });
      return { ...page, items: page.items.map((r) => toAdminView(r)) };
    },

    async get(id) {
      const record = await repository.findById(id);
      return record ? toAdminView(record, { reveal: true }) : null;
    },

    async updateStatus(id, input) {
      const { status } = validate(input, statusUpdateSchema);
      const record = await repository.update(id, { status });
      return record ? toAdminView(record) : null;
    },

    // Also removes the payment screenshot from media storage. A failure there only leaves an
    // unused file behind, so it is logged rather than reported.
    async delete(id) {
      const record = await repository.findById(id);
      if (!record || !(await repository.delete(id))) return false;
      if (record.paymentScreenshotId) {
        await storage
          .destroy("screenshot", record.paymentScreenshotId)
          .catch((err) => logger.error(`[storage] could not delete ${record.paymentScreenshotId}: ${err.message}`));
      }
      return true;
    },
  };
}

function createContactService({ repository, mailer, templates }) {
  return {
    async submit(input) {
      const record = await repository.create(validate(input, contactMessageSchema));
      mailer.sendInBackground(templates.contactMessage(record));
      return record;
    },
    list: (options) => repository.list(options),
    delete: (id) => repository.delete(id),
  };
}

function createQuoteService({ repository, mailer, templates }) {
  return {
    async submit(input) {
      const record = await createWithReference(repository, PREFIXES.quote, validate(input, quoteRequestSchema));
      mailer.sendInBackground(templates.quoteRequest(record));
      return record;
    },
    list: (options) => repository.list(options),
    delete: (id) => repository.delete(id),
  };
}

function createSubscriberService({ repository, mailer, templates }) {
  return {
    // Returns { created: false } for an address that is already subscribed.
    async subscribe(input) {
      const { email } = validate(input, subscriberSchema);
      if (await repository.findOne({ email })) return { created: false };
      try {
        const record = await repository.create({ email });
        mailer.sendInBackground(templates.subscriber(record));
        return { created: true };
      } catch (err) {
        if (err instanceof DuplicateKeyError) return { created: false };
        throw err;
      }
    },
    list: (options) => repository.list(options),
    delete: (id) => repository.delete(id),
  };
}

function createVisitorService({ counters }) {
  return {
    count: () => counters.get(COUNTERS.visitors),
    hit: () => counters.increment(COUNTERS.visitors),
  };
}

export function createServices({ db, storage, mailer, templates, logger = console }) {
  const { repositories, counters } = db;
  const shared = { mailer, templates, logger };

  const services = {
    training: createTrainingService({ repository: repositories.trainingApplications, storage, ...shared }),
    contact: createContactService({ repository: repositories.contactMessages, ...shared }),
    quotes: createQuoteService({ repository: repositories.quoteRequests, ...shared }),
    subscribers: createSubscriberService({ repository: repositories.subscribers, ...shared }),
    visitors: createVisitorService({ counters }),
    ...createContentServices({ db, storage, logger }),
  };

  // Totals for the admin dashboard: one per collection, plus the visitor count.
  services.stats = async () => {
    const names = Object.keys(repositories);
    const totals = await Promise.all(names.map(async (name) => (await repositories[name].list({ limit: 1 })).total));
    return { ...Object.fromEntries(names.map((name, i) => [name, totals[i]])), visitors: await services.visitors.count() };
  };

  return services;
}
