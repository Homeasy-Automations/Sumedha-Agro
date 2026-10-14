import { useEffect, useId, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarDays, ChevronDown, CircleAlert, CircleCheck, Info, LoaderCircle, Send } from "lucide-react";
import content from "../data/content";
import { fields, formText, validationMessages } from "../data/trainingForm";
import defaultTrainings from "../data/trainings";
import useSiteContent from "../hooks/useSiteContent";
import ContactBlock from "./ContactBlock";

const API_ENDPOINT = `${import.meta.env.VITE_API_URL}/api/training/apply`;

const initialValues = Object.fromEntries(
  fields.flatMap((f) => (f.details ? [[f.name, ""], [f.details.name, ""]] : [[f.name, ""]])),
);

const stripSeparators = (value) => value.replace(/[\s-]/g, "");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const MAX_BIRTH_DATE = todayISO();

const rules = {
  mobile: (v) => /^\d{10}$/.test(stripSeparators(v)),
  aadhar: (v) => /^\d{12}$/.test(stripSeparators(v)),
  email: (v) => EMAIL_RE.test(v.trim()),
  pastDate: (v) => v < todayISO(),
};

function validateField(field, values) {
  const value = values[field.name];
  if (!value.trim()) return validationMessages.required;
  if (field.validate && !rules[field.validate](value)) return validationMessages[field.validate];
  return "";
}

function validateAll(values) {
  const errors = {};
  for (const field of fields) {
    const error = validateField(field, values);
    if (error) errors[field.name] = error;
  }
  return errors;
}

function buildPayload(values) {
  const payload = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim()]));
  payload.mobile = stripSeparators(payload.mobile);
  payload.aadhar = stripSeparators(payload.aadhar);
  if (payload.previousTraining !== "Yes") payload.previousTrainingDetails = "";
  return payload;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// Readable batch name saved with the application, e.g. "S. No. 6 · 16-27 Nov 2026".
function batchLabel(batch) {
  const sNo = batch.sNo != null && String(batch.sNo).trim() !== "" ? `${content.trainingCalendar.columns.sNo} ${batch.sNo}` : "";
  return [sNo, batch.dates].filter(Boolean).join(" · ");
}

function makeFallbackReference() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return `SAG-TR-${Array.from(bytes, (b) => chars[b % chars.length]).join("")}`;
}

const inputBase =
  "w-full rounded-lg border bg-white px-4 py-3 text-sm text-[#0d1b0d] shadow-sm transition placeholder:text-slate-400 focus:border-text-side focus:outline-none focus:ring-2 focus:ring-text-side/25";
const inputBorder = (error) => (error ? "border-red-500" : "border-slate-300");

function Label({ field, htmlFor, id, as = "label" }) {
  const Tag = as;
  return (
    <Tag
      id={id}
      htmlFor={htmlFor}
      className="mb-2 flex items-start gap-2.5 text-sm font-semibold leading-snug text-[#0d1b0d]"
    >
      <span
        aria-hidden="true"
        className="mt-px flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md bg-primary/15 px-1 text-[11px] font-bold text-text-side"
      >
        {field.no}
      </span>
      <span>{field.label}</span>
    </Tag>
  );
}

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-600">
      <CircleAlert size={15} aria-hidden="true" />
      {message}
    </p>
  );
}

export default function TrainingForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [referenceId, setReferenceId] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const statusRef = useRef(null);
  const uid = useId();
  const { items: trainings } = useSiteContent("trainings", defaultTrainings);
  const trainingOptions = [...new Set(trainings.map((t) => t.title))];

  // Opened from a batch's Apply button on the Training Calendar (?training=<id>): pre-fill
  // field 1 and the training date once that batch is known (the schedule may still be loading).
  const [searchParams] = useSearchParams();
  const batchId = searchParams.get("training");
  const batch = batchId ? trainings.find((t) => t.id === batchId && t.title) : undefined;
  const [prefilledBatchId, setPrefilledBatchId] = useState(null);
  if (batch && prefilledBatchId !== batch.id) {
    setPrefilledBatchId(batch.id);
    setValues((prev) => ({
      ...prev,
      trainingAppliedFor: prev.trainingAppliedFor || batch.title,
      trainingDate: prev.trainingDate || (ISO_DATE.test(batch.startDate ?? "") ? batch.startDate : ""),
    }));
  }
  // The batch is saved with the application only while field 1 still names its programme.
  const selectedBatch = batch && values.trainingAppliedFor === batch.title ? batch : null;

  const idFor = (name) => `${uid}-${name}`;
  const errorIdFor = (name) => `${uid}-${name}-error`;

  // Move focus to the result message, centred so the sticky header doesn't cover it.
  useEffect(() => {
    if (status !== "success" && status !== "error") return;
    const el = statusRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: "center" });
  }, [status]);

  const setValue = (field, value) => {
    const next = { ...values, [field.name]: value };
    setValues(next);
    // Re-check a field that is already showing an error so the message clears as soon as it's fixed.
    if (errors[field.name]) setErrors((prev) => ({ ...prev, [field.name]: validateField(field, next) }));
  };

  const checkField = (field) => setErrors((prev) => ({ ...prev, [field.name]: validateField(field, values) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;

    const nextErrors = validateAll(values);
    setErrors(nextErrors);
    setSubmitAttempted(true);

    const firstInvalid = fields.find((f) => nextErrors[f.name]);
    if (firstInvalid) {
      const target = firstInvalid.type === "radio" ? `${idFor(firstInvalid.name)}-0` : idFor(firstInvalid.name);
      document.getElementById(target)?.focus();
      return;
    }

    const fallbackReference = makeFallbackReference();
    setStatus("submitting");
    setServerMessage("");

    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...buildPayload(values),
          ...(selectedBatch && { trainingBatchId: selectedBatch.id, trainingBatch: batchLabel(selectedBatch) }),
          clientReferenceId: fallbackReference,
        }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data || data.ok === false) {
        // The API returns { errors: { field: message } } when its own validation fails.
        if (data?.errors && typeof data.errors === "object") setErrors((prev) => ({ ...prev, ...data.errors }));
        setServerMessage(data?.message || data?.error || "");
        setStatus("error");
        return;
      }

      setReferenceId(data.referenceId || fallbackReference);
      setStatus("success");
    } catch (err) {
      console.error("Training application error:", err);
      setStatus("error");
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setSubmitAttempted(false);
    setReferenceId("");
    setServerMessage("");
    setStatus("idle");
    setPrefilledBatchId(null); // pre-fill the same batch again for the next application
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-primary/40 bg-white p-8 text-center shadow-sm md:p-12"
      >
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-text-side">
          <CircleCheck size={34} aria-hidden="true" />
        </span>
        <h2
          ref={statusRef}
          tabIndex={-1}
          className="mt-6 text-2xl font-bold text-[#0d1b0d] focus:outline-none"
        >
          {formText.success.heading}
        </h2>
        <p className="mt-6 text-sm text-[#5b735b]">{formText.success.referenceLabel}</p>
        <p className="mt-1 font-mono text-3xl font-bold tracking-wider text-text-side">
          {referenceId}
        </p>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-[#3f5f3f]">
          {formText.success.body}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-full border border-[#0d1b0d]/15 px-6 py-3 text-sm font-bold text-[#0d1b0d] transition hover:border-text-side hover:text-text-side"
        >
          {formText.success.again}
        </button>
      </div>
    );
  }

  const submitting = status === "submitting";
  const hasErrors = Object.values(errors).some(Boolean);

  const renderControl = (field) => {
    const id = idFor(field.name);
    const error = errors[field.name];
    const common = {
      id,
      name: field.name,
      value: values[field.name],
      required: true,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? errorIdFor(field.name) : undefined,
      onChange: (e) => setValue(field, e.target.value),
      onBlur: () => checkField(field),
    };

    if (field.type === "training" && trainingOptions.length > 0) {
      return (
        <div className="relative">
          <select {...common} className={`${inputBase} ${inputBorder(error)} appearance-none pr-10`}>
            <option value="">{formText.selectPlaceholder}</option>
            {trainingOptions.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
          <ChevronDown size={18} aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div className="relative">
          <select {...common} className={`${inputBase} ${inputBorder(error)} appearance-none pr-10`}>
            <option value="">{formText.selectPlaceholder}</option>
            {field.optionGroups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <ChevronDown size={18} aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <textarea
          {...common}
          rows={3}
          autoComplete={field.autoComplete}
          className={`${inputBase} ${inputBorder(error)} resize-y`}
        />
      );
    }

    return (
      <input
        {...common}
        type={field.type === "training" ? "text" : field.type}
        inputMode={field.inputMode}
        autoComplete={field.autoComplete}
        max={field.validate === "pastDate" ? MAX_BIRTH_DATE : undefined}
        className={`${inputBase} ${inputBorder(error)}`}
      />
    );
  };

  const renderRadioGroup = (field) => {
    const id = idFor(field.name);
    const legendId = `${id}-legend`;
    const error = errors[field.name];
    const showDetails = field.details && values[field.name] === field.details.showWhen;

    return (
      <fieldset
        key={field.name}
        className={field.wide ? "md:col-span-2" : ""}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) checkField(field);
        }}
      >
        <Label field={field} as="legend" id={legendId} />
        <div className="flex flex-wrap gap-3">
          {field.options.map((option, i) => (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg border bg-white px-4 py-2.5 text-sm font-medium text-[#0d1b0d] transition has-[:checked]:border-text-side has-[:checked]:bg-primary/10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-text-side/40 ${inputBorder(error)}`}
            >
              <input
                type="radio"
                id={`${id}-${i}`}
                name={field.name}
                value={option}
                checked={values[field.name] === option}
                required
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorIdFor(field.name) : undefined}
                onChange={(e) => setValue(field, e.target.value)}
                className="h-4 w-4 accent-[#006400]"
              />
              {option}
            </label>
          ))}
        </div>
        <FieldError id={errorIdFor(field.name)} message={error} />
        {showDetails && (
          <textarea
            id={idFor(field.details.name)}
            name={field.details.name}
            aria-labelledby={legendId}
            rows={4}
            value={values[field.details.name]}
            onChange={(e) => setValues((prev) => ({ ...prev, [field.details.name]: e.target.value }))}
            className={`${inputBase} ${inputBorder(false)} mt-4 resize-y`}
          />
        )}
      </fieldset>
    );
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-busy={submitting}
      className="rounded-2xl border border-border-light bg-white p-6 shadow-sm md:p-10"
    >
      <p className="flex items-start gap-3 rounded-xl bg-primary/10 p-4 text-sm font-medium text-[#0d1b0d]">
        <Info size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-text-side" />
        {formText.instruction}
      </p>

      {submitAttempted && hasErrors && (
        <p
          role="alert"
          className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
        >
          <CircleAlert size={18} aria-hidden="true" />
          {formText.errorSummary}
        </p>
      )}

      <div className="mt-8 grid gap-x-6 gap-y-7 md:grid-cols-2">
        {fields.map((field) =>
          field.type === "radio" ? (
            renderRadioGroup(field)
          ) : (
            <div key={field.name} className={field.wide ? "md:col-span-2" : ""}>
              <Label field={field} htmlFor={idFor(field.name)} />
              {renderControl(field)}
              <FieldError id={errorIdFor(field.name)} message={errors[field.name]} />
              {field.type === "training" && selectedBatch && (
                <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-text-side">
                  <CalendarDays size={15} aria-hidden="true" />
                  {formText.batchLabel}: {batchLabel(selectedBatch)}
                </p>
              )}
            </div>
          ),
        )}
      </div>

      {status === "error" && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 focus:outline-none"
        >
          <p className="flex items-center gap-2 font-bold text-red-700">
            <CircleAlert size={18} aria-hidden="true" />
            {formText.error.heading}
          </p>
          <p className="mt-2 text-sm text-red-700">{formText.error.body}</p>
          {serverMessage && <p className="mt-2 text-sm text-red-700">{serverMessage}</p>}
          <ContactBlock parts={["phone", "email"]} className="mt-4" />
        </div>
      )}

      <div className="mt-10 flex justify-end border-t border-border-light pt-6">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-[#0d1b0d] shadow-lg shadow-primary/20 transition hover:bg-green-400 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
        >
          {submitting ? (
            <>
              <LoaderCircle size={18} aria-hidden="true" className="animate-spin" />
              {formText.submitting}
            </>
          ) : (
            <>
              {formText.submit}
              <Send size={16} aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
