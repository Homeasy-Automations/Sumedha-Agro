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
import { stripSeparators, validate } from "../validation/validate.js";

export const maskAadhar = (aadhar) => (aadhar ? `XXXX XXXX ${String(aadhar).slice(-4)}` : "");

// Fields the admin search box looks in.
const APPLICATION_SEARCH_FIELDS = ["referenceId", "name", "email", "mobile", "trainingAppliedFor", "trainingBatch", "state"];

// A phone number typed as "98765 43210" or "98765-43210" finds the stored "9876543210".
function searchText(q) {
  const text = typeof q === "string" ? q.trim() : "";
  const digits = stripSeparators(text);
  return /^\d+$/.test(digits) ? digits : text;
}

function createTrainingService({ repository, mailer, templates }) {
  // Lists, CSV exports and emails show only the last 4 Aadhar digits;
  // the full number appears only in the admin detail view.
  const toAdminView = (record, { reveal = false } = {}) => ({
    ...record,
    aadhar: reveal ? record.aadhar : maskAadhar(record.aadhar),
  });

  return {
    async apply(input) {
      const { clientReferenceId, ...fields } = validate(input, trainingApplicationSchema);
      if (fields.previousTraining !== "Yes") fields.previousTrainingDetails = "";

      const record = await createWithReference(repository, PREFIXES.training, { ...fields, status: "new" }, clientReferenceId);
      mailer.sendInBackground(templates.trainingApplication(record, maskAadhar(record.aadhar)));
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

    delete: (id) => repository.delete(id),
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
    training: createTrainingService({ repository: repositories.trainingApplications, ...shared }),
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
