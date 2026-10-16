import content from "../data/content";

const { trainingCalendar: cal, trainingDetails: details } = content;
const tableText = (group) => cal.tables.find((t) => t.group === group);

// Editable text of the Training page (admin panel: Training page text), with the website's
// defaults from content.js. Same shape as the API's (server/src/validation/trainingPage.js).
export const TRAINING_PAGE_DEFAULTS = {
  calendar: {
    notice: { label: cal.notice.label, text: cal.notice.text },
    tables: {
      cultivation: { heading: tableText("cultivation").heading },
      spawn: {
        heading: tableText("spawn").heading,
        headingNote: tableText("spawn").headingNote ?? "",
        subLine: tableText("spawn").subLine ?? "",
      },
    },
    notes: {
      query: cal.notes.query,
      seats: cal.notes.seats,
      specialNote: {
        heading: cal.notes.specialNote.heading,
        title: cal.notes.specialNote.title,
        items: cal.notes.specialNote.items,
      },
      howToRegister: { heading: cal.notes.howToRegister.heading, sentences: cal.notes.howToRegister.sentences },
    },
    terms: {
      important: { label: cal.terms.important.label, text: cal.terms.important.text },
      note: { label: cal.terms.note.label, items: cal.terms.note.items },
    },
  },
  details: {
    heading: details.heading,
    intro: details.intro,
    mushrooms: details.mushrooms,
    aspectsIntro: details.aspectsIntro,
    aspects: details.aspects,
    closing: details.closing,
    courseHeading: details.courseHeading,
    courseSections: details.courseSections,
  },
};

const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

// Saved values win, key by key; anything missing or of the wrong type keeps its default.
// An empty string or list is a deliberate choice (that text is hidden), not a missing value.
function merge(defaults, saved) {
  if (isPlainObject(defaults)) {
    const source = isPlainObject(saved) ? saved : {};
    return Object.fromEntries(Object.keys(defaults).map((key) => [key, merge(defaults[key], source[key])]));
  }
  if (Array.isArray(defaults)) return Array.isArray(saved) ? saved : defaults;
  return typeof saved === "string" ? saved : defaults;
}

export const mergeTrainingPage = (saved) => merge(TRAINING_PAGE_DEFAULTS, saved);

export const hasText = (value) => typeof value === "string" && value.trim() !== "";

// False when every part of the Training Details section has been emptied (it is then hidden).
export const hasTrainingDetails = (details) =>
  [details.heading, details.intro, details.aspectsIntro, details.closing, details.courseHeading].some(hasText) ||
  details.mushrooms.length > 0 ||
  details.aspects.length > 0 ||
  details.courseSections.length > 0;
