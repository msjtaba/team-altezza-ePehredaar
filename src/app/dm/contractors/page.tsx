import { prisma } from "@/lib/prisma";
import { ContractorsTableClient } from "@/components/dm/contractors-table-client";

/**
 * DM Contractors tab (prd.md §4.4.5) — sortable by Trust Score, each linking
 * through to /contractors/[id] which now renders DM-only flag history +
 * collusion-graph link since this is an authenticated DM session.
 */
export default async function DmContractorsPage() {
  const contractors = await prisma.contractor.findMany({
    include: {
      alerts: true,
      projects: { select: { id: true } },
      edgesAsA: true,
      edgesAsB: true,
    },
    orderBy: { companyName: "asc" },
  });

  const rows = contractors.map((c) => ({
    id: c.id,
    companyName: c.companyName,
    kycStatus: c.kycStatus,
    trustScore: c.trustScore ? Number(c.trustScore.toString()) : null,
    projectCount: c.projects.length,
    openAlertCount: c.alerts.filter((a) => !["approved", "rejected"].includes(a.status)).length,
    hasCollusionFlag: c.edgesAsA.length + c.edgesAsB.length > 0,
  }));

  return <ContractorsTableClient rows={rows} />;
}
