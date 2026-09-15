import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { CollusionGraph, type CollusionNode, type CollusionEdgeView } from "@/components/dm/collusion-graph";
import { COLLUSION_SHARED_ATTRIBUTES } from "@/lib/enums";

const ATTRIBUTE_LABELS: Record<(typeof COLLUSION_SHARED_ATTRIBUTES)[number], string> = {
  phone_number: "shared registered phone number",
  pan_prefix: "shared PAN prefix",
  registered_address: "shared registered address",
};

/**
 * Cartel/Collusion Graph (prd.md §4.6) — the one hardcoded scenario, anchored
 * to a real project. `[id]` is that project's id. Reached ONLY by clicking
 * the seeded cartel_collusion alert in the Alerts Inbox — deliberately not
 * in the DM main nav (brain.md §7 / prd.md §4.6: never a standalone or
 * explorable feature). Custom hand-rolled SVG per trd.md — not a graph
 * library.
 */
export default async function CollusionGraphPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  const edges = await prisma.collusionEdge.findMany({
    where: { projectId: id },
    include: { contractorA: true, contractorB: true },
  });

  if (edges.length === 0) notFound();

  const nodeMap = new Map<string, CollusionNode>();
  for (const e of edges) {
    for (const c of [e.contractorA, e.contractorB]) {
      if (!nodeMap.has(c.id)) {
        nodeMap.set(c.id, { id: c.id, name: c.companyName, connectionCount: 0 });
      }
    }
  }
  for (const e of edges) {
    nodeMap.get(e.contractorAId)!.connectionCount += 1;
    nodeMap.get(e.contractorBId)!.connectionCount += 1;
  }

  const nodes = Array.from(nodeMap.values());
  const edgeViews: CollusionEdgeView[] = edges.map((e) => ({
    id: e.id,
    source: e.contractorAId,
    target: e.contractorBId,
    label: ATTRIBUTE_LABELS[e.sharedAttribute as (typeof COLLUSION_SHARED_ATTRIBUTES)[number]] ?? e.sharedAttribute,
  }));

  const mostConnected = nodes.slice().sort((a, b) => b.connectionCount - a.connectionCount)[0];

  return (
    <div className="flex flex-col gap-6">
      <Link href="/dm/alerts" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-navy-700">
        <ArrowLeft size={16} weight="bold" />
        Back to Alerts Inbox
      </Link>

      <div>
        <h1 className="text-3xl font-semibold text-navy-950">Collusion / Cartel Graph</h1>
        <p className="mt-1 text-sm text-slate-500">
          Project: <Link href={`/projects/${project.id}`} className="text-navy-700 hover:underline">{project.title}</Link>
        </p>
      </div>

      <div className="rounded-lg border border-flagged/40 bg-flagged-tint p-5">
        <p className="text-sm font-semibold text-flagged">Collusion risk flagged for review</p>
        <p className="mt-1.5 text-sm text-flagged/90">
          {nodes.length} bidders on this project share identity or contact metadata across {edgeViews.length} separate
          link{edgeViews.length === 1 ? "" : "s"} —{" "}
          {mostConnected && (
            <>
              <span className="font-semibold">{mostConnected.name}</span> is the most connected, linked to{" "}
              {mostConnected.connectionCount} other bidder{mostConnected.connectionCount === 1 ? "" : "s"} on this
              project.
            </>
          )}{" "}
          This is a pattern consistent with bid-rigging and warrants procurement audit, not a confirmed finding.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <CollusionGraph nodes={nodes} edges={edgeViews} projectTitle={project.title} />
      </div>
    </div>
  );
}
