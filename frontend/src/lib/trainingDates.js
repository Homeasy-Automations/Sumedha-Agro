// Display text for a training batch's dates. A batch's own text (`dates`, `registrationDates`)
// is shown as written; when it's empty the text is built from the ISO dates, so the admin
// panel only needs the date pickers.

// Month names as written in the client's calendar ("Sept", not "Sep").
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

const hasText = (value) => typeof value === "string" && value.trim() !== "";

function parse(iso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(hasText(iso) ? iso.trim() : "");
  if (!match) return null;
  const [year, month, day] = match.slice(1);
  const m = Number(month);
  return m >= 1 && m <= 12 ? { year, month: MONTHS[m - 1], day } : null;
}

const full = (d) => `${d.day} ${d.month} ${d.year}`;

/**
 * "2026-10-25", "2026-10-30" -> "25-30 Oct 2026"
 * "2026-10-28", "2026-11-02" -> "28 Oct-02 Nov 2026"
 * "2026-12-28", "2027-01-02" -> "28 Dec 2026-02 Jan 2027"
 * One date (or the same date twice) -> "25 Oct 2026"; none -> "".
 */
export function formatDateRange(start, end) {
  const a = parse(start);
  const b = parse(end);
  if (!a || !b) return a || b ? full(a || b) : "";
  if (a.year !== b.year) return `${full(a)}-${full(b)}`;
  if (a.month !== b.month) return `${a.day} ${a.month}-${b.day} ${b.month} ${a.year}`;
  if (a.day === b.day) return full(a);
  return `${a.day}-${b.day} ${a.month} ${a.year}`;
}

export const batchDates = (item) =>
  hasText(item?.dates) ? item.dates : formatDateRange(item?.startDate, item?.endDate);

export const batchRegistrationDates = (item) =>
  hasText(item?.registrationDates) ? item.registrationDates : formatDateRange(item?.registrationStart, item?.registrationEnd);
