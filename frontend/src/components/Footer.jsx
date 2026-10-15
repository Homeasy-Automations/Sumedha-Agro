import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, LoaderCircle } from "lucide-react";
import logo from "../assets/Logo.webp";
import content from "../data/content";
import { newsletter } from "../data/legacyContent";
import useVisitorCount from "../hooks/useVisitorCount";
import { apiRequest } from "../lib/api";
import ContactBlock from "./ContactBlock";
import { containerWide, input } from "./styles";

const { footer, site } = content;
const YEAR = new Date().getFullYear();

const linkClass = "text-sm text-gray-600 transition-colors hover:text-text-side";

function LinkColumn({ title, links }) {
  return (
    <div>
      <h2 className="mb-5 text-base font-bold text-[#0d1b0d]">{title}</h2>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className={linkClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Compact counter for the bottom bar, between the copyright line and the legal links.
function VisitorCount() {
  const { label, fallback } = footer.visitorCount;
  const value = useVisitorCount(fallback);
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-border-light bg-background-light px-3.5 py-1.5">
      <Eye size={15} aria-hidden="true" className="text-text-side" />
      <span>{label}</span>
      <span className="font-mono font-bold tracking-[0.15em] text-[#0d1b0d] tabular-nums">
        {String(value).padStart(6, "0")}
      </span>
    </p>
  );
}

// "Stay Updated" newsletter sign-up (restored), saved through POST /api/subscribe.
// The browser checks the address (required, type="email"); the API has the final say.
function Newsletter() {
  const uid = useId();
  const [email, setEmail] = useState("");
  const [result, setResult] = useState({ state: "idle", message: "" }); // idle | sending | done | error
  const sending = result.state === "sending";
  const SubmitIcon = newsletter.submitIcon;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setResult({ state: "sending", message: "" });
    try {
      const { status } = await apiRequest("/api/subscribe", {
        method: "POST",
        body: { email: email.trim() },
        withStatus: true,
      });
      setEmail("");
      setResult({ state: "done", message: status === 201 ? newsletter.messages.created : newsletter.messages.exists });
    } catch (err) {
      setResult({ state: "error", message: err.errors?.email || err.message });
    }
  };

  return (
    <div>
      <h2 className="mb-5 text-base font-bold text-[#0d1b0d]">{newsletter.heading}</h2>
      <p className="mb-4 text-sm leading-relaxed text-gray-600">{newsletter.text}</p>
      <form onSubmit={handleSubmit} aria-busy={sending} className="flex gap-2">
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (result.state === "error") setResult({ state: "idle", message: "" });
          }}
          placeholder={newsletter.placeholder}
          aria-label={newsletter.placeholder}
          aria-invalid={result.state === "error" ? true : undefined}
          aria-describedby={`${uid}-status`}
          className={`${input} min-w-0`}
        />
        <button
          type="submit"
          disabled={sending}
          aria-label={newsletter.submitLabel}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-[#0d1b0d] shadow-sm transition hover:bg-green-400 active:scale-[0.97] disabled:cursor-wait disabled:opacity-70"
        >
          {sending ? (
            <LoaderCircle size={18} aria-hidden="true" className="animate-spin" />
          ) : (
            <SubmitIcon size={20} aria-hidden="true" />
          )}
        </button>
      </form>
      <p
        id={`${uid}-status`}
        aria-live="polite"
        className={`mt-2 min-h-5 text-sm font-medium ${result.state === "error" ? "text-red-600" : "text-text-side"}`}
      >
        {result.message}
      </p>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-border-light bg-white text-[#3f5f3f]">
      <div className={`${containerWide} pb-6 pt-10`}>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.2fr_0.9fr_1.1fr_1.6fr_1.2fr]">
          <div className="flex flex-col items-center gap-5 text-center">
            <Link to="/" className="flex w-fit flex-col items-center gap-3">
              <img
                src={logo}
                alt={site.logoAlt}
                className="h-16 w-auto object-contain"
                width="70"
                height="70"
              />
              <span className="text-xl font-bold tracking-tight text-[#0d1b0d]">{site.name}</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-600">{footer.tagline}</p>
          </div>

          <LinkColumn title={footer.quickLinksHeading} links={footer.quickLinks} />
          <LinkColumn title={footer.quickLinksHeading} links={footer.quickLinks2} />

          <div>
            <h2 className="mb-5 text-base font-bold text-[#0d1b0d]">{footer.contactHeading}</h2>
            <ContactBlock parts={["address", "phone", "email"]} />
          </div>

          <Newsletter />
        </div>

        {/* Copyright left, visitor count centred, legal links right (stacked on small screens). */}
        <div className="mt-8 flex flex-col items-center gap-4 border-t border-border-light pt-6 text-sm text-gray-600 md:grid md:grid-cols-[1fr_auto_1fr]">
          <p className="md:justify-self-start">
            © {YEAR} {footer.copyright}
          </p>
          <VisitorCount />
          <ul className="flex gap-6 md:justify-self-end">
            {footer.legal.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-text-side">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
