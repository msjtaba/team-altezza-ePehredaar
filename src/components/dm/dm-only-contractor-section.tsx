import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { riskTierFromScore } from "@/lib/enums";

/**
 * DM-only section rendered on the public /contractors/[id] page (prd.md
 * §4.4.5) — flag history (every Alert where contractorId matches) and, when
 * this contractor has any CollusionEdge rows, a link into the collusion
 * graph (task 6), anchored to the project that scenario is tied to.
 */
export async function DmOnlyContractorSection({ contractorId }: { contractorId: string }) {
  const [alerts, edgesAsA, edgesAsB] = await Promise.all([
    prisma.alert.findMany({
      where: { contractorId },
      include: { project: { select: { id: true, title: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.collusionEdge.findMany({ where: { contractorAId: contractorId }, include: { project: true } }),
    prisma.collusionEdge.findMany({ where: { contractorBId: contractorId }, include: { project: true } }),
  ]);

  const collusionProjectId = edgesAsA[0]?.projectId ?? edgesAsB[0]?.projectId ?? null;
  const collusionProjectTitle = edgesAsA[0]?.project.title ?? edgesAsB[0]?.project.title ?? null;

  return (
    <div className="mt-14 rounded-lg border border-navy-700/30 bg-navy-50 p-6 font-sans">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-navy-700 px-2.5 py-0.5 text-xs font-semibold text-white">DM Only</span>
        <h2 className="text-lg font-semibold text-navy-950">District Magistrate View</h2>
      </div>

      {collusionProjectId && (
        <div className="mt-4 rounded-md border border-flagged/40 bg-flagged-tint p-4">
          <p className="text-sm font-semibold text-flagged">Collusion/cartel scenario flagged</p>
          <p className="mt-1 text-xs text-flagged/90">
            This contractor shares identity/contact metadata with other bidders on {collusionProjectTitle}.
          </p>
          <Link
            href={`/dm/audit/collusion/${collusionProjectId}`}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-flagged hover:underline"
          >
            View collusion graph →
          </Link>
        </div>
      )}

      <section className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-navy-900">
          Flag History ({alerts.length})
        </h3>
        {alerts.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No alerts recorded against this contractor.</p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {alerts.map((a) => (
              <div key={a.id} className="rounded-md border border-slate-200 bg-white p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tier={riskTierFromScore(a.riskScore)}>
                    <span className="font-mono tabular-nums">{a.riskScore}%</span> risk
                  </Badge>
                  <Badge tier="stage">{a.type.replace(/_/g, " ")}</Badge>
                  <span className="font-mono text-xs tabular-nums text-slate-400">{formatDate(a.createdAt)}</span>
                </div>
                <p className="mt-1.5 text-slate-700">{a.description}</p>
                {a.project && (
                  <Link href={`/projects/${a.project.id}`} className="mt-1 inline-block text-xs text-navy-700 hover:underline">
                    {a.project.title}
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
