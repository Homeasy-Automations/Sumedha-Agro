import { GiMushroom } from "react-icons/gi";
import content from "../data/content";
import { whoWeAre } from "../data/legacyContent";
import Reveal from "./Reveal";

const { images } = content;

// Three columns of two photos with mixed heights; the middle column sits lower so the
// photos stagger like a masonry wall. Photos fill the columns in reading order.
const COLUMNS = [
  { offset: "", aspects: ["aspect-[2/3]", "aspect-square"] },
  { offset: "pt-8 md:pt-12", aspects: ["aspect-square", "aspect-[2/3]"] },
  { offset: "", aspects: ["aspect-[2/3]", "aspect-square"] },
];

const gap = "gap-2.5 sm:gap-3 md:gap-4";

// Mushroom photo collage for the right side of the home hero.
export default function HeroCollage() {
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute inset-6 -z-10 rounded-[2rem] bg-primary/30 blur-3xl" />
      <div className={`grid grid-cols-3 ${gap}`}>
        {COLUMNS.map((column, c) => (
          <div key={c} className={`flex flex-col ${gap} ${column.offset}`}>
            {column.aspects.map((aspect, r) => {
              const i = c * column.aspects.length + r;
              const image = images.heroCollage[i];
              return (
                <Reveal key={image.alt} delay={0.1 + i * 0.07}>
                  <div className={`group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl ${aspect}`}>
                    <img
                      src={image.src}
                      alt={image.alt}
                      fetchPriority={i === 0 ? "high" : undefined}
                      decoding="async"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </div>
                </Reveal>
              );
            })}
          </div>
        ))}
      </div>
      <Reveal delay={0.55} className="absolute -left-2 top-5 sm:-left-4 sm:top-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0d1b0d] shadow-xl sm:text-xs">
          <GiMushroom size={16} aria-hidden="true" className="text-text-side" />
          {whoWeAre.image.caption}
        </p>
      </Reveal>
    </div>
  );
}
