// Collections (tables) the app stores, described independently of any database.
// `unique` lists fields every driver must keep unique across the collection.
export const entities = {
  // Form submissions
  trainingApplications: { unique: ["referenceId"] },
  contactMessages: { unique: [] },
  quoteRequests: { unique: ["referenceId"] },
  subscribers: { unique: ["email"] },
  // Content managed from the admin panel
  galleryImages: { unique: [] },
  videos: { unique: [] },
  newsItems: { unique: [] },
  trainingPrograms: { unique: [] },
  // Editable page text, one record per `key` (e.g. "trainingPage"), stored as a JSON string.
  siteSettings: { unique: ["key"] },
};

export const COUNTERS = { visitors: "visitors" };
