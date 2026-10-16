import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CircleAlert, Info, Phone, Users } from "lucide-react";
import content from "../data/content";
import { batchDates, batchRegistrationDates } from "../lib/trainingDates";
import { TRAINING_PAGE_DEFAULTS } from "../lib/trainingPage";
import { getTrainingStatus, nextStatusChange } from "../lib/trainingStatus";
import { mailHref, telHref } from "../lib/links";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import EmptyState from "./EmptyState";
import { anchorOffset, body, card, heading, muted, pill } from "./styles";

const { trainingCalendar: cal, training, ui, nav } = content;

const COLUMNS = ["sNo", "programme", "date", "registration", "fee", "languageDuration", "coordinator", "status", "apply"];
// Consecutive rows with the same value share one cell (e.g. the spawn batches' fee and coordinator).
const MERGED_COLUMNS = ["programme", "fee", "languageDuration", "coordinator"];
const COLUMN_WIDTH = { programme: "min-w-48", coordinator: "min-w-44" };

const KNOWN_GROUPS = new Set(cal.tables.map((t) => t.group));
const otherTable = { group: null, id: "schedule-calendar", heading: training.scheduleHeading, languageDurationSeparator: " " };

const SPECIAL_NOTE_HREF = `#${cal.notes.specialNote.id}`;
// setTimeout delays above ~24.8 days overflow; the timer is simply re-armed when it fires.
const MAX_TIMEOUT_MS = 2 ** 31 - 1;

const hasText = (value) => (typeof value === "string" ? value.trim() !== "" : value != null);
const order = (item) => (Number.isFinite(Number(item.sNo)) && hasText(item.sNo) ? Number(item.sNo) : Infinity);

const inlineLink =
  "font-semibold text-text-side underline decoration-text-side/30 underline-offset-2 hover:decoration-current [overflow-wrap:anywhere]";

// Current time, re-read whenever a batch's status is due to change (e.g. registration opening
// at 9:30 AM IST) and when the tab becomes visible again, so badges and Apply buttons stay current.
function useNow(items) {
  const [now, setNow] = useState(() => Date.now());
  const next = nextStatusChange(items, now);

  useEffect(() => {
    if (next === null) return undefined;
    const delay = Math.min(Math.max(next - Date.now() + 250, 0), MAX_TIMEOUT_MS);
    const timer = window.setTimeout(() => setNow(Date.now()), delay);
    return () => window.clearTimeout(timer);
  }, [next, now]);

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") setNow(Date.now());
    };
    document.addEventListener("visibilitychange", refresh);
    return () => document.removeEventListener("visibilitychange", refresh);
  }, []);

  return now;
}

// Displays text unchanged, with email addresses as mailto: links and 10-digit phone numbers as tel: links.
const LINKABLE = /([\w.+-]+@[\w-]+(?:\.[\w-]+)+|\b\d{10}\b)/g;

function LinkedText({ text }) {
  if (typeof text !== "string") return text ?? null;
  return text.split(LINKABLE).map((part, i) => {
    if (i % 2 === 0) return part;
    const href = part.includes("@") ? mailHref(part) : telHref(`+91${part}`);
    return (
      <a key={i} href={href} className={inlineLink}>
        {part}
      </a>
    );
  });
}

function ToBeAnnounced() {
  return (
    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
      {ui.toBeAnnounced}
    </span>
  );
}

const badgeTone = {
  open: "bg-primary text-[#0d1b0d]",
  upcoming: "border border-primary/30 bg-primary/10 text-text-side",
  other: "border border-primary/30 bg-primary/10 text-text-side",
  closed: "bg-slate-100 text-slate-600",
  completed: "bg-slate-100 text-slate-600",
  limited:
    "bg-amber-100 text-amber-900 hover:bg-amber-200",
  tba: "bg-amber-100 text-amber-900",
};

function StatusBadge({ status }) {
  const className = `inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${badgeTone[status.kind]}`;
  if (status.kind === "limited") {
    return (
      <Link to={SPECIAL_NOTE_HREF} className={`${className} transition`}>
        {status.label}
        <ArrowRight size={13} aria-hidden="true" />
      </Link>
    );
  }
  return (
    <span className={className}>
      {status.kind === "open" && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#0d1b0d]" />}
      {status.label}
    </span>
  );
}

const applyBase = "inline-flex items-center justify-center rounded-full px-5 py-2 text-xs font-bold transition";

function ApplyAction({ item, status }) {
  if (status.canApply) {
    const label = `${cal.applyLabel}: ${[item.title, batchDates(item)].filter(hasText).join(", ")}`;
    const className = `${applyBase} bg-primary text-[#0d1b0d] shadow-md shadow-primary/20 hover:bg-green-400 active:scale-[0.98]`;
    // A batch with its own registration link (e.g. a Google Form) opens it; otherwise the
    // website's application form, pre-filled for this batch.
    if (hasText(item.registrationLink)) {
      return (
        <a href={item.registrationLink} target="_blank" rel="noopener noreferrer" aria-label={`${label} ${ui.opensInNewTab}`} className={className}>
          {cal.applyLabel}
        </a>
      );
    }
    const to = hasText(item.id) ? `${nav.links.apply.to}?training=${encodeURIComponent(item.id)}` : nav.links.apply.to;
    return (
      <Link to={to} aria-label={label} className={className}>
        {cal.applyLabel}
      </Link>
    );
  }
  if (status.kind === "limited") {
    return (
      <Link
        to={SPECIAL_NOTE_HREF}
        title={status.label}
        className={`${applyBase} border border-[#0d1b0d]/15 text-[#0d1b0d] hover:border-text-side hover:text-text-side`}
      >
        {cal.applyLabel}
      </Link>
    );
  }
  return (
    <span
      role="link"
      aria-disabled="true"
      title={status.label}
      className={`${applyBase} cursor-not-allowed bg-slate-100 text-slate-400`}
    >
      {cal.applyLabel}
    </span>
  );
}

function toRow(item, index, table, now) {
  return {
    key: item.id ?? `${index}-${item.title}`,
    item,
    sNo: hasText(item.sNo) ? item.sNo : index + 1,
    programme: item.title,
    date: batchDates(item),
    registration: batchRegistrationDates(item),
    fee: item.fees,
    languageDuration: [item.language, item.duration].filter(hasText).join(table.languageDurationSeparator),
    coordinator: item.coordinator,
    status: getTrainingStatus(item, now),
  };
}

// rowSpan per row for one column: the first of a run of equal values spans the run, the rest get 0.
function rowSpans(rows, key) {
  const spans = rows.map(() => 1);
  let start = 0;
  for (let i = 1; i < rows.length; i++) {
    if (hasText(rows[i][key]) && rows[i][key] === rows[start][key]) {
      spans[start] += 1;
      spans[i] = 0;
    } else {
      start = i;
    }
  }
  return spans;
}

const cellBorder = "border border-border-light";
// S. No. stays visible while the table scrolls sideways (smaller screens; no effect when it fits).
const stickyCell =
  "sticky left-0 shadow-[inset_-1px_0_0_var(--color-border-light)]";

function CellContent({ column, row }) {
  const { item, status } = row;
  switch (column) {
    case "programme":
      return hasText(row.programme) ? <span className={`font-semibold ${heading}`}>{row.programme}</span> : <ToBeAnnounced />;
    case "registration":
      if (hasText(row.registration)) return <span className="whitespace-nowrap">{row.registration}</span>;
      if (status.kind === "limited") {
        return (
          <Link to={SPECIAL_NOTE_HREF} className={inlineLink}>
            {item.note}
          </Link>
        );
      }
      return <ToBeAnnounced />;
    case "coordinator":
      return hasText(row.coordinator) ? <LinkedText text={row.coordinator} /> : <ToBeAnnounced />;
    case "date":
      return hasText(row.date) ? <span className="whitespace-nowrap">{row.date}</span> : <ToBeAnnounced />;
    case "status":
      return <StatusBadge status={status} />;
    case "apply":
      return <ApplyAction item={item} status={status} />;
    default:
      return hasText(row[column]) ? row[column] : <ToBeAnnounced />;
  }
}

function CalendarTable({ table, items, now }) {
  const headingId = `${table.id}-heading`;
  const rows = [...items].sort((a, b) => order(a) - order(b)).map((item, i) => toRow(item, i, table, now));
  const spans = Object.fromEntries(MERGED_COLUMNS.map((key) => [key, rowSpans(rows, key)]));

  return (
    <Reveal className={`${card} overflow-hidden`}>
      <div className="border-b border-border-light p-5 md:p-6">
        <h3 id={headingId} className={`text-xl font-bold leading-snug md:text-2xl ${heading} ${anchorOffset}`}>
          {table.heading}
          {table.headingNote && (
            <>
              {" "}
              <span className={`${pill} ml-1 align-middle`}>
                <Users size={14} aria-hidden="true" />
                {table.headingNote}
              </span>
            </>
          )}
        </h3>
        {table.subLine && (
          <p className={`mt-3 text-sm leading-relaxed ${body}`}>
            <LinkedText text={table.subLine} />
          </p>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="p-5 md:p-6">
          <EmptyState compact />
        </div>
      ) : (
        <div className="overflow-x-auto" role="region" aria-labelledby={headingId} tabIndex={0}>
          <table aria-labelledby={headingId} className="w-full min-w-[1040px] border-collapse border-hidden text-left text-sm">
            <thead className="border-b-2 border-primary/60 bg-background-dark text-white">
              <tr>
                {COLUMNS.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className={`px-3 py-3.5 font-semibold ${column === "sNo" ? `${stickyCell} z-[2] bg-background-dark` : COLUMN_WIDTH[column] ?? ""}`}
                  >
                    {cal.columns[column]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={row.key}>
                  {COLUMNS.map((column) => {
                    if (column === "sNo") {
                      return (
                        <th
                          key={column}
                          scope="row"
                          className={`${cellBorder} ${stickyCell} z-[1] bg-white px-3 py-3 text-center font-mono font-semibold ${muted}`}
                        >
                          {row.sNo}
                        </th>
                      );
                    }
                    const span = spans[column]?.[r] ?? 1;
                    if (span === 0) return null;
                    return (
                      <td key={column} rowSpan={span > 1 ? span : undefined} className={`${cellBorder} px-3 py-3 align-middle ${body}`}>
                        <CellContent column={column} row={row} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Reveal>
  );
}

// Every piece of text below is editable in the admin panel; empty text is simply left out.
const hasNotes = ({ query, seats, specialNote, howToRegister }) =>
  [query, seats, specialNote.heading, specialNote.title, howToRegister.heading].some(hasText) ||
  specialNote.items.length > 0 ||
  howToRegister.sentences.length > 0;
const hasTerms = ({ important, note }) => [important.label, important.text, note.label].some(hasText) || note.items.length > 0;

function NotesPanel({ notes }) {
  const { query, seats, specialNote, howToRegister } = notes;
  const showSpecialNote = hasText(specialNote.heading) || hasText(specialNote.title) || specialNote.items.length > 0;
  return (
    <Reveal className={`${card} p-6 md:p-8`}>
      {(hasText(query) || hasText(seats)) && (
        <div className="flex flex-wrap items-center gap-3 not-last:mb-6">
          {hasText(query) && (
            <p className={`flex items-start gap-2.5 text-sm font-semibold ${heading}`}>
              <Phone size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-text-side" />
              <span>
                <LinkedText text={query} />
              </span>
            </p>
          )}
          {hasText(seats) && (
            <p className={pill}>
              <Users size={14} aria-hidden="true" />
              {seats}
            </p>
          )}
        </div>
      )}

      {/* Always present, so the "Limited Seats" links in the table have somewhere to go. */}
      <div
        id={cal.notes.specialNote.id}
        className={showSpecialNote ? `rounded-xl border-l-4 border-primary bg-primary/10 p-5 not-last:mb-6 ${anchorOffset}` : anchorOffset}
      >
        {(hasText(specialNote.heading) || hasText(specialNote.title)) && (
          <h4 className={`font-bold ${heading}`}>
            {specialNote.heading} <span className="text-text-side">{specialNote.title}</span>
          </h4>
        )}
        {specialNote.items.length > 0 && (
          <dl className={`mt-4 space-y-3 text-sm leading-relaxed first:mt-0 ${body}`}>
            {specialNote.items.map((entry, i) => (
              <div key={i}>
                {hasText(entry.label) && (
                  <>
                    <dt className={`inline font-semibold ${heading}`}>{entry.label}</dt>{" "}
                  </>
                )}
                <dd className="inline">
                  <LinkedText text={entry.text} />
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {hasText(howToRegister.heading) && <h4 className={`font-bold ${heading}`}>{howToRegister.heading}</h4>}
      {howToRegister.sentences.length > 0 && (
        <ul className={`mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed marker:text-text-side first:mt-0 ${body}`}>
          {howToRegister.sentences.map((sentence, i) => (
            <li key={i}>
              <LinkedText text={sentence} />
            </li>
          ))}
        </ul>
      )}
    </Reveal>
  );
}

function TermsPanel({ terms }) {
  const { important, note } = terms;
  return (
    <Reveal delay={0.05} className={`${card} p-6 md:p-8`}>
      {(hasText(important.label) || hasText(important.text)) && (
        <p className="flex items-start gap-3 rounded-xl bg-amber-100 p-4 text-sm leading-relaxed text-amber-900 not-last:mb-6">
          <CircleAlert size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
          <span>
            <strong className="font-bold">{important.label}</strong> <LinkedText text={important.text} />
          </span>
        </p>
      )}
      {hasText(note.label) && <h4 className={`font-bold ${heading}`}>{note.label}</h4>}
      {note.items.length > 0 && (
        <ul className={`mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed marker:text-text-side first:mt-0 ${body}`}>
          {note.items.map((text, i) => (
            <li key={i}>
              <LinkedText text={text} />
            </li>
          ))}
        </ul>
      )}
    </Reveal>
  );
}

// Training Calendar: one table per training group (cultivation, spawn) with notes and terms
// between them. Rows come from the API (or src/data/trainings.js) and are never hidden;
// rows without a known group are listed in a final table.
// `text`: the calendar's editable text (src/lib/trainingPage.js), defaults when not given.
export default function TrainingCalendar({ items, text = TRAINING_PAGE_DEFAULTS.calendar }) {
  const now = useNow(items);
  const [cultivation, spawn] = cal.tables.map((table) => ({ ...table, ...text.tables[table.group] }));
  const byGroup = (group) => items.filter((item) => item.group === group);
  const ungrouped = items.filter((item) => !KNOWN_GROUPS.has(item.group));
  const { notice, notes, terms } = text;
  const showNotes = hasNotes(notes);
  const showTerms = hasTerms(terms);

  return (
    <div>
      <Reveal>
        <SectionHeading id={`${cal.id}-heading`} title={cal.heading} />
        {(hasText(notice.label) || hasText(notice.text)) && (
          <p className="mt-6 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm font-medium text-[#0d1b0d] md:text-base">
            <Info size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-text-side" />
            <span>
              <strong className="font-bold">{notice.label}</strong> <LinkedText text={notice.text} />
            </span>
          </p>
        )}
      </Reveal>

      <div className="mt-6 space-y-6">
        <CalendarTable table={cultivation} items={byGroup(cultivation.group)} now={now} />

        {(showNotes || showTerms) && (
          <div className="grid items-start gap-6 lg:grid-cols-2">
            {showNotes && <NotesPanel notes={notes} />}
            {showTerms && <TermsPanel terms={terms} />}
          </div>
        )}

        <CalendarTable table={spawn} items={byGroup(spawn.group)} now={now} />

        {ungrouped.length > 0 && <CalendarTable table={otherTable} items={ungrouped} now={now} />}
      </div>
    </div>
  );
}
