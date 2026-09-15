import { prisma } from "@/lib/prisma";
import { ProjectsTableClient } from "@/components/dm/projects-table-client";
import { riskTierFromScore } from "@/lib/enums";

// Vercel/serverless fix: this page/layout queries Prisma at render time,
// which must never happen during Next's static-generation build step (no
// working DATABASE_URL exists in that build container) — force per-request
// rendering instead.
export const dynamic = "force-dynamic";

/**
 * DM Projects tab (prd.md §4.4.4) — all projects, filterable by status and
 * risk level, each linking through to /projects/[id] which now renders its
 * DM-only sections since this is an authenticated DM session.
 */
export default async function DmProjectsPage() {
  const projects = await prisma.project.findMany({
    include: {
      district: true,
      assignedContractor: { select: { companyName: true } },
      alerts: { where: { status: { notIn: ["approved", "rejected"] } } },
    },
    orderBy: { title: "asc" },
  });

  const rows = projects.map((p) => {
    const maxRisk = p.alerts.reduce((max, a) => Math.max(max, a.riskScore), 0);
    return {
      id: p.id,
      title: p.title,
      status: p.status,
      district: `${p.district.name}, ${p.district.state}`,
      contractor: p.assignedContractor?.companyName ?? null,
      sanctionedAmount: p.sanctionedAmount.toString(),
      riskTier: p.alerts.length > 0 ? riskTierFromScore(maxRisk) : ("healthy" as const),
      riskScore: maxRisk,
      openAlertCount: p.alerts.length,
    };
  });

  return <ProjectsTableClient rows={rows} />;
}
