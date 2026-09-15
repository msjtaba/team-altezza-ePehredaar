import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { MetricCard } from "@/components/untitled-ui/metric-card";

// design.md §1.1 / §7 — Operate KPI cards: navy accent only, risk color
// reserved for the one card that is genuinely a risk signal (Active
// High-Risk Alerts). Figures are font-mono tabular-nums throughout.
// Restyled onto the Untitled UI React metric/stat card pattern
// (changes-2.md §1/§2) — same data wiring, new component shell.

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
      {/* Allocated Limit for Hon'ble MPs — clickable through to the MP
          Allocation page (changes-2.md §2's confirmed card). */}
      <Link
        href="/mp-allocations"
        className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <MetricCard
          label="Allocated Limit for Hon'ble MPs"
          value={formatCr(realMpAllocationTotal)}
          sub={`Across 543 MPs — source-verified${realMpMissingCount ? `, ${realMpMissingCount} record${realMpMissingCount > 1 ? "s" : ""} unavailable` : ""}. Click for the full MP Allocation view.`}
          trend="up"
          trendLabel="verified"
          interactive
        />
      </Link>
      <MetricCard
        label="Monitored Projects Sanctioned"
        value={formatCr(monitoredSanctioned)}
        sub="Prototype project set (real + illustrative)"
      />
      <MetricCard
        label="Fund Utilization"
        value={`${utilizationPct.toFixed(1)}%`}
        sub="Billed vs. sanctioned, monitored projects"
      />
      <MetricCard
        label="Parked / Unspent Funds"
        value={formatCr(parkedTotal)}
        sub={parkedThresholdBreached ? "Above ₹10L review threshold" : "Within normal range"}
        tone={parkedThresholdBreached ? "warning" : "default"}
      />
      <Link href="#risk-rankings" className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
        <MetricCard
          label="Active High-Risk Alerts"
          value={String(flaggedAlertCount)}
          sub="Risk score ≥ 70 — click to view rankings"
          tone={flaggedAlertCount > 0 ? "error" : "default"}
          icon={<WarningCircle size={18} weight="fill" />}
          interactive
        />
      </Link>
      <MetricCard
        label="Completed vs. Delayed"
        value={`${completedCount} / ${delayedCount}`}
        sub={`${inProgressCount} in progress · delayed = in-progress, sanctioned >180d ago (prototype heuristic)`}
        className="sm:col-span-2 lg:col-span-1"
      />
    </section>
  );
}
