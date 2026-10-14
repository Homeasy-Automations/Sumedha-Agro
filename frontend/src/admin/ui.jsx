import { useEffect, useRef } from "react";
import { CircleAlert, CircleCheck, LoaderCircle, X } from "lucide-react";
import { card } from "./styles";

export function PageTitle({ title, description, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0d1b0d]">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-[#5b735b]">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ title, children, className = "" }) {
  return (
    <section className={`${card} ${className}`}>
      {title && <h2 className="mb-4 text-base font-bold text-[#0d1b0d]">{title}</h2>}
      {children}
    </section>
  );
}

const buttonVariants = {
  primary: "bg-primary text-[#0d1b0d] hover:bg-green-400",
  secondary: "border border-slate-300 bg-white text-[#0d1b0d] hover:border-text-side hover:text-text-side",
  danger: "border border-red-200 bg-white text-red-700 hover:bg-red-50",
  dark: "bg-background-dark text-white hover:bg-[#1b3a1b]",
};

export function Button({ variant = "primary", busy = false, icon: Icon, children, className = "", ...props }) {
  return (
    <button
      type="button"
      {...props}
      disabled={busy || props.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${buttonVariants[variant]} ${className}`}
    >
      {busy ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : Icon && <Icon size={16} aria-hidden="true" />}
      {children}
    </button>
  );
}

// Label + control + hint/error. The control must use the same `id`.
export function Field({ id, label, hint, error, required = false, children, className = "" }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-[#0d1b0d]">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-[#5b735b]">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
          <CircleAlert size={13} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

export function Notice({ tone = "success", children, onDismiss }) {
  if (!children) return null;
  const ok = tone === "success";
  const Icon = ok ? CircleCheck : CircleAlert;
  return (
    <div
      role={ok ? "status" : "alert"}
      className={`mb-4 flex items-start gap-2 rounded-xl border p-3 text-sm font-medium ${
        ok ? "border-primary/40 bg-primary/10 text-[#0d1b0d]" : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      <Icon size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
      <span className="flex-1">{children}</span>
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Dismiss" className="rounded p-0.5 hover:bg-black/5">
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export function Loading({ label = "Loading…" }) {
  return (
    <p role="status" className="flex items-center gap-2 py-6 text-sm text-[#5b735b]">
      <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
      {label}
    </p>
  );
}

export function Empty({ children }) {
  return <p className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center text-sm text-[#5b735b]">{children}</p>;
}

// Native <dialog>: focus is trapped and Esc closes it.
export function Modal({ open, title, onClose, children, wide = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && ref.current.close()}
      aria-label={title}
      className={`m-auto rounded-2xl bg-white p-0 shadow-2xl backdrop:bg-black/50 ${wide ? "w-[min(94vw,900px)]" : "w-[min(94vw,560px)]"}`}
    >
      {open && (
        <div className="max-h-[85vh] overflow-y-auto p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 className="text-lg font-bold text-[#0d1b0d]">{title}</h2>
            <button type="button" onClick={() => ref.current.close()} aria-label="Close" className="rounded-lg p-1 hover:bg-slate-100">
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}

const dateTime = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" });
export function DateTime({ value }) {
  if (!value) return null;
  return <time dateTime={value}>{dateTime.format(new Date(value))}</time>;
}

export function Pager({ offset, limit, total, onChange }) {
  if (total <= limit) return null;
  const page = Math.floor(offset / limit) + 1;
  const pages = Math.ceil(total / limit);
  return (
    <nav aria-label="Pagination" className="mt-4 flex items-center justify-between gap-4 text-sm text-[#5b735b]">
      <span>
        Page {page} of {pages} · {total} total
      </span>
      <div className="flex gap-2">
        <Button variant="secondary" disabled={page <= 1} onClick={() => onChange(Math.max(0, offset - limit))}>
          Previous
        </Button>
        <Button variant="secondary" disabled={page >= pages} onClick={() => onChange(offset + limit)}>
          Next
        </Button>
      </div>
    </nav>
  );
}
