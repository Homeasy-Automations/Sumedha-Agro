import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import content from "../data/content";
import usePageMeta from "../hooks/usePageMeta";
import Reveal from "../components/Reveal";
import ButtonLink from "../components/ButtonLink";
import SectionHeading from "../components/SectionHeading";
import HeadingCard from "../components/HeadingCard";
import ContactBlock from "../components/ContactBlock";
import NewsList from "../components/NewsList";
import MediaSection from "../components/MediaSection";
import Icon from "../components/Icon";
import { body, card, cardHover, container, heading, iconTile, pill, pillOnDark, sectionY } from "../components/styles";

const { site, home, about, training, spawnBooking, incubation, news, media, contact, images, nav, ui, meta } = content;

// Focus-area cards on the home page link to the full text on /about,
// or to /contact for items that have no body text.
const focusLayout = ["lg:col-span-2", "", "", "", "", "", ""];

export default function Home() {
  usePageMeta(meta.home);

  return (
    <main>
      {/* Hero */}
      <section className="on-dark relative isolate overflow-hidden bg-background-dark text-white">
        <div aria-hidden="true" className="absolute -top-40 -left-40 -z-10 h-[480px] w-[480px] rounded-full bg-primary/15 blur-[140px]" />
        <div aria-hidden="true" className="absolute -bottom-40 right-0 -z-10 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[140px]" />
        <div className={`${container} grid items-center gap-12 py-16 md:py-24 lg:grid-cols-12 lg:gap-16`}>
          <Reveal className="lg:col-span-7">
            <p className={pillOnDark}>
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary shadow-[0_0_10px_#13ec13]" aria-hidden="true" />
              {site.subtitle}
            </p>
            <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">{site.name}</h1>
            <figure className="mt-8 border-l-4 border-primary pl-5 md:pl-6">
              <blockquote className="text-lg font-medium leading-relaxed text-gray-100 md:text-2xl md:leading-relaxed">
                {home.quote}
              </blockquote>
            </figure>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink to={nav.cta.to} icon={ArrowRight}>
                {nav.cta.label}
              </ButtonLink>
              <ButtonLink to={nav.links.spawnBooking.to} variant="light">
                {nav.links.spawnBooking.label}
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div aria-hidden="true" className="absolute inset-6 -z-10 rounded-[2rem] bg-primary/30 blur-3xl" />
              <img
                src={images.hero.src}
                alt={images.hero.alt}
                fetchPriority="high"
                width="512"
                height="512"
                className="aspect-square w-full rounded-[2rem] border border-white/10 object-cover shadow-2xl"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* About teaser */}
      <section className={`bg-white ${sectionY}`}>
        <div className={`${container} grid items-center gap-8 lg:grid-cols-2 lg:gap-10`}>
          <Reveal>
            <img
              src={images.oyster.src}
              alt={images.oyster.alt}
              loading="lazy"
              width="508"
              height="360"
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <p className={pill}>{about.eyebrow}</p>
            <h2 className={`mt-4 text-3xl font-bold leading-tight tracking-tight md:text-4xl ${heading}`}>
              {about.heading}
            </h2>
            <p className={`mt-6 text-base leading-relaxed md:text-lg ${body}`}>{about.paragraphs[0]}</p>
            <ButtonLink to={nav.links.about.to} variant="outline" icon={ArrowRight} className="mt-6">
              {ui.readMore}
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* Focus area */}
      <section className={`bg-background-light ${sectionY}`} aria-labelledby="focus-heading">
        <div className={container}>
          <Reveal>
            <SectionHeading id="focus-heading" title={about.focus.heading} description={about.focus.statement} />
          </Reveal>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {about.focus.items.map((item, i) => {
              const to = item.body ? `${nav.links.about.to}#${item.id}` : nav.links.contact.to;
              return (
                <li key={item.id} className={focusLayout[i]}>
                  <Reveal delay={(i % 4) * 0.06} className="h-full">
                    <Link to={to} className={`group ${card} ${cardHover} flex h-full flex-col gap-5 p-6`}>
                      <span className={`${iconTile} transition-colors group-hover:bg-primary group-hover:text-[#0d1b0d]`}>
                        <Icon name={item.icon} size={24} />
                      </span>
                      <h3 className={`text-lg font-bold leading-snug ${heading}`}>{item.title}</h3>
                      <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-text-side">
                        {item.body ? ui.readMore : ui.contactUs}
                        <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Spawn Production Training strip */}
      <section className={`on-dark relative isolate overflow-hidden bg-background-dark text-white ${sectionY}`}>
        <div aria-hidden="true" className="absolute -right-32 top-0 -z-10 h-[420px] w-[420px] rounded-full bg-primary/15 blur-[140px]" />
        <div className={`${container} grid items-center gap-8 lg:grid-cols-2 lg:gap-10`}>
          <Reveal>
            <SectionHeading tone="dark" title={training.heading} description={training.sentence} />
            <ol className="mt-6 grid gap-3 sm:grid-cols-2">
              {training.modules.map((module, i) => (
                <li
                  key={module}
                  className={`flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-gray-100 ${i === training.modules.length - 1 ? "sm:col-span-2" : ""}`}
                >
                  <span aria-hidden="true" className="font-mono font-bold text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{module}</span>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex flex-wrap gap-4">
              <ButtonLink to={nav.cta.to} icon={ArrowRight}>
                {nav.cta.label}
              </ButtonLink>
              <ButtonLink to={nav.links.training.to} variant="light">
                {ui.readMore}
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <img
              src={images.training.src}
              alt={images.training.alt}
              loading="lazy"
              width="751"
              height="583"
              className="w-full rounded-3xl border border-white/10 object-cover shadow-2xl"
            />
          </Reveal>
        </div>
      </section>

      {/* Spawn booking */}
      <section className={`bg-white ${sectionY}`}>
        <div className={container}>
          <Reveal>
            <SectionHeading
              title={spawnBooking.heading}
              action={{ label: ui.readMore, to: nav.links.spawnBooking.to }}
            />
            <ul className="mt-6 flex flex-wrap gap-3">
              {spawnBooking.offerings.map((offering) => (
                <li key={offering.label} className={`${pill} px-4 py-2 text-sm`}>
                  <Icon name={offering.icon} size={16} />
                  {offering.label}
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <Reveal>
              <img
                src={images.spawn.src}
                alt={images.spawn.alt}
                loading="lazy"
                width="872"
                height="486"
                className="h-full min-h-56 w-full rounded-2xl object-cover shadow-md"
              />
            </Reveal>
            <Reveal delay={0.08} className="h-full">
              <BookingCard item={spawnBooking.manual}>
                <ContactBlock parts={["phone"]} />
                <Link
                  to={`${nav.links.spawnBooking.to}#${spawnBooking.manual.id}`}
                  className="mt-auto inline-flex w-fit items-center gap-2 text-sm font-bold text-text-side underline-offset-4 hover:underline"
                >
                  {ui.readMore}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </BookingCard>
            </Reveal>
            <Reveal delay={0.16} className="h-full">
              <BookingCard item={spawnBooking.online}>
                <ButtonLink to={spawnBooking.online.to} icon={ArrowRight} className="mt-auto w-fit">
                  {spawnBooking.online.linkLabel}
                </ButtonLink>
              </BookingCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Incubation */}
      <section className={`bg-background-light ${sectionY}`}>
        <div className={container}>
          <Reveal>
            <SectionHeading title={incubation.heading} action={{ label: ui.readMore, to: nav.links.incubation.to }} />
          </Reveal>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {incubation.items.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.08} className="h-full">
                <HeadingCard icon={item.icon} title={item.title} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* News & Media */}
      <section className={`bg-white ${sectionY}`}>
        <div className={`${container} grid gap-8 lg:grid-cols-2`}>
          <Reveal>
            <SectionHeading title={news.heading} action={{ label: ui.readMore, to: nav.links.news.to }} />
            <div className="mt-6">
              <NewsList limit={3} compact />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <SectionHeading title={media.heading} action={{ label: ui.readMore, to: nav.links.media.to }} />
            <div className="mt-6">
              <MediaSection compact headingLevel="h3" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact strip */}
      <section className={`bg-background-light ${sectionY}`}>
        <div className={container}>
          <Reveal>
            <SectionHeading
              title={contact.heading}
              action={{ label: nav.links.contact.label, to: nav.links.contact.to }}
            />
            <ContactBlock layout="grid" className={`${card} mt-6 p-6 md:p-8`} />
          </Reveal>
        </div>
      </section>
    </main>
  );
}

function BookingCard({ item, children }) {
  return (
    <article className={`${card} flex h-full flex-col gap-5 p-6 md:p-8`}>
      <span className={iconTile}>
        <Icon name={item.icon} size={24} />
      </span>
      <h3 className={`text-xl font-bold ${heading}`}>{item.title}</h3>
      {children}
    </article>
  );
}
