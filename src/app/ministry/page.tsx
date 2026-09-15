import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  PROJECT_STAGES,
  ALERT_CATEGORIES,
  ALERT_CATEGORY_LABELS,
  riskTierFromScore,
} from "@/lib/enums";
import { KpiStrip } from "@/components/ministry/KpiStrip";
import { IndiaMap, type StateStat } from "@/components/ministry/IndiaMap";
import { TrendChart, type TrendPoint } from "@/components/ministry/TrendChart";
import { AlertBreakdownChart } from "@/components/ministry/AlertBreakdownChart";
import { RiskRankings, type DistrictRisk, type ContractorRisk } from "@/components/ministry/RiskRankings";
import { StatusFunnel } from "@/components/ministry/StatusFunnel";
import { ActivityFeed, type ActivityItem } from "@/components/ministry/ActivityFeed";

export const dynamic = "force-dynamic";

const PARKED_THRESHOLD = 1_000_000; // ₹10L (prd.md §4.5's "called out distinctly" threshold)
const DELAY_THRESHOLD_DAYS = 180;

function num(d: unknown): number {
  return d === null || d === undefined ? 0 : Number(d);
}

export default async function MinistryPage() {
  const session = await getServerSession(authOptions);

  const [mps, projects, parkedFunds, alerts, contractors, alertActions, recentPayments, recentProjects] =
    await Promise.all([
      prisma.mp.findMany(),
      prisma.project.findMany({
        include: { district: true, mp: true },
      }),
      prisma.parkedFund.findMany({ include: { district: true } }),
      prisma.alert.findMany({
        include: { project: { include: { district: true } }, contractor: true },
      }),
      prisma.contractor.findMany({ include: { alerts: true } }),
      prisma.alertAction.findMany({
        include: { alert: { include: { project: true } }, dm: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.payment.findMany({
        include: { project: true },
        orderBy: { paidAt: "desc" },
        take: 8,
      }),
      prisma.project.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]);

  // ── KPI strip ──────────────────────────────────────────────────────
  // brain.md §4: MP allocation is the real national figure; the project
  // sanctioned sum is a mixed real+fake prototype set. Both are surfaced,
  // labeled distinctly — never summed together as one "clean" number.
  const realMpAllocationTotal = mps.reduce((sum, mp) => sum + num(mp.allocatedAmount), 0);
  const realMpMissingCount = mps.filter((mp) => mp.allocatedAmount === null).length;

  const monitoredSanctioned = projects.reduce((sum, p) => sum + num(p.sanctionedAmount), 0);
  const monitoredBilled = projects.reduce((sum, p) => sum + num(p.billedAmount), 0);
  const utilizationPct = monitoredSanctioned > 0 ? (monitoredBilled / monitoredSanctioned) * 100 : 0;

  const parkedTotal = parkedFunds.reduce((sum, f) => sum + num(f.amount), 0);

  const flaggedAlertCount = alerts.filter((a) => riskTierFromScore(a.riskScore) === "flagged").length;

  const completedCount = projects.filter((p) => p.status === "completed" || p.status === "citizen_verified" || p.status === "payment_released").length;
  const now = Date.now();
  const delayedCount = projects.filter(
    (p) => p.status === "in_progress" && now - new Date(p.sanctionDate).getTime() > DELAY_THRESHOLD_DAYS * 86_400_000
  ).length;
  const inProgressCount = projects.filter((p) => p.status === "in_progress").length;

  // ── State map + drill-down ────────────────────────────────────────
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

  // ── Trend chart (illustrative — brain.md §4 / prd.md §4.5) ─────────
  // No historical time series exists in the seed data, so this is a
  // plausible synthetic 12-month curve anchored to the real current
  // sanctioned/parked totals, clearly labeled illustrative in the UI.
  const MONTH_LABELS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  const sanctionedCr = monitoredSanctioned / 1e7;
  const parkedCr = parkedTotal / 1e7;
  const trendData: TrendPoint[] = MONTH_LABELS.map((month, i) => {
    const progress = (i + 1) / MONTH_LABELS.length;
    return {
      month,
      sanctioned: Number((sanctionedCr * (0.55 + 0.45 * progress)).toFixed(2)),
      spent: Number((sanctionedCr * (0.55 + 0.45 * progress) * (0.35 + 0.4 * progress)).toFixed(2)),
      parked: Number((parkedCr * (0.6 + 0.5 * Math.sin(progress * 2))).toFixed(2)),
    };
  });

  // ── Alert breakdown (real) ──────────────────────────────────────────
  const alertBreakdown = ALERT_CATEGORIES.map((category) => ({
    category,
    label: ALERT_CATEGORY_LABELS[category],
    count: alerts.filter((a) => a.category === category).length,
  })).filter((d) => d.count > 0);

  // ── Risk rankings ────────────────────────────────────────────────
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

  // Prototype heuristic (brain.md §4 / instructed by brief): rank by the
  // highest linked-alert risk score where one exists; contractors with no
  // alerts fall back to an inverse-Trust-Score proxy (unverified = worst).
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

  // ── Status funnel (real) ────────────────────────────────────────
  const stageCounts: Record<string, number> = {};
  for (const stage of PROJECT_STAGES) stageCounts[stage] = 0;
  for (const p of projects) stageCounts[p.status] = (stageCounts[p.status] ?? 0) + 1;

  // ── Activity feed (real, merged) ────────────────────────────────
  const feed: ActivityItem[] = [
    ...alertActions.map((aa) => ({
      id: `aa-${aa.id}`,
      kind: "alert_action" as const,
      text: `${aa.dm.name} ${aa.decision.replace(/_/g, " ")} an alert${
        aa.alert.project ? ` on "${aa.alert.project.title}"` : ""
      }.`,
      timestamp: aa.createdAt.toISOString(),
    })),
    ...recentPayments.map((p) => ({
      id: `pay-${p.id}`,
      kind: "payment" as const,
      text: `Payment of ₹${(num(p.amount) / 1e5).toLocaleString("en-IN", { maximumFractionDigits: 1 })}L released for "${p.project.title}".`,
      timestamp: p.paidAt.toISOString(),
    })),
    ...recentProjects.map((p) => ({
      id: `proj-${p.id}`,
      kind: "project_created" as const,
      text: `"${p.title}" sanctioned (₹${(num(p.sanctionedAmount) / 1e5).toLocaleString("en-IN", { maximumFractionDigits: 1 })}L).`,
      timestamp: p.createdAt.toISOString(),
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  return (
    <main className="mx-auto max-w-dashboard px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-semibold text-navy-950">Ministry Overview</h1>
          <p className="mt-1 text-sm text-slate-500">
            National MPLADS oversight — {session?.user?.name ?? "Ministry"} view.
          </p>
        </div>
        <p className="text-xs text-slate-400">
          Real MP allocation &amp; project-status data mixed with illustrative trend/alert
          history — see field-level notes below (brain.md §4).
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <KpiStrip
          realMpAllocationTotal={realMpAllocationTotal}
          realMpMissingCount={realMpMissingCount}
          monitoredSanctioned={monitoredSanctioned}
          utilizationPct={utilizationPct}
          parkedTotal={parkedTotal}
          parkedThresholdBreached={parkedTotal > PARKED_THRESHOLD}
          flaggedAlertCount={flaggedAlertCount}
          completedCount={completedCount}
          delayedCount={delayedCount}
          inProgressCount={inProgressCount}
        />

        <IndiaMap stats={stateStats} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TrendChart data={trendData} />
          <AlertBreakdownChart data={alertBreakdown} />
        </div>

        <RiskRankings districts={districtRisk} contractors={contractorRisk} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          <StatusFunnel counts={stageCounts} />
          <ActivityFeed items={feed} />
        </div>
      </div>
    </main>
  );
}
