import content from "../data/content";

// Registration status of a training batch, shared by the Training Calendar and (later) the
// application form. All dates are Indian dates (IST, UTC+5:30, no daylight saving):
// registration opens at 9:30 AM on registrationStart and closes at the end of registrationEnd,
// and a batch is completed once endDate is over. Rows without registration dates fall back
// to their admissionStatus text.

const labels = content.trainingCalendar.status;
const { toBeAnnounced } = content.ui;

const MINUTE_MS = 60 * 1000;
const DAY_MS = 24 * 60 * MINUTE_MS;
const IST_OFFSET_MS = (5 * 60 + 30) * MINUTE_MS;
const REGISTRATION_OPENS_MS = (9 * 60 + 30) * MINUTE_MS; // 9:30 AM

const formatDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kolkata",
}).format;

const hasText = (value) => typeof value === "string" && value.trim() !== "";

// "2026-10-15" -> the instant that day starts in India (00:00 IST), or null if it isn't a real date.
function istDayStart(iso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(hasText(iso) ? iso.trim() : "");
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number);
  const utc = Date.UTC(year, month - 1, day);
  const check = new Date(utc);
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return null;
  return utc - IST_OFFSET_MS;
}

// The instants a batch's status changes, or null when it has no (valid) registration dates.
function milestones(item) {
  const start = istDayStart(item?.registrationStart);
  const end = istDayStart(item?.registrationEnd);
  if (start === null || end === null) return null;
  const finish = istDayStart(item.endDate);
  return {
    opensAt: start + REGISTRATION_OPENS_MS,
    closesAt: end + DAY_MS,
    completesAt: finish === null ? null : finish + DAY_MS,
  };
}

const FALLBACK_KINDS = { open: "open", closed: "closed", upcoming: "upcoming", completed: "completed" };

function fallbackStatus(item) {
  const text = hasText(item?.admissionStatus) ? item.admissionStatus.trim() : "";
  if (!text || text === toBeAnnounced) return { kind: "tba", label: toBeAnnounced };
  return { kind: FALLBACK_KINDS[text.toLowerCase()] ?? "other", label: text };
}

const toTime = (now) => (now instanceof Date ? now.getTime() : now);

/**
 * @param item a training row (see src/data/trainings.js)
 * @param now  Date or epoch milliseconds; defaults to the current time
 * @returns {{ kind: "upcoming"|"open"|"closed"|"completed"|"limited"|"tba"|"other", label: string, canApply: boolean }}
 *   `limited`: no registration dates but a note (e.g. "Limited Seats — See the Special Note below").
 *   `tba` / `other`: admissionStatus fallback that isn't Open, Closed, Upcoming or Completed.
 */
export function getTrainingStatus(item, now = Date.now()) {
  const time = toTime(now);
  const m = milestones(item);

  if (m) {
    if (time < m.opensAt) return { kind: "upcoming", label: `${labels.opensOn} ${formatDate(m.opensAt)}`, canApply: false };
    if (time < m.closesAt) return { kind: "open", label: labels.open, canApply: true };
    if (m.completesAt === null || time < m.completesAt) return { kind: "closed", label: labels.closed, canApply: false };
    return { kind: "completed", label: labels.completed, canApply: false };
  }

  if (hasText(item?.note)) return { kind: "limited", label: labels.limitedSeats, canApply: false };

  const fallback = fallbackStatus(item);
  return { ...fallback, canApply: fallback.kind === "open" };
}

// The next instant after `now` at which any of these rows changes status, or null if none will.
export function nextStatusChange(items, now = Date.now()) {
  const time = toTime(now);
  let next = null;
  for (const item of items) {
    const m = milestones(item);
    if (!m) continue;
    for (const at of [m.opensAt, m.closesAt, m.completesAt]) {
      if (at !== null && at > time && (next === null || at < next)) next = at;
    }
  }
  return next;
}
