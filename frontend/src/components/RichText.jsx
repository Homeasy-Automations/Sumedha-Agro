import { Fragment } from "react";
import { Link } from "react-router-dom";
import content from "../data/content";
import { parseRichText } from "../lib/richText";

const { ui } = content;

// Absolute links to this site are treated like site paths.
const SITE = /^https?:\/\/(www\.)?sumedhaagro\.com(?=[/?#]|$)/i;

const linkClass =
  "font-semibold text-text-side underline decoration-text-side/40 underline-offset-2 transition-colors [overflow-wrap:anywhere] hover:decoration-text-side";

// Plain text with the links described in lib/richText.js. Pages of this site open in the same
// tab; other web addresses open in a new one. newTab: every link opens in a new tab (admin preview).
export default function RichText({ text, newTab = false }) {
  return parseRichText(text).map((part, i) => {
    if (part.type === "text") return <Fragment key={i}>{part.text}</Fragment>;

    const sitePath = part.href.startsWith("/") ? part.href : SITE.test(part.href) ? part.href.replace(SITE, "") || "/" : null;
    if (sitePath && !newTab) {
      return (
        <Link key={i} to={sitePath} className={linkClass}>
          {part.text}
        </Link>
      );
    }
    const external = newTab || /^https?:/i.test(part.href);
    return (
      <a key={i} href={part.href} className={linkClass} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
        {part.text}
        {external && <span className="sr-only"> {ui.opensInNewTab}</span>}
      </a>
    );
  });
}
