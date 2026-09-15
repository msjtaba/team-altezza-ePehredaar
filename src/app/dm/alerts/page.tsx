import { prisma } from "@/lib/prisma";
import { AlertsInboxClient, type InboxAlert } from "@/components/dm/alerts-inbox-client";

/**
 * DM Alerts Inbox (prd.md §4.4.2) — server component: fetch everything the
 * client tabs/filters need in one pass, shape it into a flat, serializable
 * array, and let AlertsInboxClient own all the tab/sub-filter/action-form
 * interactivity. All alert content is sample/hardcoded per prd.md's note
 * that no detection engine is actually built.
 */
export default async function AlertsInboxPage() {
  const [alerts, projects, contractors] = await Promise.all([
    prisma.alert.findMany({
      include: {
        project: { select: { id: true, title: true, milestones: { select: { paymentStatus: true } } } },
        contractor: { select: { id: true, companyName: true } },
        actions: {
          include: { dm: { select: { name: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.findMany({ select: { id: true, title: true }, orderBy: { title: "asc" } }),
    prisma.contractor.findMany({ select: { id: true, companyName: true }, orderBy: { companyName: "asc" } }),
  ]);

  const inboxAlerts: InboxAlert[] = alerts.map((a) => ({
    id: a.id,
    category: a.category,
    type: a.type,
    riskScore: a.riskScore,
    description: a.description,
    status: a.status,
    createdAt: a.createdAt.toISOString(),
    project: a.project ? { id: a.project.id, title: a.project.title } : null,
    contractor: a.contractor ? { id: a.contractor.id, companyName: a.contractor.companyName } : null,
    hasFrozenMilestone: a.project?.milestones.some((m) => m.paymentStatus === "frozen") ?? false,
    actions: a.actions.map((act) => ({
      id: act.id,
      decision: act.decision,
      justificationNote: act.justificationNote,
      createdAt: act.createdAt.toISOString(),
      dmName: act.dm.name,
    })),
  }));

  return (
    <AlertsInboxClient
      alerts={inboxAlerts}
      projects={projects}
      contractors={contractors.map((c) => ({ id: c.id, companyName: c.companyName }))}
    />
  );
}
