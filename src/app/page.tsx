import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { riskTierFromScore } from "@/lib/enums";
import { PersuadeNav } from "@/components/site/persuade-nav";
import { DashboardIndiaMap, type StateStat } from "@/components/national-dashboard/dashboard-india-map";
import { DashboardTrendChart, type TrendPoint } from "@/components/national-dashboard/dashboard-trend-chart";
import { DashboardAlertBreakdownChart } from "@/components/national-dashboard/dashboard-alert-breakdown-chart";
import {
  DashboardRiskRankings,
  type DistrictRisk,
  type ContractorRisk,
} from "@/components/national-dashboard/dashboard-risk-rankings";
import { DashboardStatusFunnel } from "@/components/national-dashboard/dashboard-status-funnel";
import { ALERT_CATEGORIES, ALERT_CATEGORY_LABELS, PROJECT_STAGES } from "@/lib/enums";

export const dynamic = "force-dynamic";

const DELAY_THRESHOLD_DAYS = 180;

function num(d: unknown): number {
  return d === null || d === undefined ? 0 : Number(d);
}

function formatCr(amountInRupees: number): string {
  const cr = amountInRupees / 1e7;
  return `₹${cr.toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`;
}

// `Mp.allocatedAmount` is seeded already in Crore units (data.md §1 — e.g. a
// single MP's allocation is ~15 Cr, not ~15e7 rupees; /mp-allocations sums
// and displays it the same way). formatCr()'s /1e7 is for rupee-denominated
// fields (Project.sanctionedAmount/billedAmount) and must NOT be applied to
// MP allocation totals — doing so was the bug behind the KPI card reading
// "₹0 Cr" instead of ₹8,335.21 Cr (changes-4.md §2).
function formatCrDirect(amountInCrore: number): string {
  return `₹${amountInCrore.toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`;
}

/**
 * National Overview Dashboard (changes-1.md §2, re-stated harder in
 * changes-3.md §1–§3) — the `/` landing page. Public/unauthenticated (no
 * session check — `/` was never behind the role middleware).
 *
 * Theme: converged onto Persuade (paper/ink/marigold/indigo/teal,
 * PersuadeNav, Anton/Playfair/Nunito) to visually match /projects,
 * /mp-allocations, and /jan-pramaan exactly, per changes-3.md §1's explicit,
 * harder-stated instruction. This is a deliberate departure from
 * design.md's v3 amendment (which had scoped `/` as Operate-mode alongside
 * /ministry) — changes-3.md §1 supersedes that scoping call for this route
 * specifically ("the dashboard currently does not visually match the
 * Projects page... this needs to be fixed directly"). `/ministry` is
 * unaffected: it still imports the original src/components/ministry/*
 * chart components unchanged, while this page now imports Persuade-themed
 * forks from src/components/national-dashboard/*, so the underlying
 * Recharts/react-simple-maps logic is shared in spirit but the two routes
 * no longer share component files.
 */
export default async function NationalOverviewPage() {
  const [mps, projects, parkedFunds, alerts, contractors] = await Promise.all([
    prisma.mp.findMany(),
    prisma.project.findMany({ include: { district: true, mp: true } }),
    prisma.parkedFund.findMany({ include: { district: true } }),
    prisma.alert.findMany({
      include: { project: { include: { district: true } }, contractor: true },
    }),
    prisma.contractor.findMany({ include: { alerts: true } }),
  ]);

  // Real — sum of all seeded Mp.allocatedAmount rows (data.md §1, changes-3.md
  // §2's concrete acceptance test: ≈ ₹8,335.21 Cr across 543 MPs).
  const realMpAllocationTotal = mps.reduce((sum, mp) => sum + num(mp.allocatedAmount), 0);

  const monitoredSanctioned = projects.reduce((sum, p) => sum + num(p.sanctionedAmount), 0);
  const monitoredBilled = projects.reduce((sum, p) => sum + num(p.billedAmount), 0);
  const utilizationPct = monitoredSanctioned > 0 ? (monitoredBilled / monitoredSanctioned) * 100 : 0;

  const flaggedAlertCount = alerts.filter((a) => riskTierFromScore(a.riskScore) === "flagged").length;

  const completedCount = projects.filter(
    (p) => p.status === "completed" || p.status === "citizen_verified" || p.status === "payment_released"
  ).length;
  const now = Date.now();
  const delayedCount = projects.filter(
    (p) => p.status === "in_progress" && now - new Date(p.sanctionDate).getTime() > DELAY_THRESHOLD_DAYS * 86_400_000
  ).length;

  // ── State map (real — live Prisma aggregation, same computation as /ministry) ──
  const stateSet = new Set(mps.map((mp) => mp.state));
  const stateStats: StateStat[] = [...stateSet].map((state) => {
    const stateMps = mps.filter((mp) => mp.state === state);
    const mpAllocatedTotal = stateMps.reduce((sum, mp) => sum + num(mp.allocatedAmount), 0);
    const stateProjects = projects.filter((p) => p.district.state === state);
    const hasProjectData = stateProjects.length > 0;
    const projectSanctioned = stateProjects.reduce((sum, p) => sum + num(p.sanctionedAmount), 0);
    const projectBilled = stateProjects.reduce((sum, p) => sum + num(p.billedAmount), 0);
    const stateAlerts = alerts.filter((a) => a.project && a.project.district.state === state);
    const maxRiskScore = stateAlerts.length ? Math.max(...stateAlerts.map((a) => a.riskScore)) : null;
    return {
      state,
      mpAllocatedTotal,
      mpCount: stateMps.length,
      hasProjectData,
      projectSanctioned,
      projectBilled,
      utilizationPct: hasProjectData && projectSanctioned > 0 ? (projectBilled / projectSanctioned) * 100 : null,
      alertCount: stateAlerts.length,
      maxRiskScore,
      riskTier: maxRiskScore !== null ? riskTierFromScore(maxRiskScore) : null,
    };
  });

  // ── Trend chart — illustrative synthetic curve anchored to real current
  // totals (changes-3.md §2: fine to keep synthetic only where no real time
  // series exists, same convention as /ministry's trendData). ─────────────
  const MONTH_LABELS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  const sanctionedCr = monitoredSanctioned / 1e7;
  const parkedCr = parkedFunds.reduce((sum, f) => sum + num(f.amount), 0) / 1e7;
  const trendData: TrendPoint[] = MONTH_LABELS.map((month, i) => {
    const progress = (i + 1) / MONTH_LABELS.length;
    return {
      month,
      sanctioned: Number((sanctionedCr * (0.55 + 0.45 * progress)).toFixed(2)),
      spent: Number((sanctionedCr * (0.55 + 0.45 * progress) * (0.35 + 0.4 * progress)).toFixed(2)),
      parked: Number((parkedCr * (0.6 + 0.5 * Math.sin(progress * 2))).toFixed(2)),
    };
  });

  const alertBreakdown = ALERT_CATEGORIES.map((category) => ({
    category,
    label: ALERT_CATEGORY_LABELS[category],
    count: alerts.filter((a) => a.category === category).length,
  })).filter((d) => d.count > 0);

  const districtMap = new Map<string, { state: string; scores: number[] }>();
  for (const a of alerts) {
    if (!a.project) continue;
    const key = a.project.district.name;
    const entry = districtMap.get(key) ?? { state: a.project.district.state, scores: [] };
    entry.scores.push(a.riskScore);
    districtMap.set(key, entry);
  }
  const districtRisk: DistrictRisk[] = [...districtMap.entries()]
    .map(([district, { state, scores }]) => {
      const maxRiskScore = Math.max(...scores);
      return { district, state, maxRiskScore, alertCount: scores.length, tier: riskTierFromScore(maxRiskScore) };
    })
    .sort((a, b) => b.maxRiskScore - a.maxRiskScore)
    .slice(0, 10);

  const contractorRisk: ContractorRisk[] = contractors
    .map((c) => {
      if (c.alerts.length > 0) {
        const score = Math.max(...c.alerts.map((a) => a.riskScore));
        return {
          id: c.id,
          companyName: c.companyName,
          score,
          tier: riskTierFromScore(score),
          basis: "alerts" as const,
          kycStatus: c.kycStatus,
        };
      }
      const trust = c.trustScore !== null ? num(c.trustScore) : null;
      const score = trust !== null ? Math.round(100 - trust) : 100;
      return {
        id: c.id,
        companyName: c.companyName,
        score,
        tier: riskTierFromScore(score),
        basis: "trust-proxy" as const,
        kycStatus: c.kycStatus,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const stageCounts: Record<string, number> = {};
  for (const stage of PROJECT_STAGES) stageCounts[stage] = 0;
  for (const p of projects) stageCounts[p.status] = (stageCounts[p.status] ?? 0) + 1;

  return (
    <main className="font-body">
      <PersuadeNav />

      <div className="mx-auto max-w-dashboard px-4 py-10 sm:px-6 sm:py-14">
        <p className="max-w-2xl font-serif text-base italic leading-snug text-ink-950/70 sm:text-lg">
          &ldquo;A single-glance read on MPLADS fund health, across every state.&rdquo;
        </p>

        <h1 className="mt-4 font-display text-3xl tracking-tight text-ink-950 sm:text-4xl">
          NATIONAL OVERVIEW
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-950/60 sm:text-base">
          Public, no login required — the same real MP allocation and project data that drives
          every other page in this build.
        </p>

        {/* Quick-glance KPI row — the "Allocated Limit for Hon'ble MPs" card
            is mandatory and clickable through to /mp-allocations
            (changes-1.md §2/§3, changes-3.md §2's acceptance test). */}
        <section aria-label="Quick-glance KPIs" className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Link
            href="/mp-allocations"
            className="block rounded-lg border border-indigo-700/20 bg-indigo-700 p-5 text-white transition-all duration-[250ms] hover:-translate-y-0.5 hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marigold-600"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
              Allocated Limit for Hon&apos;ble MPs
            </p>
            <p className="mt-1.5 font-serif text-2xl tabular-nums">{formatCrDirect(realMpAllocationTotal)}</p>
            <p className="mt-1 text-xs text-white/70">Across {mps.length} MPs — view the full list →</p>
          </Link>

          <KpiCard label="Total Funds Sanctioned" value={formatCr(monitoredSanctioned)} sub="Monitored project set" />
          <KpiCard label="Total Utilized" value={`${utilizationPct.toFixed(1)}%`} sub="Billed vs. sanctioned" />
          <KpiCard
            label="Active High-Risk Alerts"
            value={String(flaggedAlertCount)}
            sub="Risk score ≥ 70"
            emphasis={flaggedAlertCount > 0}
            icon={<WarningCircle size={18} weight="fill" />}
          />
          <KpiCard
            label="Completed vs. Delayed"
            value={`${completedCount} / ${delayedCount}`}
            sub="Projects, national"
          />
        </section>

        {/* Deeper dashboard visualizations — prd.md §4.5, confirmed element
            list per changes-3.md §3. */}
        <div className="mt-10 flex flex-col gap-6">
          <DashboardIndiaMap stats={stateStats} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DashboardTrendChart data={trendData} />
            <DashboardAlertBreakdownChart data={alertBreakdown} />
          </div>

          <DashboardRiskRankings districts={districtRisk} contractors={contractorRisk} />

          <DashboardStatusFunnel counts={stageCounts} />
        </div>
      </div>

      <footer className="border-t border-ink-950/10 bg-ink-950">
        <div className="mx-auto max-w-dashboard px-4 py-10 text-xs leading-relaxed text-paper/40 sm:px-6">
          <p>
            MP fund allocation figures are real, sourced from the official MPLADS allocation list.
            The 12-month utilization trend has no equivalent historical series in this dataset and
            is illustrative, anchored to real current totals — every other figure above is computed
            live from the same records shown elsewhere in this build.
          </p>
        </div>
      </footer>
    </main>
  );
}

function KpiCard({
  label,
  value,
  sub,
  emphasis,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  emphasis?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-lg border p-5 ${
        emphasis ? "border-flagged/30 bg-flagged-tint/40" : "border-ink-950/10 bg-paper-2"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-950/50">{label}</p>
        {icon && <span className={emphasis ? "text-flagged" : "text-ink-950/40"}>{icon}</span>}
      </div>
      <p className={`mt-1.5 font-serif text-2xl tabular-nums ${emphasis ? "text-flagged" : "text-ink-950"}`}>
        {value}
      </p>
      <p className="mt-1 text-xs leading-snug text-ink-950/50">{sub}</p>
    </div>
  );
}
