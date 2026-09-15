import Link from "next/link";
import { WarningCircle, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatRupees, formatDate } from "@/lib/format";
import { riskTierFromScore, type RiskTier } from "@/lib/enums";

// Alert statuses that mean "no longer needs DM attention" (brain.md §3 rule
// 3 — every decision is logged, and a resolved alert carries that log).
const RESOLVED_STATUSES = new Set(["approved", "rejected"]);

/**
 * DM Overview (prd.md §4.4.1) — stat cards, risk heatmap, 10-event activity
 * feed, quick-jump CTA to high-priority alerts. Judgment call on scoping:
 * only 1 of 10 seeded projects sits in the DM's own district (Pune), so
 * restricting Overview to district-only would produce an emptied-out
 * cockpit for this prototype's scale — per the task brief's explicit
 * allowance, Overview shows all projects/alerts district-wide is noted in
 * the final report, not hard-filtered here.
 */
export default async function DmOverviewPage() {
  const [projects, alerts, parkedFunds, payments, recentActions, recentSubmissions] = await Promise.all([
    prisma.project.findMany({
      include: {
        alerts: { where: { status: { notIn: ["approved", "rejected"] } } },
      },
    }),
    prisma.alert.findMany({
      include: { project: { select: { id: true, title: true } }, actions: true },
    }),
    prisma.parkedFund.findMany(),
    prisma.payment.findMany(),
    prisma.alertAction.findMany({
      include: { alert: { include: { project: { select: { title: true } } } }, dm: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.janPramaanSubmission.findMany({
      include: { project: { select: { title: true } } },
      orderBy: { serverTimestamp: "desc" },
      take: 10,
    }),
  ]);

  const activeProjects = projects.filter(
    (p) => !["completed", "citizen_verified", "payment_released"].includes(p.status)
  );
  const completedProjects = projects.filter((p) =>
    ["completed", "citizen_verified", "payment_released"].includes(p.status)
  );

  const totalSanctioned = projects.reduce((s, p) => s + Number(p.sanctionedAmount.toString()), 0);
  const totalUtilized = projects.reduce((s, p) => s + Number(p.billedAmount.toString()), 0);
  const totalParked = parkedFunds.reduce((s, f) => s + Number(f.amount.toString()), 0);

  const openAlerts = alerts.filter((a) => !RESOLVED_STATUSES.has(a.status));
  const pendingApprovals = openAlerts.filter((a) => a.actions.length === 0);
  const highPriorityAlerts = openAlerts.filter((a) => riskTierFromScore(a.riskScore) === "flagged");

  // Risk heatmap: each project categorized by the highest riskScore among
  // its own unresolved alerts, or "healthy" if it has none (brain.md §3
  // rule 2 — the locked 3-tier triad, never a 4th tier).
  const heatmap = projects
    .map((p) => {
      const maxRisk = p.alerts.reduce((max, a) => Math.max(max, a.riskScore), 0);
      const tier: RiskTier = p.alerts.length > 0 ? riskTierFromScore(maxRisk) : "healthy";
      return { id: p.id, title: p.title, tier, maxRisk };
    })
    .sort((a, b) => b.maxRisk - a.maxRisk);

  // Merge + sort last-10 activity feed (read-only).
  type Event = { id: string; label: string; detail: string; at: Date };
  const actionEvents: Event[] = recentActions.map((a) => ({
    id: `action-${a.id}`,
    label: `${a.dm.name} — ${a.decision.replace(/_/g, " ")}`,
    detail: a.alert.project?.title ?? "Fund/timeline alert",
    at: a.createdAt,
  }));
  const paymentEvents: Event[] = payments
    .slice()
    .sort((a, b) => b.paidAt.getTime() - a.paidAt.getTime())
    .slice(0, 10)
    .map((p) => ({
      id: `payment-${p.id}`,
      label: `Payment ${p.status === "success" ? "released" : p.status}`,
      detail: formatRupees(p.amount.toString()),
      at: p.paidAt,
    }));
  const submissionEvents: Event[] = recentSubmissions.map((s) => ({
    id: `jp-${s.id}`,
    label: `Jan-Pramaan submission (${s.vote === "up" ? "👍" : "👎"})`,
    detail: s.project.title,
    at: s.serverTimestamp,
  }));

  const activityFeed = [...actionEvents, ...paymentEvents, ...submissionEvents]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 10);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold text-navy-950">Overview</h1>
        <p className="mt-1 text-sm text-slate-500">Jurisdiction-wide status across all monitored projects.</p>
      </div>

      {highPriorityAlerts.length > 0 && (
        <Link
          href="/dm/alerts"
          className="flex items-center justify-between gap-4 rounded-lg border border-flagged bg-flagged-tint px-6 py-4 transition-colors duration-150 hover:bg-red-100"
        >
          <div className="flex items-center gap-3">
            <WarningCircle size={22} weight="fill" className="text-flagged" />
            <p className="text-sm font-semibold text-flagged">
              <span className="font-mono tabular-nums">{highPriorityAlerts.length}</span> high-priority
              {highPriorityAlerts.length === 1 ? " alert needs" : " alerts need"} action
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-flagged">
            Go to Alerts Inbox <ArrowRight size={16} weight="bold" />
          </span>
        </Link>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Active Projects" value={activeProjects.length} />
        <StatCard label="Completed Projects" value={completedProjects.length} />
        <StatCard label="Funds Sanctioned" value={formatRupees(totalSanctioned)} money />
        <StatCard label="Funds Utilized" value={formatRupees(totalUtilized)} money />
        <StatCard label="Funds Parked" value={formatRupees(totalParked)} money />
        <StatCard label="Open Alerts" value={openAlerts.length} />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Pending Approvals" value={pendingApprovals.length} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3 rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-navy-950">Project Risk Heatmap</h2>
          <p className="mt-1 text-xs text-slate-500">Categorized by the highest open-alert risk tier per project.</p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {heatmap.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className={`rounded-md border px-3 py-3 text-xs transition-colors duration-150 ${tileTone(p.tier)}`}
              >
                <p className="font-semibold leading-snug line-clamp-2">{p.title}</p>
                <div className="mt-2 flex items-center justify-between">
                  <Badge tier={p.tier}>{p.tier}</Badge>
                  {p.maxRisk > 0 && <span className="font-mono tabular-nums">{p.maxRisk}%</span>}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-navy-950">Recent Activity</h2>
          <p className="mt-1 text-xs text-slate-500">Last 10 events, read-only.</p>
          <ul className="mt-4 flex flex-col divide-y divide-slate-100">
            {activityFeed.length === 0 && <li className="py-4 text-sm text-slate-400">No activity yet.</li>}
            {activityFeed.map((e) => (
              <li key={e.id} className="flex items-start justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-medium text-navy-950">{e.label}</p>
                  <p className="text-xs text-slate-500">{e.detail}</p>
                </div>
                <span className="whitespace-nowrap font-mono text-xs tabular-nums text-slate-400">
                  {formatDate(e.at)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function tileTone(tier: RiskTier) {
  if (tier === "flagged") return "border-flagged/30 bg-flagged-tint hover:bg-red-100";
  if (tier === "watch") return "border-watch/30 bg-watch-tint hover:bg-amber-100";
  return "border-healthy/30 bg-healthy-tint hover:bg-green-100";
}

function StatCard({ label, value, money }: { label: string; value: string | number; money?: boolean }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1.5 text-xl font-semibold text-navy-950 ${money ? "font-mono tabular-nums" : "font-mono tabular-nums"}`}>
        {value}
      </p>
    </div>
  );
}
