import { useId, useState } from "react";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { partnerCta } from "../data/legacyContent";
import { apiRequest } from "../lib/api";
import ContactBlock from "./ContactBlock";
import Reveal from "./Reveal";
import { body, card, container, heading, input, sectionY } from "./styles";

const { fields, errors: messages, submit, success } = partnerCta.form;

// Same rule as the API, so an address accepted here is never rejected there.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialValues = { name: "", company: "", email: "", interest: fields.interest.options[0], message: "" };

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = messages.nameRequired;
  const email = values.email.trim();
  if (!email) errors.email = messages.emailRequired;
  else if (!EMAIL.test(email)) errors.email = messages.emailInvalid;
  return errors;
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

// "Partner with Sumedha Agro": contact details and a bulk / contract farming inquiry form,
// saved through POST /api/contact (shown in the admin panel under Contact messages).
export default function PartnerCTA() {
  const uid = useId();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [serverMessage, setServerMessage] = useState("");
  const sending = status === "sending";

  const idFor = (name) => `${uid}-${name}`;
  const errorIdFor = (name) => `${uid}-${name}-error`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...values, [name]: value };
    setValues(next);
    // Once a field shows an error, update it as the visitor types.
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: validate(next)[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;

    const nextErrors = validate(values);
    setErrors(nextErrors);
    const firstInvalid = ["name", "email"].find((name) => nextErrors[name]);
    if (firstInvalid) {
      document.getElementById(idFor(firstInvalid))?.focus();
      return;
    }

    setStatus("sending");
    setServerMessage("");
    try {
      await apiRequest("/api/contact", { method: "POST", body: values });
      setValues(initialValues);
      setStatus("sent");
    } catch (err) {
      // The API returns { errors: { field: message } } when its own validation fails.
      if (err.errors) setErrors((prev) => ({ ...prev, ...err.errors }));
      setServerMessage(err.message);
      setStatus("error");
    }
  };

  // Props shared by every control: id, value, error wiring.
  const control = (name) => ({
    id: idFor(name),
    name,
    value: values[name],
    onChange: handleChange,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? errorIdFor(name) : undefined,
  });

  const labelClass = `mb-2 block text-sm font-semibold ${heading}`;

  return (
    <section className={`border-t border-border-light bg-white ${sectionY}`} aria-labelledby={`${uid}-heading`}>
      <div className={container}>
        <Reveal>
          <div className={`${card} grid overflow-hidden lg:grid-cols-5`}>
            <div className="relative isolate flex flex-col gap-6 overflow-hidden bg-primary/10 p-6 md:p-10 lg:col-span-2">
              <div
                aria-hidden="true"
                className="absolute -bottom-24 -right-24 -z-10 h-72 w-72 rounded-full bg-primary/20 blur-[90px]"
              />
              <h2 id={`${uid}-heading`} className={`text-3xl font-bold leading-tight tracking-tight md:text-4xl ${heading}`}>
                {partnerCta.heading}
              </h2>
              <p className={`text-base leading-relaxed md:text-lg ${body}`}>{partnerCta.text}</p>
              <ContactBlock parts={["phone", "email", "address"]} className="mt-2" />
            </div>

            <form noValidate onSubmit={handleSubmit} aria-busy={sending} className="flex flex-col gap-5 p-6 md:p-10 lg:col-span-3">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor={idFor("name")} className={labelClass}>
                    {fields.name.label}
                  </label>
                  <input
                    {...control("name")}
                    type="text"
                    autoComplete="name"
                    required
                    placeholder={fields.name.placeholder}
                    className={input}
                  />
                  <FieldError id={errorIdFor("name")} message={errors.name} />
                </div>
                <div>
                  <label htmlFor={idFor("company")} className={labelClass}>
                    {fields.company.label}
                  </label>
                  <input
                    {...control("company")}
                    type="text"
                    autoComplete="organization"
                    placeholder={fields.company.placeholder}
                    className={input}
                  />
                  <FieldError id={errorIdFor("company")} message={errors.company} />
                </div>
              </div>

              <div>
                <label htmlFor={idFor("email")} className={labelClass}>
                  {fields.email.label}
                </label>
                <input
                  {...control("email")}
                  type="email"
                  autoComplete="email"
                  required
                  placeholder={fields.email.placeholder}
                  className={input}
                />
                <FieldError id={errorIdFor("email")} message={errors.email} />
              </div>

              <div>
                <label htmlFor={idFor("interest")} className={labelClass}>
                  {fields.interest.label}
                </label>
                <select {...control("interest")} className={input}>
                  {fields.interest.options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <FieldError id={errorIdFor("interest")} message={errors.interest} />
              </div>

              <div>
                <label htmlFor={idFor("message")} className={labelClass}>
                  {fields.message.label}
                </label>
                <textarea
                  {...control("message")}
                  rows={3}
                  placeholder={fields.message.placeholder}
                  className={`${input} resize-none`}
                />
                <FieldError id={errorIdFor("message")} message={errors.message} />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-[#0d1b0d] shadow-lg shadow-primary/20 transition hover:bg-green-400 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
              >
                {sending && <LoaderCircle size={18} aria-hidden="true" className="animate-spin" />}
                {submit}
              </button>

              {/* Always rendered, so screen readers announce the message when it appears. */}
              <div aria-live="polite">
                {status === "sent" && (
                  <p className="flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 p-4 text-sm font-semibold text-text-side">
                    <CircleCheck size={18} aria-hidden="true" />
                    {success}
                  </p>
                )}
                {status === "error" && (
                  <p className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    <CircleAlert size={18} aria-hidden="true" />
                    {serverMessage}
                  </p>
                )}
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
