import { Link } from "react-router-dom";
import { ArrowRight, Newspaper } from "lucide-react";
import content from "../data/content";
import Reveal from "../components/Reveal";
import ButtonLink from "../components/ButtonLink";
import SectionHeading from "../components/SectionHeading";
import HeadingCard from "../components/HeadingCard";
import ContactBlock from "../components/ContactBlock";
import NewsList from "../components/NewsList";
import MediaSection from "../components/MediaSection";
import HeroCollage from "../components/HeroCollage";
import Icon from "../components/Icon";
import { body, card, cardHover, container, heading, iconTile, pill, pillOnDark, sectionY } from "../components/styles";
import PartnerCTA from "../components/PartnerCTA";
import { services, trustStrip, whyMushrooms } from "../data/legacyContent";

const { site, home, about, training, spawnBooking, incubation, news, media, images, nav, ui } = content;

// Focus-area cards on the home page link to the full text on /about,
// or to /contact for items that have no body text.
const focusLayout = ["lg:col-span-2", "", "", "", "", "", ""];

export default function Home() {

  return (
    <main>
      {/* Hero */}
      <section className="on-dark relative isolate overflow-hidden bg-background-dark text-white">
        <div aria-hidden="true" className="absolute -top-40 -left-40 -z-10 h-[480px] w-[480px] rounded-full bg-primary/15 blur-[140px]" />
        <div aria-hidden="true" className="absolute -bottom-40 right-0 -z-10 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[140px]" />
        <div className={`${container} grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]`}>
          {/* Not faded in: this text is the page's largest element (LCP), so it shows at once. */}
          <div>
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
          </div>
          <div className="mx-auto w-full max-w-lg lg:max-w-none">
            <HeroCollage />
          </div>
        </div>
      </section>

      {/* Trust strip (restored) */}
      <section className="border-b border-border-light bg-background-light py-6 md:py-8">
        <ul className={`${container} grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4`}>
          {trustStrip.map((item, i) => {
            const ItemIcon = item.icon;
            return (
              <li key={item.label}>
                <Reveal delay={i * 0.06} className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-text-side">
                    <ItemIcon size={22} aria-hidden="true" />
                  </span>
                  <span className={`text-sm font-bold leading-snug md:text-base ${heading}`}>{item.label}</span>
                </Reveal>
              </li>
            );
          })}
        </ul>
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

      {/* Why We Choose Mushrooms? (restored) */}
      <section className={`bg-white ${sectionY}`} aria-labelledby="why-mushrooms-heading">
        <div className={container}>
          <Reveal>
            <SectionHeading id="why-mushrooms-heading" title={whyMushrooms.heading} description={whyMushrooms.intro} />
          </Reveal>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyMushrooms.items.map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <li key={item.title}>
                  <Reveal delay={i * 0.06} className="h-full">
                    <article className={`group ${card} ${cardHover} flex h-full flex-col gap-4 p-6`}>
                      <span className={`${iconTile} transition-colors group-hover:bg-primary group-hover:text-[#0d1b0d]`}>
                        <ItemIcon size={24} aria-hidden="true" />
                      </span>
                      <h3 className={`text-lg font-bold leading-snug ${heading}`}>{item.title}</h3>
                      <p className={`text-sm leading-relaxed md:text-base ${body}`}>{item.text}</p>
                    </article>
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
        {/* The text side is a little wider, so each module fits on one line in two columns
            (xl); between lg and xl the modules are listed in one column for the same reason. */}
        <div className={`${container} grid items-center gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-10`}>
          <Reveal>
            <SectionHeading tone="dark" title={training.heading} description={training.sentence} />
            <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {training.modules.map((module, i) => (
                <li
                  key={module}
                  className={`flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-left text-sm text-gray-100 ${i === training.modules.length - 1 ? "sm:col-span-2 lg:col-span-1 xl:col-span-2" : ""}`}
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
              src={images.homeTraining.src}
              alt={images.homeTraining.alt}
              loading="lazy"
              width="1600"
              height="901"
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

      {/* Our Services: Complete Mushroom Ecosystem (restored; training first) */}
      <section className={`border-t border-border-light bg-white ${sectionY}`} aria-labelledby="services-heading">
        <div className={container}>
          <Reveal>
            <SectionHeading
              id="services-heading"
              eyebrow={services.eyebrow}
              title={services.heading}
              description={services.intro}
            />
          </Reveal>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.items.map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <li key={item.title}>
                  <Reveal delay={(i % 3) * 0.06} className="h-full">
                    <Link to={item.to} className={`group ${card} ${cardHover} flex h-full flex-col gap-4 p-6`}>
                      <span className={`${iconTile} transition-colors group-hover:bg-primary group-hover:text-[#0d1b0d]`}>
                        <ItemIcon size={24} aria-hidden="true" />
                      </span>
                      <h3 className={`text-lg font-bold leading-snug ${heading}`}>{item.title}</h3>
                      <p className={`text-sm leading-relaxed md:text-base ${body}`}>{item.text}</p>
                      <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-text-side">
                        {services.linkLabel}
                        <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>
          <Reveal className="mt-8 flex justify-center">
            <ButtonLink to={services.cta.to} icon={ArrowRight}>
              {services.cta.label}
            </ButtonLink>
          </Reveal>
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

      {/* News & Media. On large screens both columns share a heading row and a content row
          (subgrid), so "Latest updates", "Mushroom Videos" and "Gallery" start on one line even
          when a heading wraps, and the news cards, video and gallery all end on one line. */}
      <section className={`bg-white ${sectionY}`}>
        <div className={`${container} grid gap-8 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-6`}>
          <Reveal className="flex flex-col gap-6 lg:row-span-2 lg:grid lg:grid-rows-subgrid">
            <SectionHeading title={news.heading} action={{ label: ui.readMore, to: nav.links.news.to }} />
            <div className="flex flex-col">
              <h3 className={`mb-4 flex items-center gap-2 text-lg font-bold ${heading}`}>
                <Newspaper size={18} aria-hidden="true" className="text-text-side" />
                {news.latestHeading}
              </h3>
              <NewsList limit={2} compact className="flex-1" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-6 lg:row-span-2 lg:grid lg:grid-rows-subgrid">
            <SectionHeading title={media.heading} action={{ label: ui.readMore, to: nav.links.media.to }} />
            <div className="flex flex-col">
              <MediaSection compact headingLevel="h3" className="flex-1" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Partner with Sumedha Agro (restored) */}
      <PartnerCTA />
    </main>
  );
}

function BookingCard({ item, children }) {
  return (
    <article className={`group ${card} ${cardHover} flex h-full flex-col gap-5 p-6 md:p-8`}>
      <span className={`${iconTile} transition-colors group-hover:bg-primary group-hover:text-[#0d1b0d]`}>
        <Icon name={item.icon} size={24} />
      </span>
      <h3 className={`text-xl font-bold ${heading}`}>{item.title}</h3>
      {children}
    </article>
  );
}
