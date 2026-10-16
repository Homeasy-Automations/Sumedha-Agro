import { lowerCase, stripSeparators } from "./validate.js";

// Keep in sync with frontend/src/data/trainingForm.js.
export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const YES_NO = ["Yes", "No"];

export const TRAINING_STATUSES = ["new", "reviewed", "accepted", "rejected"];

export const trainingApplicationSchema = {
  trainingAppliedFor: { required: true, max: 200 },
  // The batch's start date, filled in by the form from the chosen batch. Optional when a
  // batch is named (a batch without a start date yet still carries its dates in the label).
  trainingDate: { required: true, check: "date" },
  // The Training Calendar batch applied for: its id and a readable label such as
  // "S. No. 6 · 16-27 Nov 2026", saved as sent.
  trainingBatchId: { max: 100 },
  trainingBatch: { max: 300 },
  // Screenshot (or PDF receipt) of the fee payment, uploaded by the applicant to media storage:
  // its public_id and the format Cloudinary reported (e.g. "webp", "pdf").
  paymentScreenshotId: { max: 300 },
  paymentScreenshotFormat: { max: 10, normalize: (v) => v.toLowerCase() },
  name: { required: true, max: 150 },
  gender: { required: true, oneOf: ["Male", "Female"] },
  category: { required: true, oneOf: ["SC", "ST", "OBC", "General"] },
  postalAddress: { required: true, max: 1000 },
  state: { required: true, oneOf: INDIAN_STATES },
  mobile: { required: true, normalize: stripSeparators, check: "mobile" },
  aadhar: { required: true, normalize: stripSeparators, check: "aadhar" },
  email: { required: true, max: 254, check: "email" },
  dateOfBirth: { required: true, check: "pastDate" },
  education: { required: true, max: 200 },
  livingPlace: { required: true, max: 200 },
  employment: { required: true, max: 200 },
  previousTraining: { required: true, oneOf: YES_NO },
  previousTrainingDetails: { max: 2000 },
  cultivatedBefore: { required: true, oneOf: YES_NO },
  clientReferenceId: { max: 20 },
};

// Accepts both the Contact page ("fullName", "phone") and the older CTA form ("name").
export const contactMessageSchema = {
  name: { required: true, max: 150, from: ["fullName"] },
  email: { required: true, max: 254, check: "email" },
  phone: { max: 30 },
  company: { max: 200 },
  interest: { max: 200 },
  message: { max: 5000 },
};

export const quoteRequestSchema = {
  product: { required: true, max: 200 },
  volume: { max: 50 },
  packaging: { max: 200 },
  frequency: { max: 100 },
  company: { max: 200 },
  gst: { max: 20 },
  name: { required: true, max: 150 },
  email: { required: true, max: 254, check: "email" },
  notes: { max: 5000 },
  address: { max: 500 },
  city: { max: 100 },
  state: { max: 100 },
  postalCode: { max: 20 },
  country: { max: 100 },
  shippingMethod: { max: 100 },
  deliveryDate: { max: 30 },
};

export const subscriberSchema = {
  email: { required: true, max: 254, normalize: lowerCase, check: "email" },
};

// --- Content managed from the admin panel -----------------------------------

// Gallery images and video files are uploaded by the browser straight to Cloudinary;
// these describe the uploaded asset.
export const galleryImageSchema = {
  publicId: { required: true, max: 300 },
  alt: { max: 200 },
  caption: { max: 300 },
  width: { check: "dimension" },
  height: { check: "dimension" },
};

export const galleryUpdateSchema = {
  alt: { max: 200 },
  caption: { max: 300 },
};

export const videoLinkSchema = {
  url: { required: true, max: 500, check: "url" },
  title: { required: true, max: 200 },
};

export const videoUploadSchema = {
  publicId: { required: true, max: 300 },
  title: { required: true, max: 200 },
};

export const uploadRequestSchema = {
  kind: { required: true, oneOf: ["image", "video"] },
};

export const videoUpdateSchema = {
  title: { required: true, max: 200 },
};

export const newsItemSchema = {
  title: { required: true, max: 200 },
  date: { required: true, check: "date" },
  body: { max: 5000 },
  link: { max: 500, check: "url" },
};

// Tables of the Training Calendar; a batch with no group is listed in a final table.
export const TRAINING_GROUPS = ["cultivation", "spawn"];

// One batch (row) of the Training Calendar. Empty text fields show "To be announced" on the
// website. Dates are Indian dates (YYYY-MM-DD) and drive the registration status; `dates` and
// `registrationDates` are optional display text (built from those dates when empty).
export const trainingProgramSchema = {
  group: { max: 40, oneOf: TRAINING_GROUPS },
  sNo: { max: 5, check: "dimension" },
  title: { required: true, max: 200 },
  dates: { max: 100 },
  startDate: { check: "date" },
  endDate: { check: "date" },
  registrationDates: { max: 100 },
  registrationStart: { check: "date" },
  registrationEnd: { check: "date" },
  registrationLink: { max: 500, check: "url" },
  fees: { max: 100 },
  language: { max: 100 },
  duration: { max: 100 },
  coordinator: { max: 300 },
  note: { max: 300 },
  admissionStatus: { max: 100 },
};

export const statusUpdateSchema = {
  status: { required: true, oneOf: TRAINING_STATUSES },
};
