import { useState } from "react";
import { Download, ExternalLink } from "lucide-react";
import defaultTrainings from "../../data/trainings";
import { invalidateSiteContent } from "../../hooks/useSiteContent";
import { batchDates, batchRegistrationDates, formatDateRange } from "../../lib/trainingDates";
import { getTrainingStatus } from "../../lib/trainingStatus";
import ContentEditor from "../ContentEditor";
import { useAdmin } from "../session";
import { Button, Notice, PageTitle } from "../ui";

const TBA = "To be announced";

// The Training Calendar's tables (see trainingCalendar.tables in src/data/content.js).
const GROUPS = [
  { value: "cultivation", label: "Training Programmes on Mushroom Cultivation Technology" },
  { value: "spawn", label: "Training on Mushroom Spawn Production Technology" },
  { value: "", label: "Other trainings (listed in their own table at the end)" },
];
const KNOWN_GROUPS = new Set(GROUPS.map((g) => g.value).filter(Boolean));

const STATUS_OPTIONS = [
  { value: "", label: TBA },
  ...["Open", "Upcoming", "Closed", "Completed"].map((value) => ({ value, label: value })),
];

const FIELDS = [
  { section: "Where it appears" },
  { name: "group", label: "Calendar table", type: "select", options: GROUPS },
  { name: "sNo", label: "S. No.", inputMode: "numeric", maxLength: 5, placeholder: "e.g. 1", hint: "Order within its table." },
  {
    name: "title",
    label: "Training programme",
    required: true,
    maxLength: 200,
    wide: true,
    placeholder: "e.g. Training on mushroom cultivation technology for farmers",
    hint: "Also listed in “Training applied for” on the application form.",
  },

  { section: "Training dates" },
  { name: "startDate", label: "Starts on", type: "date" },
  { name: "endDate", label: "Ends on", type: "date", hint: "The batch shows “Completed” after this day." },
  {
    name: "dates",
    label: "Dates as shown on the website",
    maxLength: 100,
    wide: true,
    placeholder: (v) => formatDateRange(v.startDate, v.endDate) || TBA,
    hint: "Optional: leave empty to show the dates above.",
  },

  { section: "Online registration" },
  { name: "registrationStart", label: "Opens on", type: "date", hint: "Opens at 9:30 AM (India time)." },
  { name: "registrationEnd", label: "Closes on", type: "date", hint: "Closes at the end of this day." },
  {
    name: "registrationDates",
    label: "Registration dates as shown on the website",
    maxLength: 100,
    wide: true,
    placeholder: (v) => formatDateRange(v.registrationStart, v.registrationEnd) || TBA,
    hint: "Optional: leave empty to show the dates above.",
  },
  {
    name: "registrationLink",
    label: "Registration link",
    type: "url",
    maxLength: 500,
    wide: true,
    placeholder: "https://forms.gle/…",
    hint: "Optional. Leave empty to use the website's application form (applications then appear under Training applications). If set, the Apply button opens this link instead.",
  },

  { section: "Fee, language and coordinator" },
  { name: "fees", label: "Training fee", maxLength: 100, placeholder: "e.g. 3000/-" },
  { name: "language", label: "Language", maxLength: 100, placeholder: "e.g. Hindi/English" },
  { name: "duration", label: "Duration", maxLength: 100, placeholder: "e.g. 6 Days" },
  {
    name: "coordinator",
    label: "Course coordinator",
    maxLength: 300,
    placeholder: "e.g. Dr. Enespa, Dr. Rekha Singh",
    hint: "Phone numbers and email addresses become links.",
  },

  { section: "Only when there are no registration dates" },
  {
    name: "note",
    label: "Note instead of registration dates",
    maxLength: 300,
    wide: true,
    placeholder: "e.g. Limited Seats — See the Special Note below",
    hint: "Shown with a “Limited Seats” badge that links to the Special Note.",
  },
  { name: "admissionStatus", label: "Status", type: "select", options: STATUS_OPTIONS, hint: "Used when there are no registration dates and no note." },
];

const NAMES = FIELDS.filter((f) => f.name).map((f) => f.name);
const emptyBatch = () => ({ ...Object.fromEntries(NAMES.map((name) => [name, ""])), group: "cultivation" });
const toFields = (row) => Object.fromEntries(NAMES.map((name) => [name, row[name] == null ? "" : String(row[name])]));

const sNoOf = (item) => (/^\d+$/.test(String(item.sNo ?? "")) ? Number(item.sNo) : Infinity);
const bySNo = (a, b) => sNoOf(a) - sNoOf(b) || String(a.createdAt).localeCompare(String(b.createdAt));
const inGroup = (group) => (item) => (group ? item.group === group : !KNOWN_GROUPS.has(item.group));

const groupItems = (items) => GROUPS.map((g) => ({ label: g.label, items: items.filter(inGroup(g.value)).sort(bySNo) }));

// Copy of a batch for the next one in the same table: everything except its S. No. (the next
// free number) and its dates, which are left empty to fill in.
function duplicate(item, items) {
  const numbers = items.filter(inGroup(item.group)).map(sNoOf).filter(Number.isFinite);
  const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  return {
    ...toFields(item),
    sNo: String(next),
    ...Object.fromEntries(["dates", "startDate", "endDate", "registrationDates", "registrationStart", "registrationEnd", "admissionStatus"].map((n) => [n, ""])),
  };
}

const statusTone = {
  open: "bg-primary text-[#0d1b0d]",
  upcoming: "border border-primary/30 bg-primary/10 text-text-side",
  limited: "bg-amber-100 text-amber-900",
  tba: "bg-amber-100 text-amber-900",
};

function Summary({ item }) {
  const status = getTrainingStatus(item);
  const details = [
    ["Dates", batchDates(item)],
    ["Registration", batchRegistrationDates(item) || item.note],
    ["Fee", item.fees],
    ["Language & duration", [item.language, item.duration].filter(Boolean).join(" · ")],
    ["Coordinator", item.coordinator],
  ];
  return (
    <div className="flex items-start gap-3">
      <span
        aria-label={`S. No. ${item.sNo || "not set"}`}
        className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg bg-background-dark px-1.5 font-mono text-xs font-bold text-primary"
      >
        {item.sNo || "–"}
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-[#0d1b0d]">{item.title}</p>
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${statusTone[status.kind] ?? "bg-slate-100 text-slate-600"}`}>
            {status.label}
          </span>
          {item.registrationLink && (
            <a
              href={item.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-text-side hover:underline"
            >
              Own registration link <ExternalLink size={11} aria-hidden="true" />
            </a>
          )}
        </div>
        <dl className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#5b735b]">
          {details.map(([label, value]) => (
            <div key={label} className="flex gap-1">
              <dt>{label}:</dt>
              <dd className="font-medium text-[#0d1b0d]">{value || TBA}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

// Shown while the database has no batches: the website is then showing src/data/trainings.js.
function ImportDefaults({ onImported }) {
  const { request } = useAdmin();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const importAll = async () => {
    setBusy(true);
    setError("");
    try {
      await request("/trainings/import", { method: "POST", body: { items: defaultTrainings.map(toFields) } });
      invalidateSiteContent("trainings");
      onImported();
    } catch (err) {
      const details = err.errors ? Object.values(err.errors).join(" ") : "";
      setError(details ? `${err.message} ${details}` : err.message);
      setBusy(false);
    }
  };

  return (
    <section className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 shadow-sm md:p-6">
      <h2 className="mb-2 text-base font-bold text-[#0d1b0d]">Start from the current calendar</h2>
      <p className="text-sm text-[#0d1b0d]">
        No batches are saved in the database yet, so the website is showing its built-in calendar ({defaultTrainings.length} batches).
        Import it to edit those batches here.
      </p>
      <p className="mt-2 text-sm font-medium text-amber-900">
        If you add a batch without importing first, the website will show only the batches added here.
      </p>
      <div className="mt-4">
        <Notice tone="error">{error}</Notice>
      </div>
      <Button icon={Download} busy={busy} onClick={importAll}>
        Import the built-in calendar ({defaultTrainings.length} batches)
      </Button>
    </section>
  );
}

export default function TrainingsAdmin() {
  return (
    <>
      <PageTitle
        title="Training calendar"
        description="Batches in the Training Calendar on the Training page, grouped by table and ordered by S. No. Registration opens and closes automatically on the dates set here. Empty fields show “To be announced”."
      />
      <ContentEditor
        kind="trainings"
        endpoint="/trainings"
        noun="Batch"
        fields={FIELDS}
        initial={emptyBatch}
        groupItems={groupItems}
        duplicate={duplicate}
        renderEmpty={({ reload }) => <ImportDefaults onImported={reload} />}
        describe={(item) => [item.title, batchDates(item)].filter(Boolean).join(", ")}
        summary={(item) => <Summary item={item} />}
        emptyText="No batches in the database yet."
      />
    </>
  );
}
