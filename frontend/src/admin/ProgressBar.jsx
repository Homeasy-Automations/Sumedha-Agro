// Upload progress (0–1). Hidden when progress is null.
export default function ProgressBar({ value, label }) {
  if (value == null) return null;
  const percent = Math.round(value * 100);
  return (
    <div className="flex items-center gap-3">
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200"
      >
        <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${percent}%` }} />
      </div>
      <span className="w-10 text-right text-xs font-semibold text-[#5b735b]">{percent}%</span>
    </div>
  );
}
