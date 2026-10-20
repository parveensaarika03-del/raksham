// T06: band badge — colour AND the word, never colour alone (accessibility).
import type { Band } from "../types";

const STYLES: Record<Band, string> = {
  PASS: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-xs shadow-emerald-500/10",
  VERIFY: "border-amber-500/30 bg-amber-500/10 text-amber-300 shadow-xs shadow-amber-500/10",
  HOLD: "border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-xs shadow-rose-500/10",
};

const MARK: Record<Band, string> = { PASS: "✓", VERIFY: "!", HOLD: "✕" };

interface BandBadgeProps {
  band?: Band | null;
  className?: string;
}

export function BandBadge({ band, className = "" }: BandBadgeProps) {
  if (!band) {
    return (
      <span
        data-testid="band-badge"
        className={`inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/80 px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase text-slate-400 ${className}`}
      >
        NO DECISION
      </span>
    );
  }
  return (
    <span
      data-testid="band-badge"
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase ${STYLES[band]} ${className}`}
    >
      <span aria-hidden="true" className="font-extrabold">{MARK[band]}</span>
      {band}
    </span>
  );
}

export default BandBadge;
