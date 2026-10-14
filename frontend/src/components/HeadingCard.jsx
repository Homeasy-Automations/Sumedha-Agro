import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import content from "../data/content";
import Icon from "./Icon";
import { body as bodyText, card, heading, iconTile } from "./styles";

const { ui, nav } = content;

// Card for a titled item. Items with no body text get a "Contact us" link
// instead of an invented description.
export default function HeadingCard({ id, icon, title, body, index, link, className = "" }) {
  const cta = link ?? (body ? null : { label: ui.contactUs, to: nav.links.contact.to });

  return (
    <article id={id} className={`${card} flex h-full scroll-mt-36 flex-col gap-5 p-6 md:p-8 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <span className={iconTile}>
          <Icon name={icon} size={24} />
        </span>
        {index != null && (
          <span aria-hidden="true" className="font-mono text-sm font-bold text-[#0d1b0d]/30">
            {String(index).padStart(2, "0")}
          </span>
        )}
      </div>
      <h3 className={`text-xl font-bold leading-snug ${heading}`}>{title}</h3>
      {body && <p className={`text-sm leading-relaxed md:text-base ${bodyText}`}>{body}</p>}
      {cta && (
        <Link
          to={cta.to}
          className="mt-auto inline-flex w-fit items-center gap-2 text-sm font-bold text-text-side underline-offset-4 hover:underline"
        >
          {cta.label}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      )}
    </article>
  );
}
