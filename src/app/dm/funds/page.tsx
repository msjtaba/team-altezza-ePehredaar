import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatRupees, formatDate } from "@/lib/format";
import { FundSankey, type SankeyLink, type SankeyNode } from "@/components/dm/fund-sankey";

// Vercel/serverless fix: this page/layout queries Prisma at render time,
// which must never happen during Next's static-generation build step (no
// working DATABASE_URL exists in that build container) — force per-request
// rendering instead.
export const dynamic = "force-dynamic";

/**
 * Fund Tracker (prd.md §4.4.6) — Ministry→State→District→Contractor Sankey
 * built from seeded FundFlow rows, plus the parked-funds aging table.
 *
 * Judgment call: the seed data (prisma/seed.ts) only populates the
 * ministry→state and state→district legs of FundFlow — there is no
 * district→contractor FundFlow row seeded. Rather than edit the seed
 * (which Phases 1-4 already build on top of), the final district→contractor
 * leg is derived here, display-only, from each project's assigned
 * contractor and its billedAmount — the same field the public project page
 * already surfaces as "money actually spent so far." This keeps the diagram
 * honest to real seeded figures without inventing a new data source.
 */
export default async function FundTrackerPage() {
  const [fundFlows, projects, parkedFunds] = await Promise.all([
    prisma.fundFlow.findMany(),
    prisma.project.findMany({
      include: { assignedContractor: { select: { companyName: true } } },
    }),
    prisma.parkedFund.findMany({ include: { district: true }, orderBy: { parkedSince: "asc" } }),
  ]);

  const ministryToState = fundFlows
    .filter((f) => f.fromEntity === "ministry" && f.toEntity === "state")
    .reduce((s, f) => s + Number(f.amount.toString()), 0);
  const stateToDistrict = fundFlows
    .filter((f) => f.fromEntity === "state" && f.toEntity === "district")
    .reduce((s, f) => s + Number(f.amount.toString()), 0);

  const contractorTotals = new Map<string, number>();
  for (const p of projects) {
    const billed = Number(p.billedAmount.toString());
    if (p.assignedContractor && billed > 0) {
      const name = p.assignedContractor.companyName;
      contractorTotals.set(name, (contractorTotals.get(name) ?? 0) + billed);
    }
  }

  const nodes: SankeyNode[] = [
    { id: "Ministry" },
    { id: "State" },
    { id: "District" },
    ...Array.from(contractorTotals.keys()).map((id) => ({ id })),
  ];
  const links: SankeyLink[] = [
    { source: "Ministry", target: "State", value: Math.round(ministryToState) || 1 },
    { source: "State", target: "District", value: Math.round(stateToDistrict) || 1 },
    ...Array.from(contractorTotals.entries()).map(([id, value]) => ({
      source: "District",
      target: id,
      value: Math.round(value) || 1,
    })),
  ];

  const now = Date.now();
  const dayMs = 1000 * 60 * 60 * 24;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl tracking-tight text-ink-950">Fund Tracker</h1>
        <p className="mt-1 text-sm text-ink-950/60">Ministry → State → District → Contractor fund flow.</p>
      </div>

      <div className="rounded-lg border border-ink-950/10 bg-paper-2 p-5">
        {links.length > 2 ? (
          <FundSankey nodes={nodes} links={links} />
        ) : (
          <p className="p-10 text-center text-sm text-ink-950/40">No fund flow data to visualize.</p>
        )}
      </div>

      <section>
        <h2 className="font-display text-sm tracking-wide text-ink-950">Parked Funds — Aging Report</h2>
        <p className="mt-1 text-xs text-ink-950/50">Sanctioned money that has sat unspent, by district.</p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-ink-950/10 bg-paper-2">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-ink-950/5 text-left text-xs uppercase tracking-wide text-ink-950/50">
              <tr>
                <th className="px-4 py-3">District</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Parked Since</th>
                <th className="px-4 py-3">Days Idle</th>
                <th className="px-4 py-3">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-950/10">
              {parkedFunds.map((f) => {
                const days = Math.floor((now - f.parkedSince.getTime()) / dayMs);
                const tier = days >= 180 ? "flagged" : days >= 90 ? "watch" : "healthy";
                return (
                  <tr key={f.id} className="hover:bg-ink-950/5">
                    <td className="px-4 py-3 font-medium text-ink-950">
                      {f.district.name}, {f.district.state}
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums text-ink-950/80">
                      {formatRupees(f.amount.toString())}
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums text-ink-950/50">{formatDate(f.parkedSince)}</td>
                    <td className="px-4 py-3">
                      <Badge tier={tier}>
                        <span className="font-mono tabular-nums">{days}</span> days
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-ink-950/70">{f.reason ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {parkedFunds.length === 0 && (
            <p className="p-10 text-center text-sm text-ink-950/40">No parked funds recorded.</p>
          )}
        </div>
      </section>
    </div>
  );
}
