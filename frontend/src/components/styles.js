// Shared Tailwind class strings for the rebuilt pages.
export const container = "mx-auto w-full max-w-7xl px-4 md:px-10";
// Wider variant (96rem, defined in index.css), used by the footer.
export const containerWide = "mx-auto w-full max-w-9xl px-4 md:px-10";
export const sectionY = "py-10 md:py-14";
// Anchor targets on pages with a sticky section-links bar: clears the site header, that bar,
// and the 24px a <Reveal> block is still shifted down by when the jump starts.
export const anchorOffset = "scroll-mt-40 md:scroll-mt-52";
export const heading = "text-[#0d1b0d]";
export const body = "text-[#3f5f3f]";
export const muted = "text-[#5b735b]";
export const accentLink =
  "font-semibold text-text-side underline-offset-4 hover:underline";
export const card =
  "rounded-2xl border border-border-light bg-white shadow-sm";
// Hover for cards: lift, green border, deeper shadow (no lift when the visitor prefers reduced
// motion). Put it on the card itself, not on a <Reveal> (its own transform would win).
export const cardHover =
  "transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0";
export const iconTile =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-text-side";
export const pill =
  "inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-wide text-text-side";
// Text inputs, selects and textareas (same look as the training form); red border when aria-invalid.
export const input =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-[#0d1b0d] shadow-sm transition placeholder:text-slate-400 focus:border-text-side focus:outline-none focus:ring-2 focus:ring-text-side/25 aria-[invalid=true]:border-red-500";
export const pillOnDark =
  "inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-wide text-primary backdrop-blur-md";
