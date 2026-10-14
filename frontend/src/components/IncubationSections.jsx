import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import content from "../data/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import HeadingCard from "./HeadingCard";
import ButtonLink from "./ButtonLink";
import ContactBlock from "./ContactBlock";
import Icon from "./Icon";
import { anchorOffset, card, container, heading, iconTile, sectionY } from "./styles";

const { incubation, services, technologies, contact, images, nav, ui } = content;

const CARD_IMAGES = { "spawn-incubation": images.spawn, "rtf-incubation": images.oyster };

function FacilityCard({ item }) {
  const image = CARD_IMAGES[item.id];
  return (
    <article id={item.id} className={`${card} ${anchorOffset} flex h-full flex-col overflow-hidden`}>
      {image && (
        <img src={image.src} alt={image.alt} loading="lazy" className="aspect-[16/9] w-full object-cover" />
      )}
      <div className="flex flex-1 flex-col gap-5 p-6 md:p-8">
        <span className={iconTile}>
          <Icon name={item.icon} size={24} />
        </span>
        <h3 className={`text-xl font-bold leading-snug md:text-2xl ${heading}`}>{item.title}</h3>
        <Link
          to={nav.links.contact.to}
          className="mt-auto inline-flex w-fit items-center gap-2 text-sm font-bold text-text-side underline-offset-4 hover:underline"
        >
          {ui.contactUs}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

// Incubation, Services Offered, Mushroom Technologies and the contact details: the former
// Incubation page, now part of the Training page (/training#incubation, #services, #technologies).
export default function IncubationSections() {
  return (
    <>
      {/* Incubation facilities */}
      <section
        id={incubation.id}
        aria-labelledby="incubation-heading"
        className={`${anchorOffset} bg-background-light ${sectionY}`}
      >
        <div className={container}>
          <Reveal>
            <SectionHeading id="incubation-heading" title={incubation.heading} />
          </Reveal>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {incubation.items.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.08} className="h-full">
                <FacilityCard item={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mushroom Technologies */}
      <section
        id={technologies.id}
        aria-labelledby="technologies-heading"
        className={`${anchorOffset} bg-background-light ${sectionY}`}
      >
        <div className={container}>
          <Reveal>
            <SectionHeading id="technologies-heading" title={technologies.heading} />
          </Reveal>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {technologies.items.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.08} className="h-full">
                <HeadingCard id={item.id} icon={item.icon} title={item.title} index={i + 1} className={anchorOffset} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className={`bg-white ${sectionY}`} aria-labelledby="training-contact-heading">
        <div className={container}>
          <Reveal className={`${card} p-6 md:p-10`}>
            <h2 id="training-contact-heading" className={`mb-8 text-2xl font-bold ${heading}`}>
              {contact.heading}
            </h2>
            <ContactBlock layout="grid" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
