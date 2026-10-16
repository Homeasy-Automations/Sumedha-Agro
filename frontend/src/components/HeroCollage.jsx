import { GiMushroom } from "react-icons/gi";
import content from "../data/content";
import { whoWeAre } from "../data/legacyContent";

const { images } = content;

// Three columns of two photos with mixed heights; the middle column sits lower so the
// photos stagger like a masonry wall. Photos fill the columns in reading order.
// ratio: the tile's height / width.
const COLUMNS = [
  { offset: "", tiles: [{ aspect: "aspect-[2/3]", ratio: 1.5 }, { aspect: "aspect-square", ratio: 1 }] },
  { offset: "pt-8 md:pt-12", tiles: [{ aspect: "aspect-square", ratio: 1 }, { aspect: "aspect-[2/3]", ratio: 1.5 }] },
  { offset: "", tiles: [{ aspect: "aspect-[2/3]", ratio: 1.5 }, { aspect: "aspect-square", ratio: 1 }] },
];

const gap = "gap-2.5 sm:gap-3 md:gap-4";

// Width the photo is drawn at: tiles are about 170px wide from 640px up (the collage is at
// most 32rem wide there, or its half of the hero) and a third of the screen below, and a
// photo wider than its tile is scaled to the tile's height (object-cover), so it is drawn wider.
function sizes(tileRatio, image) {
  const scale = Math.max(1, tileRatio * (image.width / image.height));
  return `(min-width: 640px) ${Math.round(170 * scale)}px, ${Math.round(30 * scale)}vw`;
}

// Mushroom photo collage for the right side of the home hero. The photos fade in with a CSS
// animation (not Reveal), so they appear with the first paint of the page.
export default function HeroCollage() {
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute inset-6 -z-10 rounded-[2rem] bg-primary/30 blur-3xl" />
      <div className={`grid grid-cols-3 ${gap}`}>
        {COLUMNS.map((column, c) => (
          <div key={c} className={`flex flex-col ${gap} ${column.offset}`}>
            {column.tiles.map((tile, r) => {
              const i = c * column.tiles.length + r;
              const image = images.heroCollage[i];
              return (
                <div
                  key={image.alt}
                  className={`group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl motion-safe:animate-rise ${tile.aspect}`}
                  style={{ animationDelay: `${0.1 + i * 0.07}s` }}
                >
                  <img
                    src={image.src}
                    srcSet={image.small ? `${image.small} ${image.smallWidth}w, ${image.src} ${image.width}w` : undefined}
                    sizes={image.small ? sizes(tile.ratio, image) : undefined}
                    width={image.width}
                    height={image.height}
                    alt={image.alt}
                    fetchPriority={i === 0 ? "high" : undefined}
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <p
        className="absolute -left-2 top-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0d1b0d] shadow-xl motion-safe:animate-rise sm:-left-4 sm:top-8 sm:text-xs"
        style={{ animationDelay: "0.55s" }}
      >
        <GiMushroom size={16} aria-hidden="true" className="text-text-side" />
        {whoWeAre.image.caption}
      </p>
    </div>
  );
}
