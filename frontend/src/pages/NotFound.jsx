import { ArrowRight } from "lucide-react";
import content from "../data/content";
import ButtonLink from "../components/ButtonLink";
import { body, container, heading, sectionY } from "../components/styles";

const { meta, nav } = content;

// Shown for addresses that are not pages of the site. components/Seo.jsx marks it noindex.
export default function NotFound() {
  return (
    <main className={`bg-white ${sectionY}`}>
      <div className={`${container} max-w-2xl text-center`}>
        <p className="font-mono text-sm font-bold text-text-side">404</p>
        <h1 className={`mt-3 text-3xl font-bold tracking-tight md:text-5xl ${heading}`}>{meta.notFound.title}</h1>
        <p className={`mt-4 text-base md:text-lg ${body}`}>{meta.notFound.description}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <ButtonLink to={nav.links.home.to} icon={ArrowRight}>
            {nav.links.home.label}
          </ButtonLink>
          <ButtonLink to={nav.links.contact.to} variant="outline">
            {nav.links.contact.label}
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
