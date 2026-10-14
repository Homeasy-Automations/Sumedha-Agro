// Tailwind class strings shared by the admin panel.
export const input =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-[#0d1b0d] shadow-sm placeholder:text-slate-400 focus:border-text-side focus:outline-none focus:ring-2 focus:ring-text-side/25 disabled:bg-slate-100";
export const inputError = "border-red-500";
export const card = "rounded-2xl border border-border-light bg-white p-5 shadow-sm md:p-6";
export const th = "px-4 py-3 text-left text-xs font-semibold text-[#5b735b]";
export const td = "px-4 py-3 align-top text-sm text-[#0d1b0d]";

// Props for an input inside <Field>: id, styling and aria wiring for hint/error.
export function fieldProps(id, error, hint) {
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
    className: `${input} ${error ? inputError : ""}`,
  };
}
