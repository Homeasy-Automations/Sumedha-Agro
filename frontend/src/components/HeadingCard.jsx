import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import content from "../data/content";
import Icon from "./Icon";
import { body as bodyText, card, cardHover, heading, iconTile } from "./styles";

const { ui, nav } = content;

// Card for a titled item. Items with no body text get a "Contact us" link
// instead of an invented description. An optional image ({ src, alt }) fills the top of the card;
// `level` sets the title's heading level (h3 unless the cards sit under a sub-heading).
export default function HeadingCard({ id, icon, title, body, index, link, image, level = 3, className = "" }) {
  const cta = link ?? (body ? null : { label: ui.contactUs, to: nav.links.contact.to });
  const Title = `h${level}`;

  return (
    <article id={id} className={`group ${card} ${cardHover} flex h-full scroll-mt-36 flex-col overflow-hidden ${className}`}>
      {image && (
        <div className="aspect-[4/3] overflow-hidden bg-background-light">
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-5 p-6 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <span className={`${iconTile} transition-colors group-hover:bg-primary group-hover:text-[#0d1b0d]`}>
            <Icon name={icon} size={24} />
          </span>
          {index != null && (
            <span aria-hidden="true" className="font-mono text-sm font-bold text-[#0d1b0d]/30">
              {String(index).padStart(2, "0")}
            </span>
          )}
        </div>
        <Title className={`text-xl font-bold leading-snug ${heading}`}>{title}</Title>
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
      </div>
    </article>
  );
}
