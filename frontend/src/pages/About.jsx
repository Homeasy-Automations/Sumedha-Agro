import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import content from "../data/content";
import usePageMeta from "../hooks/usePageMeta";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import HeadingCard from "../components/HeadingCard";
import ButtonLink from "../components/ButtonLink";
import { body, card, cardHover, container, heading, muted, pillOnDark, sectionY } from "../components/styles";
import { aboutCta, commitment, leadership, missionVision, stats, whoWeAre } from "../data/legacyContent";

const { about, training, images, nav, ui, meta } = content;

const MotionDiv = motion.div;
const BadgeIcon = whoWeAre.badge.icon;

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
      {/* Who We Are + Live from Lab (restored); its heading is the page's h1 */}
      <section
        className={`on-dark relative isolate overflow-hidden bg-background-dark text-white ${sectionY}`}
        aria-labelledby="who-we-are-heading"
      >
        <div aria-hidden="true" className="absolute -left-40 -top-40 -z-10 h-[420px] w-[420px] rounded-full bg-primary/15 blur-[140px]" />
        <div className={`${container} grid items-center gap-8 lg:grid-cols-2 lg:gap-12`}>
          <Reveal>
            <p className={pillOnDark}>
              <BadgeIcon size={16} aria-hidden="true" />
              {whoWeAre.badge.label}
            </p>
            <h1 id="who-we-are-heading" className="mt-5 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              {whoWeAre.heading.lead}{" "}
              <span className="text-primary underline decoration-primary/40 decoration-4 underline-offset-8">
                {whoWeAre.heading.highlight}
              </span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-gray-300 md:text-lg">{whoWeAre.text}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <figure className="group relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <img
                src={whoWeAre.image.src}
                alt={whoWeAre.image.alt}
                width="512"
                height="512"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <figcaption className="absolute bottom-5 left-5 rounded-full bg-black/40 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
                {whoWeAre.image.caption}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

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

      {/* Why Mushrooms? stats (restored) */}
      <section className={`bg-white ${sectionY}`} aria-labelledby="stats-heading">
        <div className={container}>
          <Reveal>
            <SectionHeading id="stats-heading" title={stats.heading} description={stats.text} center />
          </Reveal>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {stats.items.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <li key={stat.label}>
                  <Reveal delay={i * 0.08} className="h-full">
                    <div className={`group flex h-full flex-col gap-3 rounded-2xl border border-border-light bg-background-light p-6 shadow-sm md:p-8 ${cardHover}`}>
                      <span className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-text-side transition-colors group-hover:bg-primary group-hover:text-[#0d1b0d]">
                        <StatIcon size={24} aria-hidden="true" />
                      </span>
                      <p className={`text-base font-medium ${body}`}>{stat.label}</p>
                      <p className={`text-4xl font-black leading-tight tracking-tight ${heading}`}>
                        {stat.value} <span className={`text-lg font-medium ${muted}`}>{stat.unit}</span>
                      </p>
                      <div aria-hidden="true" className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                        <MotionDiv
                          className="h-full origin-left rounded-full bg-primary"
                          style={{ width: `${stat.progress}%` }}
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Mission & Vision (restored) */}
      <section className={`bg-background-light ${sectionY}`}>
        <div className={`${container} grid gap-6 md:grid-cols-2`}>
          {missionVision.map((entry, i) => {
            const CardIcon = entry.icon;
            return (
              <Reveal key={entry.title} delay={i * 0.1} className="h-full">
                <article className={`group ${card} ${cardHover} relative isolate flex h-full flex-col gap-5 overflow-hidden p-6 md:p-10`}>
                  <div
                    aria-hidden="true"
                    className={`absolute -z-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl ${i === 0 ? "-right-16 -top-16" : "-bottom-16 -left-16"}`}
                  />
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 text-text-side transition-colors group-hover:bg-primary group-hover:text-[#0d1b0d]">
                    <CardIcon size={28} aria-hidden="true" />
                  </span>
                  <h2 className={`text-2xl font-bold leading-tight ${heading}`}>{entry.title}</h2>
                  <p className={`text-base leading-relaxed ${body}`}>{entry.text}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Commitment (restored) */}
      <section
        className={`relative isolate overflow-hidden bg-gradient-to-b from-[#f4fbf4] to-[#eaffea] ${sectionY}`}
        aria-labelledby="commitment-heading"
      >
        <div aria-hidden="true" className="absolute -top-32 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
        <div className={container}>
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 id="commitment-heading" className={`text-3xl font-bold leading-tight tracking-tight md:text-5xl ${heading}`}>
              {commitment.heading}
            </h2>
            <p className={`mt-5 text-base leading-relaxed md:text-lg ${body}`}>{commitment.text}</p>
          </Reveal>
        </div>
      </section>

      {/* Our Leadership (restored) */}
      <section className={`bg-white ${sectionY}`} aria-labelledby="leadership-heading">
        <div className={container}>
          <Reveal>
            <SectionHeading
              id="leadership-heading"
              eyebrow={leadership.eyebrow}
              title={leadership.heading}
              description={leadership.intro}
              center
            />
          </Reveal>
          <ul className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {leadership.members.map((member, i) => (
              <li key={member.name}>
                <Reveal delay={(i % 4) * 0.06} className="h-full">
                  {/* Borderless until hovered, when it lifts into a card. */}
                  <div className={`group flex h-full flex-col items-center rounded-2xl border border-transparent p-5 text-center ${cardHover} hover:bg-white`}>
                    <img
                      src={member.image}
                      alt={member.alt}
                      loading="lazy"
                      width="144"
                      height="144"
                      className="mb-5 h-36 w-36 rounded-full border-4 border-white object-cover object-[50%_20%] shadow-lg ring-1 ring-border-light transition-colors duration-300 group-hover:border-primary"
                    />
                    <h3 className={`text-lg font-bold ${heading}`}>{member.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-text-side">{member.role}</p>
                    <p className={`mt-3 max-w-xs text-sm leading-relaxed ${muted}`}>{member.bio}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing CTA (restored) */}
      <section className={`bg-background-light ${sectionY}`}>
        <div className={container}>
          <Reveal>
            <div className="on-dark relative isolate overflow-hidden rounded-3xl bg-background-dark p-8 text-white md:p-12">
              <div aria-hidden="true" className="absolute -left-20 -bottom-20 -z-10 h-72 w-72 rounded-full bg-primary/25 blur-[100px]" />
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{aboutCta.heading}</h2>
                  <p className="mt-3 leading-relaxed text-gray-300">{aboutCta.text}</p>
                </div>
                <ButtonLink to={aboutCta.button.to} icon={ArrowRight} className="shrink-0">
                  {aboutCta.button.label}
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
