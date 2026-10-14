import { CalendarDays } from "lucide-react";
import content from "../data/content";

// Honest placeholder for sections whose data has not been supplied yet.
export default function EmptyState({ icon = CalendarDays, label = content.ui.toBeAnnounced, compact = false }) {
  const Glyph = icon;
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#0d1b0d]/10 bg-white/60 text-center ${compact ? "px-4 py-8" : "px-6 py-16"}`}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-text-side">
        <Glyph size={22} aria-hidden="true" />
      </span>
      <p className="text-sm font-semibold text-[#5b735b]">{label}</p>
    </div>
  );
}
