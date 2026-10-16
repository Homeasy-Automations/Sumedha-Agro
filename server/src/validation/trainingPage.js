// Editable text of the Training page: the Training Calendar's notes and table headings, and the
// Training Details / Course Contents section. Mirrors the frontend's defaults in
// frontend/src/data/content.js (trainingCalendar, trainingDetails); keys left out of a save keep
// the website's default text, and an empty string hides that piece of text.
import { MESSAGES, ValidationError } from "./validate.js";

const text = (max) => ({ max });
const list = (maxItems, item) => ({ maxItems, item });

export const TRAINING_PAGE_SHAPE = {
  calendar: {
    notice: { label: text(100), text: text(500) },
    tables: {
      cultivation: { heading: text(200) },
      spawn: { heading: text(200), headingNote: text(100), subLine: text(500) },
    },
    notes: {
      query: text(300),
      seats: text(100),
      specialNote: {
        heading: text(100),
        title: text(200),
        items: list(20, { label: text(100), text: text(1000) }),
      },
      howToRegister: { heading: text(100), sentences: list(20, text(500)) },
    },
    terms: {
      important: { label: text(100), text: text(1000) },
      note: { label: text(100), items: list(30, text(500)) },
    },
  },
  details: {
    heading: text(100),
    intro: text(1000),
    mushrooms: list(30, text(300)),
    aspectsIntro: text(1000),
    aspects: list(30, text(300)),
    closing: text(2000),
    courseHeading: text(100),
    courseSections: list(10, { title: text(200), items: list(60, text(300)) }),
  },
};

const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const isText = (spec) => "max" in spec;
const isList = (spec) => "maxItems" in spec;

const isEmpty = (value) =>
  value === "" || (Array.isArray(value) && value.length === 0) || (isPlainObject(value) && Object.values(value).every(isEmpty));

function normalize(value, spec, path, errors) {
  if (isText(spec)) {
    const result = typeof value === "string" ? value.trim() : "";
    if (result.length > spec.max) errors[path] = MESSAGES.tooLong(spec.max);
    return result;
  }
  if (isList(spec)) {
    const items = (Array.isArray(value) ? value : [])
      .map((item, i) => normalize(item, spec.item, `${path}.${i}`, errors))
      .filter((item) => !isEmpty(item)); // blank lines and empty entries are dropped
    if (items.length > spec.maxItems) errors[path] = `At most ${spec.maxItems} entries.`;
    return items;
  }
  // Object: only known keys, and only those that were sent (the rest keep their defaults).
  const source = isPlainObject(value) ? value : {};
  const result = {};
  for (const [key, child] of Object.entries(spec)) {
    if (Object.hasOwn(source, key)) result[key] = normalize(source[key], child, path ? `${path}.${key}` : key, errors);
  }
  return result;
}

// Returns the cleaned content, or throws a ValidationError keyed by field path
// (e.g. "calendar.notes.specialNote.items.2.text").
export function validateTrainingPage(input) {
  const errors = {};
  const content = normalize(input, TRAINING_PAGE_SHAPE, "", errors);
  if (Object.keys(errors).length > 0) throw new ValidationError(errors);
  return content;
}
