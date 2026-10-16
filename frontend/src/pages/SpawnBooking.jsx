import { ArrowRight } from "lucide-react";
import content from "../data/content";
import usePageMeta from "../hooks/usePageMeta";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import ButtonLink from "../components/ButtonLink";
import SectionHeading from "../components/SectionHeading";
import HeadingCard from "../components/HeadingCard";
import ContactBlock from "../components/ContactBlock";
import Icon from "../components/Icon";
import { card, cardHover, container, heading, iconTile, sectionY } from "../components/styles";

const { spawnBooking, valueAdded, images, nav, meta } = content;

function BookingCard({ item, children }) {
  return (
    <article
      id={item.id}
      aria-labelledby={`${item.id}-heading`}
      className={`group ${card} ${cardHover} flex h-full scroll-mt-36 flex-col gap-6 p-6 md:p-10`}
    >
      <span className={`${iconTile} transition-colors group-hover:bg-primary group-hover:text-[#0d1b0d]`}>
        <Icon name={item.icon} size={24} />
      </span>
      <h2 id={`${item.id}-heading`} className={`text-2xl font-bold ${heading}`}>
        {item.title}
      </h2>
      {children}
    </article>
  );
}

export default function SpawnBooking() {
  usePageMeta(meta.spawnBooking);
  const { manual, online } = spawnBooking;

  return (
    <main>
      <PageHeader crumbs={[{ label: nav.links.spawnBooking.label }]} title={spawnBooking.heading} />

      <section className={`bg-background-light ${sectionY}`}>
        <div className={container}>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {spawnBooking.offerings.map((offering, i) => (
              <li key={offering.label}>
                <Reveal delay={i * 0.06} className="h-full">
                  <div className={`group ${card} ${cardHover} flex h-full flex-col items-center gap-3 p-5 text-center`}>
                    <span className={`${iconTile} transition-colors group-hover:bg-primary group-hover:text-[#0d1b0d]`}>
                      <Icon name={offering.icon} size={24} />
                    </span>
                    <span className={`font-semibold ${heading}`}>{offering.label}</span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Reveal className="h-full">
              <BookingCard item={manual}>
                <ContactBlock />
              </BookingCard>
            </Reveal>
            <Reveal delay={0.1} className="h-full">
              <BookingCard item={online}>
                <img
                  src={images.spawn.src}
                  alt={images.spawn.alt}
                  loading="lazy"
                  width="872"
                  height="486"
                  className="aspect-[16/9] w-full rounded-2xl object-cover"
                />
                <ButtonLink to={online.to} icon={ArrowRight} className="mt-auto w-fit">
                  {online.linkLabel}
                </ButtonLink>
              </BookingCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mushroom Value added Products Technologies (formerly its own page) */}
      <section
        id={valueAdded.id}
        aria-labelledby={`${valueAdded.id}-heading`}
        className={`scroll-mt-24 bg-white md:scroll-mt-36 ${sectionY}`}
      >
        <div className={container}>
          <Reveal>
            <SectionHeading id={`${valueAdded.id}-heading`} title={valueAdded.heading} />
          </Reveal>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {valueAdded.items.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.08} className="h-full">
                <HeadingCard id={item.id} icon={item.icon} title={item.title} index={i + 1} />
              </Reveal>
            ))}
          </div>

          {/* Value added products: photo cards, with the credits the CC BY photos require. */}
          <Reveal>
            <h3 className={`mt-12 text-2xl font-bold leading-tight md:mt-16 md:text-3xl ${heading}`}>
              {valueAdded.products.heading}
            </h3>
          </Reveal>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {valueAdded.products.items.map((item, i) => (
              <Reveal key={item.id} delay={(i % 3) * 0.08} className="h-full">
                <HeadingCard id={item.id} icon={item.icon} title={item.title} image={item.image} index={i + 1} level={4} />
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-left text-xs leading-relaxed text-gray-500">
            {valueAdded.products.creditsLabel}:{" "}
            {valueAdded.products.items
              .filter((item) => item.image?.credit)
              .map(({ title, image: { credit } }, i) => (
                <span key={title}>
                  {i > 0 && "; "}
                  {title}: “
                  <a href={credit.url} className="underline underline-offset-2 hover:text-text-side">
                    {credit.title}
                  </a>
                  ” by {credit.author},{" "}
                  <a href={credit.licenseUrl} rel="license" className="underline underline-offset-2 hover:text-text-side">
                    {credit.license}
                  </a>
                </span>
              ))}
            .
          </p>
        </div>
      </section>
    </main>
  );
}
