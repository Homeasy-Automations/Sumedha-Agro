// Small schema validator shared by all forms. Messages match the frontend's inline errors.

export class ValidationError extends Error {
  constructor(errors) {
    super("Please correct the highlighted fields.");
    this.name = "ValidationError";
    this.errors = errors;
  }
}

export const MESSAGES = {
  required: "This field is required.",
  email: "Enter a valid email address.",
  mobile: "Enter a 10-digit mobile number.",
  aadhar: "Enter a 12-digit Aadhar number.",
  date: "Enter a valid date.",
  pastDate: "Date of birth must be in the past.",
  url: "Enter a full link starting with https://",
  dimension: "Must be a whole number.",
  option: "Select a valid option.",
  tooLong: (max) => `Must be at most ${max} characters.`,
};

const DEFAULT_MAX = 500;

const isRealDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const checks = {
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  mobile: (v) => /^\d{10}$/.test(v),
  aadhar: (v) => /^\d{12}$/.test(v),
  date: isRealDate,
  pastDate: (v) => isRealDate(v) && v < new Date().toISOString().slice(0, 10),
  url: (v) => {
    try {
      return /^https?:$/.test(new URL(v).protocol);
    } catch {
      return false;
    }
  },
  dimension: (v) => /^\d{1,5}$/.test(v),
};

export const stripSeparators = (v) => v.replace(/[\s-]/g, "");
export const lowerCase = (v) => v.toLowerCase();

const toText = (value) => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
};

// schema: { field: { required, max, oneOf, check, normalize, from: ["alias", ...] } }
// Only fields in the schema are kept, so unexpected input never reaches the database.
export function validate(input, schema) {
  const source = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const values = {};
  const errors = {};

  for (const [field, rule] of Object.entries(schema)) {
    const keys = [field, ...(rule.from ?? [])];
    let value = toText(keys.map((k) => source[k]).find((v) => toText(v) !== ""));
    if (value && rule.normalize) value = rule.normalize(value);
    values[field] = value;

    if (!value) {
      if (rule.required) errors[field] = MESSAGES.required;
    } else if (value.length > (rule.max ?? DEFAULT_MAX)) {
      errors[field] = MESSAGES.tooLong(rule.max ?? DEFAULT_MAX);
    } else if (rule.oneOf && !rule.oneOf.includes(value)) {
      errors[field] = MESSAGES.option;
    } else if (rule.check && !checks[rule.check](value)) {
      errors[field] = MESSAGES[rule.check];
    }
  }

  if (Object.keys(errors).length > 0) throw new ValidationError(errors);
  return values;
}
