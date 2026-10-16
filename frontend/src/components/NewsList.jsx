import { ExternalLink, Newspaper } from "lucide-react";
import content from "../data/content";
import useSiteContent from "../hooks/useSiteContent";
import EmptyState from "./EmptyState";
import Reveal from "./Reveal";
import LinkContext from "./LinkContext";
import RichText from "./RichText";
import { body, card, cardHover, heading, muted } from "./styles";

const { news, ui } = content;
const NEWS_FALLBACK = news.items;

const dateFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

// News & announcements, managed in the admin panel (latest first).
// compact: home-page preview. The cards fill the list's height (pass a className such as flex-1
// to stretch it); a single item shows a longer excerpt, several show only date and headline.
export default function NewsList({ limit, compact = false, className = "" }) {
  const { items: all, loading } = useSiteContent("news", NEWS_FALLBACK);
  const items = limit ? all.slice(0, limit) : all;
  const showBody = !compact || items.length === 1;

  if (loading && items.length === 0) {
    return (
      <ul className="flex flex-col gap-4" aria-hidden="true">
        {Array.from({ length: compact ? 2 : 3 }, (_, i) => (
          <li key={i} className="h-24 animate-pulse rounded-2xl bg-[#0d1b0d]/5" />
        ))}
      </ul>
    );
  }
  if (items.length === 0) return <EmptyState icon={Newspaper} compact={compact} />;

  return (
    <ul className={`flex flex-col gap-4 ${className}`}>
      {items.map((item, i) => (
        <li key={item.id ?? `${item.date}-${item.title}`} className={compact ? "flex-1" : undefined}>
          <Reveal delay={Math.min(i, 5) * 0.06} className="h-full">
            <article className={`${card} ${cardHover} flex h-full flex-col ${compact ? "p-4 md:p-5" : "p-5 md:p-6"}`}>
              {item.date && (
                <time dateTime={item.date} className={`text-xs font-semibold ${muted}`}>
                  {dateFormat.format(new Date(`${item.date}T00:00:00Z`))}
                </time>
              )}
              <h3 className={`mt-1 text-lg font-bold ${heading} ${compact ? "line-clamp-2" : ""}`}>{item.title}</h3>
              {showBody && item.body && (
                <p className={`mt-2 whitespace-pre-line text-base font-medium leading-relaxed ${body} ${compact ? "line-clamp-3" : "md:text-[17px]"}`}>
                  <RichText text={item.body} />
                </p>
              )}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex w-fit items-center gap-1.5 pt-3 text-sm font-bold text-text-side underline-offset-4 hover:underline"
                >
                  {ui.readMore}
                  <LinkContext>{item.title}</LinkContext>
                  <ExternalLink size={14} aria-hidden="true" />
                  <span className="sr-only">{ui.opensInNewTab}</span>
                </a>
              )}
            </article>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
