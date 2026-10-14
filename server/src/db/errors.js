// Errors every driver throws in the same shape, so services never see database-specific errors.

export class DuplicateKeyError extends Error {
  constructor(field) {
    super(`A record with this ${field} already exists.`);
    this.name = "DuplicateKeyError";
    this.field = field;
  }
}

export class InvalidQueryError extends Error {
  constructor(field, message = `Filter value for "${field}" must be a string, number, boolean or null.`) {
    super(message);
    this.name = "InvalidQueryError";
    this.field = field;
  }
}

// Filters are equality-only ({ field: value }) so they translate to any database.
// Rejecting objects also blocks operator injection such as { email: { $ne: "" } }.
export function assertPlainWhere(where = {}) {
  for (const [field, value] of Object.entries(where)) {
    if (value !== null && typeof value === "object") throw new InvalidQueryError(field);
  }
  return where;
}

export const MAX_SEARCH_LENGTH = 100;
const FIELD_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;

// Text search for list(): `{ text, fields }` matches records where any of the (string) fields
// contains `text`, ignoring case. Returns null when there is nothing to search for.
// The text is matched literally (no wildcards or patterns). Field names come from service
// code, but are checked anyway so they can never become operators or nested paths.
export function normalizeSearch(search) {
  if (search == null) return null;
  const text = typeof search.text === "string" ? search.text.trim().slice(0, MAX_SEARCH_LENGTH) : "";
  if (!text) return null;
  const fields = Array.isArray(search.fields) ? search.fields : [];
  if (fields.length === 0 || !fields.every((f) => typeof f === "string" && FIELD_NAME.test(f))) {
    throw new InvalidQueryError("search.fields", "search.fields must be a non-empty list of plain field names.");
  }
  return { text, fields };
}
