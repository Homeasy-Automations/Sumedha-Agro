import { useId, useState } from "react";
import { ExternalLink, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { invalidateSiteContent } from "../../hooks/useSiteContent";
import { mergeTrainingPage, TRAINING_PAGE_DEFAULTS } from "../../lib/trainingPage";
import { useAdmin } from "../session";
import { fieldProps } from "../styles";
import useAdminData from "../useAdminData";
import { Button, Card, DateTime, Field, Loading, Notice, PageTitle } from "../ui";

// Editable text of the Training page, saved as one record (PUT /api/admin/training-page).
// The form works on plain strings: lists are edited one entry per line.

const lines = (list) => list.join("\n");
// Blank lines are kept so the server's error paths ("…items.3") match the line numbers;
// the server drops them.
const toList = (text) => text.split("\n").map((line) => line.trim());

// Special note entries are "Label: text" lines. The label is the part up to the first colon
// when that part is short and has no digits (so a time like "9:30" is never taken for one).
const LABELLED = /^([^:\d]{1,40}:)\s*(.*)$/;
const toEntry = (line) => {
  const match = LABELLED.exec(line);
  return match ? { label: match[1].trim(), text: match[2] } : { label: "", text: line };
};
const fromEntry = (entry) => [entry.label, entry.text].filter(Boolean).join(" ");

function toForm(page) {
  const { notice, tables, notes, terms } = page.calendar;
  const d = page.details;
  return {
    noticeLabel: notice.label,
    noticeText: notice.text,
    cultivationHeading: tables.cultivation.heading,
    spawnHeading: tables.spawn.heading,
    spawnHeadingNote: tables.spawn.headingNote,
    spawnSubLine: tables.spawn.subLine,
    query: notes.query,
    seats: notes.seats,
    specialHeading: notes.specialNote.heading,
    specialTitle: notes.specialNote.title,
    specialItems: lines(notes.specialNote.items.map(fromEntry)),
    registerHeading: notes.howToRegister.heading,
    registerSentences: lines(notes.howToRegister.sentences),
    importantLabel: terms.important.label,
    importantText: terms.important.text,
    termsLabel: terms.note.label,
    termsItems: lines(terms.note.items),
    detailsHeading: d.heading,
    intro: d.intro,
    mushrooms: lines(d.mushrooms),
    aspectsIntro: d.aspectsIntro,
    aspects: lines(d.aspects),
    closing: d.closing,
    courseHeading: d.courseHeading,
    courseSections: d.courseSections.map((s) => ({ title: s.title, items: lines(s.items) })),
  };
}

function fromForm(f) {
  return {
    calendar: {
      notice: { label: f.noticeLabel, text: f.noticeText },
      tables: {
        cultivation: { heading: f.cultivationHeading },
        spawn: { heading: f.spawnHeading, headingNote: f.spawnHeadingNote, subLine: f.spawnSubLine },
      },
      notes: {
        query: f.query,
        seats: f.seats,
        specialNote: { heading: f.specialHeading, title: f.specialTitle, items: toList(f.specialItems).map(toEntry) },
        howToRegister: { heading: f.registerHeading, sentences: toList(f.registerSentences) },
      },
      terms: {
        important: { label: f.importantLabel, text: f.importantText },
        note: { label: f.termsLabel, items: toList(f.termsItems) },
      },
    },
    details: {
      heading: f.detailsHeading,
      intro: f.intro,
      mushrooms: toList(f.mushrooms),
      aspectsIntro: f.aspectsIntro,
      aspects: toList(f.aspects),
      closing: f.closing,
      courseHeading: f.courseHeading,
      courseSections: f.courseSections.map((s) => ({ title: s.title, items: toList(s.items) })),
    },
  };
}

// Form field -> where the server reports its errors.
const ONE_PER_LINE = "One per line.";
const CARDS = [
  {
    title: "Important instruction",
    description: "The highlighted line at the top of the Training Calendar.",
    fields: [
      { name: "noticeLabel", label: "Label (bold)", path: "calendar.notice.label", max: 100 },
      { name: "noticeText", label: "Text", path: "calendar.notice.text", max: 500, rows: 2, wide: true },
    ],
  },
  {
    title: "Table 1: mushroom cultivation technology",
    fields: [{ name: "cultivationHeading", label: "Table heading", path: "calendar.tables.cultivation.heading", max: 200, wide: true }],
  },
  {
    title: "Notes under table 1",
    description: "The left-hand panel below the first table. Email addresses and 10-digit phone numbers become links.",
    fields: [
      { name: "query", label: "Query line", path: "calendar.notes.query", max: 300, wide: true },
      { name: "seats", label: "Seats badge", path: "calendar.notes.seats", max: 100 },
      { name: "specialHeading", label: "Special note heading", path: "calendar.notes.specialNote.heading", max: 100 },
      { name: "specialTitle", label: "Special note title", path: "calendar.notes.specialNote.title", max: 200 },
      {
        name: "specialItems",
        label: "Special note points",
        path: "calendar.notes.specialNote.items",
        rows: 6,
        wide: true,
        hint: "One per line. Text before the first colon is shown in bold, e.g. “Eligibility: This session is for …”.",
      },
      { name: "registerHeading", label: "“How to register” heading", path: "calendar.notes.howToRegister.heading", max: 100 },
      { name: "registerSentences", label: "How to register", path: "calendar.notes.howToRegister.sentences", rows: 4, wide: true, hint: ONE_PER_LINE },
    ],
  },
  {
    title: "Terms",
    description: "The right-hand panel below the first table.",
    fields: [
      { name: "importantLabel", label: "Important: label (bold)", path: "calendar.terms.important.label", max: 100 },
      { name: "importantText", label: "Important: text", path: "calendar.terms.important.text", max: 1000, rows: 3, wide: true },
      { name: "termsLabel", label: "Notes heading", path: "calendar.terms.note.label", max: 100 },
      { name: "termsItems", label: "Notes", path: "calendar.terms.note.items", rows: 6, wide: true, hint: ONE_PER_LINE },
    ],
  },
  {
    title: "Table 2: mushroom spawn production technology",
    fields: [
      { name: "spawnHeading", label: "Table heading", path: "calendar.tables.spawn.heading", max: 200, wide: true },
      { name: "spawnHeadingNote", label: "Seats badge", path: "calendar.tables.spawn.headingNote", max: 100 },
      { name: "spawnSubLine", label: "Line under the heading", path: "calendar.tables.spawn.subLine", max: 500, wide: true },
    ],
  },
  {
    title: "Training Details",
    description: "The section after the Training Calendar.",
    fields: [
      { name: "detailsHeading", label: "Heading", path: "details.heading", max: 100 },
      { name: "intro", label: "Intro (above the mushroom list)", path: "details.intro", max: 1000, rows: 2, wide: true },
      { name: "mushrooms", label: "Mushrooms covered", path: "details.mushrooms", rows: 5, wide: true, hint: ONE_PER_LINE },
      { name: "aspectsIntro", label: "Intro (above the topics list)", path: "details.aspectsIntro", max: 1000, rows: 2, wide: true },
      { name: "aspects", label: "Topics covered", path: "details.aspects", rows: 7, wide: true, hint: ONE_PER_LINE },
      { name: "closing", label: "Closing paragraph", path: "details.closing", max: 2000, rows: 3, wide: true },
    ],
  },
];

// The error for a field: its own, or the first one inside it (with the line number for lists).
function errorFor(errors, path) {
  if (errors[path]) return errors[path];
  const key = Object.keys(errors).find((k) => k.startsWith(`${path}.`));
  if (!key) return "";
  const index = Number(key.slice(path.length + 1).split(".")[0]);
  return Number.isInteger(index) ? `Line ${index + 1}: ${errors[key]}` : errors[key];
}

function TextField({ id, field, value, error, onChange }) {
  const props = {
    ...fieldProps(id, error, Boolean(field.hint)),
    value,
    maxLength: field.max,
    onChange: (e) => onChange(e.target.value),
  };
  return (
    <Field id={id} label={field.label} hint={field.hint} error={error} className={field.wide ? "md:col-span-2" : ""}>
      {field.rows ? <textarea {...props} rows={field.rows} /> : <input {...props} type="text" />}
    </Field>
  );
}

function CourseSections({ uid, sections, errors, onChange }) {
  const update = (i, patch) => onChange(sections.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  return (
    <div className="flex flex-col gap-4 md:col-span-2">
      {sections.map((section, i) => {
        const path = `details.courseSections.${i}`;
        return (
          <fieldset key={i} className="rounded-xl border border-border-light p-4">
            <legend className="px-1 text-xs font-bold uppercase tracking-wider text-[#5b735b]">Course section {i + 1}</legend>
            <div className="grid gap-4">
              <TextField
                id={`${uid}-course-${i}-title`}
                field={{ label: "Section title", max: 200, hint: "e.g. (Entrepreneurs Training- Theory)" }}
                value={section.title}
                error={errorFor(errors, `${path}.title`)}
                onChange={(title) => update(i, { title })}
              />
              <TextField
                id={`${uid}-course-${i}-items`}
                field={{ label: "Topics", rows: 10, hint: "One per line. They are numbered on the website." }}
                value={section.items}
                error={errorFor(errors, `${path}.items`)}
                onChange={(items) => update(i, { items })}
              />
              <div>
                <Button variant="danger" icon={Trash2} onClick={() => onChange(sections.filter((_, j) => j !== i))}>
                  Remove this section
                </Button>
              </div>
            </div>
          </fieldset>
        );
      })}
      <div>
        <Button variant="secondary" icon={Plus} onClick={() => onChange([...sections, { title: "", items: "" }])}>
          Add a section
        </Button>
      </div>
    </div>
  );
}

export default function TrainingPageAdmin() {
  const { request } = useAdmin();
  const uid = useId();
  const { data, error: loadError, loading } = useAdminData("/api/content/training-page", { public: true });
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(null); // { updatedAt } when text is saved, false when on defaults
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState({ tone: "success", text: "" });
  const [busy, setBusy] = useState("");

  // Fill the form once, from what the website currently shows.
  if (data && form === null) {
    setForm(toForm(mergeTrainingPage(data.item)));
    setSaved(data.item ? { updatedAt: data.updatedAt } : false);
  }

  const set = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const save = async (e) => {
    e.preventDefault();
    setBusy("save");
    setNotice({ tone: "success", text: "" });
    try {
      const res = await request("/training-page", { method: "PUT", body: fromForm(form) });
      invalidateSiteContent("training-page");
      setForm(toForm(mergeTrainingPage(res.item)));
      setSaved({ updatedAt: res.updatedAt });
      setErrors({});
      setNotice({ tone: "success", text: "Saved. The Training page now shows this text." });
    } catch (err) {
      setErrors(err.errors ?? {});
      setNotice({ tone: "error", text: err.message });
    } finally {
      setBusy("");
    }
  };

  const reset = async () => {
    if (!window.confirm("Replace all the text on this page with the website's built-in text?\n\nYour saved text will be deleted.")) return;
    setBusy("reset");
    setNotice({ tone: "success", text: "" });
    try {
      await request("/training-page", { method: "DELETE" });
      invalidateSiteContent("training-page");
      setForm(toForm(TRAINING_PAGE_DEFAULTS));
      setSaved(false);
      setErrors({});
      setNotice({ tone: "success", text: "Reset. The Training page shows the built-in text again." });
    } catch (err) {
      setNotice({ tone: "error", text: err.message });
    } finally {
      setBusy("");
    }
  };

  return (
    <>
      <PageTitle
        title="Training page text"
        description="The Training Calendar's notes and table headings, and the Training Details and Course Contents sections. Leave a box empty to hide that text. Batches are edited under Training calendar."
        actions={
          <a
            href="/training#training-calendar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-[#0d1b0d] transition hover:border-text-side hover:text-text-side"
          >
            View the Training page <ExternalLink size={15} aria-hidden="true" />
          </a>
        }
      />

      {loading && !form ? (
        <Loading />
      ) : !form ? (
        <Notice tone="error">{loadError || "Could not load the page text."}</Notice>
      ) : (
        <form onSubmit={save} className="flex flex-col gap-6">
          <p className="text-sm text-[#5b735b]">
            {saved ? (
              <>
                Saved in the database, last changed <DateTime value={saved.updatedAt} />.
              </>
            ) : (
              "Showing the website's built-in text. Saving stores it in the database."
            )}
          </p>

          {CARDS.map((card) => (
            <Card key={card.title} title={card.title}>
              {card.description && <p className="-mt-2 mb-4 text-sm text-[#5b735b]">{card.description}</p>}
              <div className="grid gap-4 md:grid-cols-2">
                {card.fields.map((field) => (
                  <TextField
                    key={field.name}
                    id={`${uid}-${field.name}`}
                    field={field}
                    value={form[field.name]}
                    error={errorFor(errors, field.path)}
                    onChange={(value) => set(field.name, value)}
                  />
                ))}
              </div>
            </Card>
          ))}

          <Card title="Course Contents">
            <p className="-mt-2 mb-4 text-sm text-[#5b735b]">Numbered topics after Training Details, in one or more sections.</p>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                id={`${uid}-courseHeading`}
                field={{ label: "Heading", max: 100 }}
                value={form.courseHeading}
                error={errorFor(errors, "details.courseHeading")}
                onChange={(value) => set("courseHeading", value)}
              />
              <CourseSections
                uid={uid}
                sections={form.courseSections}
                errors={errors}
                onChange={(courseSections) => set("courseSections", courseSections)}
              />
            </div>
          </Card>

          <div className="sticky bottom-3 z-10 flex flex-col gap-3 rounded-2xl border border-border-light bg-white/95 p-4 shadow-lg backdrop-blur">
            <Notice tone={notice.tone} onDismiss={() => setNotice({ tone: "success", text: "" })}>
              {notice.text}
            </Notice>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" icon={Save} busy={busy === "save"} disabled={Boolean(busy)}>
                Save changes
              </Button>
              {saved && (
                <Button variant="secondary" icon={RotateCcw} busy={busy === "reset"} disabled={Boolean(busy)} onClick={reset}>
                  Reset to the built-in text
                </Button>
              )}
            </div>
          </div>
        </form>
      )}
    </>
  );
}
