import { ArrowRight } from "lucide-react";
import content from "../data/content";
import usePageMeta from "../hooks/usePageMeta";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import HeadingCard from "../components/HeadingCard";
import ButtonLink from "../components/ButtonLink";
import { body, container, heading, sectionY } from "../components/styles";

const { about, training, images, nav, ui, meta } = content;

// Grid spans keep the seven focus cards in full rows: 3 columns on lg, 2 on md.
const focusSpans = {
  "research-and-development": "md:col-span-2",
  "women-empowerment-through-rtf-bags": "md:col-span-2 lg:col-span-1",
  "value-addition-and-nutrition": "md:col-span-2",
};

export default function About() {
  usePageMeta(meta.about);
  const [lead, ...rest] = about.paragraphs;

  return (
    <main>
      <PageHeader crumbs={[{ label: about.label }]} eyebrow={about.eyebrow} title={about.heading} />

      <section className={`bg-white ${sectionY}`}>
        <div className={`${container} grid gap-8 lg:grid-cols-12 lg:gap-10`}>
          <Reveal className="space-y-6 lg:col-span-7">
            <p className={`text-lg font-medium leading-relaxed md:text-xl ${heading}`}>{lead}</p>
            {rest.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className={`text-base leading-relaxed md:text-lg ${body}`}>
                {paragraph}
              </p>
            ))}
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="grid gap-6 sm:grid-cols-2 lg:sticky lg:top-36 lg:grid-cols-1">
              <img
                src={images.oyster.src}
                alt={images.oyster.alt}
                loading="lazy"
                width="508"
                height="360"
                className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl"
              />
              <img
                src={images.training.src}
                alt={images.training.alt}
                loading="lazy"
                width="751"
                height="583"
                className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section
        className={`bg-background-light ${sectionY}`}
        aria-labelledby="focus-heading"
      >
        <div className={container}>
          <Reveal>
            <SectionHeading id="focus-heading" title={about.focus.heading} />
            <p className={`mt-6 max-w-4xl border-l-4 border-primary pl-5 text-lg leading-relaxed md:text-xl ${heading}`}>
              {about.focus.statement}
            </p>
          </Reveal>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {about.focus.items.map((item, i) => (
              <Reveal key={item.id} delay={(i % 3) * 0.06} className={`h-full ${focusSpans[item.id] ?? ""}`}>
                <HeadingCard id={item.id} icon={item.icon} title={item.title} body={item.body} />
              </Reveal>
            ))}
          </div>

          {/* Training CTA banner */}
          <Reveal className="mt-10">
            <div className="on-dark relative isolate overflow-hidden rounded-3xl bg-background-dark p-8 text-white md:p-12">
              <div aria-hidden="true" className="absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full bg-primary/25 blur-[100px]" />
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{training.heading}</h2>
                  <p className="mt-3 leading-relaxed text-gray-300">{training.sentence}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-4">
                  <ButtonLink to={nav.cta.to} icon={ArrowRight}>
                    {nav.cta.label}
                  </ButtonLink>
                  <ButtonLink to={nav.links.training.to} variant="light">
                    {ui.readMore}
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
