import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { body, heading, pill, pillOnDark } from "./styles";

// Section title block with optional eyebrow, description and a "Read more" style link.
export default function SectionHeading({ id, eyebrow, title, description, action, tone = "light", center = false }) {
  const dark = tone === "dark";
  return (
    <div
      className={`flex flex-col gap-6 ${center ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}
    >
      <div className="max-w-3xl">
        {eyebrow && <p className={`mb-4 ${dark ? pillOnDark : pill}`}>{eyebrow}</p>}
        <h2
          id={id}
          className={`text-3xl font-bold leading-tight tracking-tight md:text-4xl ${dark ? "text-white" : heading}`}
        >
          {title}
        </h2>
        {description && (
          <p className={`mt-4 text-base leading-relaxed md:text-lg ${dark ? "text-gray-300" : body}`}>
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link
          to={action.to}
          className={`inline-flex shrink-0 items-center gap-2 text-sm font-bold underline-offset-4 hover:underline ${dark ? "text-primary" : "text-text-side"}`}
        >
          {action.label}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
