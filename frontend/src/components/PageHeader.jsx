import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import content from "../data/content";
import { container, pill } from "./styles";

const { nav, ui } = content;

// Inner-page banner: breadcrumb, optional eyebrow and the page <h1>.
// crumbs: [{ label, to? }] after Home; the last crumb is the current page.
export default function PageHeader({ title, eyebrow, crumbs = [] }) {
  const trail = [{ label: nav.links.home.label, to: nav.links.home.to }, ...crumbs];

  return (
    <section className="relative isolate overflow-hidden border-b border-border-light bg-gradient-to-b from-[#f4fbf4] to-white text-[#0d1b0d]">
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-24 -z-10 h-96 w-96 rounded-full bg-primary/15 blur-[120px]"
      />
      <div className={`${container} py-12 md:py-16`}>
        <nav aria-label={ui.breadcrumb}>
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[#5b735b]">
            {trail.map((crumb, i) => {
              const last = i === trail.length - 1;
              return (
                <li key={crumb.label} className="flex items-center gap-1.5">
                  {last ? (
                    <span aria-current="page" className="font-semibold text-text-side">
                      {crumb.label}
                    </span>
                  ) : (
                    <>
                      <Link to={crumb.to} className="hover:text-text-side hover:underline">
                        {crumb.label}
                      </Link>
                      <ChevronRight size={14} aria-hidden="true" className="text-gray-400" />
                    </>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        {eyebrow && <p className={`mt-8 ${pill}`}>{eyebrow}</p>}
        <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight tracking-tight md:text-5xl">{title}</h1>
      </div>
    </section>
  );
}
