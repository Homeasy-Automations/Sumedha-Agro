import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import content from "../data/content";
import defaultTrainings from "../data/trainings";
import usePageMeta from "../hooks/usePageMeta";
import useSiteContent from "../hooks/useSiteContent";
import Reveal from "../components/Reveal";
import ButtonLink from "../components/ButtonLink";
import TrainingCalendar from "../components/TrainingCalendar";
import IncubationSections from "../components/IncubationSections";
import { anchorOffset, card, cardHover, container, heading, sectionY } from "../components/styles";

const { training, trainingCalendar, incubation, technologies, images, nav, meta } = content;

// Shortcuts to the page's main sections, kept in view below the site header.
const SECTION_LINKS = [trainingCalendar, incubation, technologies];

export default function Training() {
  usePageMeta(meta.training);
  const { items: trainings } = useSiteContent("trainings", defaultTrainings);

  return (
    <main>
      <section className={`bg-white ${sectionY}`}>
        {/* The page title for screen readers and search engines; the page opens with the intro below. */}
        <h1 className="sr-only">{training.heading}</h1>
        <div className={`${container} grid items-center gap-8 lg:grid-cols-2 lg:gap-10`}>
          <Reveal>
            <p className={`border-l-4 border-primary pl-5 text-lg font-medium leading-relaxed md:text-xl ${heading}`}>
              {training.sentence}
            </p>
            <ButtonLink to={nav.cta.to} icon={ArrowRight} className="mt-6">
              {training.applyLabel}
            </ButtonLink>
          </Reveal>
          <Reveal delay={0.1}>
            <img
              src={images.training.src}
              alt={images.training.alt}
              width="751"
              height="583"
              className="w-full rounded-3xl object-cover shadow-xl"
            />
          </Reveal>
        </div>
      </section>

      <nav
        aria-label={training.heading}
        className="sticky top-16 z-30 border-y border-border-light bg-white/95 backdrop-blur-md md:top-[116px]"
      >
        <ul className={`${container} flex gap-2 overflow-x-auto py-3`}>
          {SECTION_LINKS.map((section) => (
            <li key={section.id} className="shrink-0">
              <Link
                to={`#${section.id}`}
                className="inline-flex rounded-full border border-border-light bg-white px-4 py-2 text-sm font-semibold text-[#0d1b0d] transition hover:border-text-side hover:text-text-side"
              >
                {section.heading}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className={`bg-background-light ${sectionY}`} aria-label={training.heading}>
        <div className={container}>
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {training.modules.map((module, i) => (
              <li key={module} className={i === training.modules.length - 1 ? "lg:col-span-2" : ""}>
                <Reveal delay={(i % 4) * 0.06} className="h-full">
                  <div className={`group ${card} ${cardHover} flex h-full flex-col gap-4 p-6`}>
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 items-center justify-center rounded-xl bg-background-dark font-mono text-sm font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-[#0d1b0d]"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className={`text-lg font-semibold leading-snug ${heading}`}>{module}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id={trainingCalendar.id}
        className={`${anchorOffset} bg-white ${sectionY}`}
        aria-labelledby={`${trainingCalendar.id}-heading`}
      >
        <div className={container}>
          <TrainingCalendar items={trainings} />
          <Reveal className="mt-6 flex justify-center">
            <ButtonLink to={nav.cta.to} icon={ArrowRight}>
              {training.applyLabel}
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      <IncubationSections />
    </main>
  );
}
