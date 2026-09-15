import Link from "next/link";
import { WarningCircle, TrendUp, TrendDown } from "@phosphor-icons/react/dist/ssr";

// design.md §1.1 / §7 — Operate KPI cards: navy accent only, risk color
// reserved for the one card that is genuinely a risk signal (Active
// High-Risk Alerts). Figures are font-mono tabular-nums throughout.

function formatCr(amountInRupees: number): string {
  const cr = amountInRupees / 1e7;
  return `₹${cr.toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`;
}

export function KpiStrip({
  realMpAllocationTotal,
  realMpMissingCount,
  monitoredSanctioned,
  utilizationPct,
  parkedTotal,
  parkedThresholdBreached,
  flaggedAlertCount,
  completedCount,
  delayedCount,
  inProgressCount,
}: {
  realMpAllocationTotal: number;
  realMpMissingCount: number;
  monitoredSanctioned: number;
  utilizationPct: number;
  parkedTotal: number;
  parkedThresholdBreached: boolean;
  flaggedAlertCount: number;
  completedCount: number;
  delayedCount: number;
  inProgressCount: number;
}) {
  return (
    <section aria-label="National KPI summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <KpiCard
        label="Real MP Fund Allocation (National)"
        value={formatCr(realMpAllocationTotal)}
        sub={`Across 543 MPs — source-verified${realMpMissingCount ? `, ${realMpMissingCount} record${realMpMissingCount > 1 ? "s" : ""} unavailable` : ""}`}
        trend="up"
      />
      <KpiCard
        label="Monitored Projects Sanctioned"
        value={formatCr(monitoredSanctioned)}
        sub="Prototype project set (real + illustrative)"
      />
      <KpiCard
        label="Fund Utilization"
        value={`${utilizationPct.toFixed(1)}%`}
        sub="Billed vs. sanctioned, monitored projects"
      />
      <KpiCard
        label="Parked / Unspent Funds"
        value={formatCr(parkedTotal)}
        sub={parkedThresholdBreached ? "Above ₹10L review threshold" : "Within normal range"}
        emphasis={parkedThresholdBreached ? "watch" : undefined}
      />
      <Link href="#risk-rankings" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700 rounded-lg">
        <KpiCard
          label="Active High-Risk Alerts"
          value={String(flaggedAlertCount)}
          sub="Risk score ≥ 70 — click to view rankings"
          emphasis={flaggedAlertCount > 0 ? "flagged" : undefined}
          icon={<WarningCircle size={18} weight="fill" />}
          interactive
        />
      </Link>
      <KpiCard
        label="Completed vs. Delayed"
        value={`${completedCount} / ${delayedCount}`}
        sub={`${inProgressCount} in progress · delayed = in-progress, sanctioned >180d ago (prototype heuristic)`}
        wide
      />
    </section>
  );
}

function KpiCard({
  label,
  value,
  sub,
  emphasis,
  icon,
  interactive,
  trend,
  wide,
}: {
  label: string;
  value: string;
  sub: string;
  emphasis?: "watch" | "flagged";
  icon?: React.ReactNode;
  interactive?: boolean;
  trend?: "up" | "down";
  wide?: boolean;
}) {
  const emphasisClasses =
    emphasis === "flagged"
      ? "border-flagged/30 bg-flagged-tint/40"
      : emphasis === "watch"
        ? "border-watch/30 bg-watch-tint/40"
        : "border-slate-200 bg-white";

  return (
    <div
      className={`rounded-lg border p-4 ${emphasisClasses} ${wide ? "sm:col-span-2 lg:col-span-1" : ""} ${
        interactive ? "transition-colors duration-150 hover:border-navy-300 h-full" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        {icon && (
          <span className={emphasis === "flagged" ? "text-flagged" : "text-slate-400"}>{icon}</span>
        )}
        {trend === "up" && <TrendUp size={16} weight="bold" className="text-navy-700" />}
        {trend === "down" && <TrendDown size={16} weight="bold" className="text-slate-400" />}
      </div>
      <p className="mt-1.5 font-mono tabular-nums text-2xl font-semibold text-navy-950">{value}</p>
      <p className="mt-1 text-xs leading-snug text-slate-500">{sub}</p>
    </div>
  );
}
