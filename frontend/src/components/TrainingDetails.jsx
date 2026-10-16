import { CircleCheck } from "lucide-react";
import { GiMushroom } from "react-icons/gi";
import content from "../data/content";
import { hasText, hasTrainingDetails } from "../lib/trainingPage";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { anchorOffset, body, card, cardHover, container, heading, sectionY } from "./styles";

const { trainingDetails } = content;

function ListCard({ intro, items, icon, delay }) {
  const ItemIcon = icon;
  if (!hasText(intro) && items.length === 0) return null;
  return (
    <Reveal delay={delay} className="h-full">
      <div className={`${card} ${cardHover} h-full p-6 md:p-8`}>
        {hasText(intro) && <p className={`font-semibold leading-relaxed ${heading}`}>{intro}</p>}
        {items.length > 0 && (
          <ul className={`mt-4 space-y-3 text-sm leading-relaxed first:mt-0 md:text-base ${body}`}>
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <ItemIcon size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-text-side" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Reveal>
  );
}

// "Training Details" and "Course Contents" on the Training page (text editable in the admin
// panel; empty parts are left out). `details`: see src/lib/trainingPage.js.
export default function TrainingDetails({ details }) {
  if (!hasTrainingDetails(details)) return null;
  const headingId = `${trainingDetails.id}-heading`;

  return (
    <section
      id={trainingDetails.id}
      aria-labelledby={hasText(details.heading) ? headingId : undefined}
      aria-label={hasText(details.heading) ? undefined : trainingDetails.heading}
      className={`${anchorOffset} border-t border-border-light bg-white ${sectionY}`}
    >
      <div className={container}>
        {hasText(details.heading) && (
          <Reveal>
            <SectionHeading id={headingId} title={details.heading} />
          </Reveal>
        )}

        <div className="mt-8 grid items-stretch gap-6 first:mt-0 lg:grid-cols-2">
          <ListCard intro={details.intro} items={details.mushrooms} icon={GiMushroom} />
          <ListCard intro={details.aspectsIntro} items={details.aspects} icon={CircleCheck} delay={0.06} />
        </div>

        {hasText(details.closing) && (
          <Reveal>
            <p className={`mt-6 rounded-xl border-l-4 border-primary bg-primary/10 p-5 leading-relaxed ${heading}`}>{details.closing}</p>
          </Reveal>
        )}

        {(hasText(details.courseHeading) || details.courseSections.length > 0) && (
          <div className="mt-12">
            {hasText(details.courseHeading) && (
              <Reveal>
                <h3 className={`text-2xl font-bold tracking-tight md:text-3xl ${heading}`}>{details.courseHeading}</h3>
              </Reveal>
            )}
            {details.courseSections.map((section, s) => (
              <div key={s} className="mt-6">
                {hasText(section.title) && (
                  <Reveal>
                    <h4 className={`text-lg font-bold ${heading}`}>{section.title}</h4>
                  </Reveal>
                )}
                <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {section.items.map((item, i) => (
                    <li key={i}>
                      <Reveal delay={(i % 3) * 0.05} className="h-full">
                        <div className={`group ${card} ${cardHover} flex h-full items-start gap-3 p-4`}>
                          <span
                            aria-hidden="true"
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background-dark font-mono text-xs font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-[#0d1b0d]"
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className={`pt-1 text-sm font-medium leading-snug ${heading}`}>{item}</span>
                        </div>
                      </Reveal>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
