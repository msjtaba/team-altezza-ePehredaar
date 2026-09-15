import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";

// Vercel/serverless fix: this page/layout queries Prisma at render time,
// which must never happen during Next's static-generation build step (no
// working DATABASE_URL exists in that build container) — force per-request
// rendering instead.
export const dynamic = "force-dynamic";

const DECISION_LABELS: Record<string, string> = {
  approved_with_justification: "Approved",
  audit_initiated: "Audit Initiated",
  rejected: "Rejected",
  physical_audit_requested: "Physical Audit Requested",
  reminder_sent: "Reminder Sent",
  escalated: "Escalated",
};

function decisionTier(decision: string): "healthy" | "watch" | "flagged" | "stage" {
  if (decision === "approved_with_justification" || decision === "reminder_sent") return "healthy";
  if (decision === "rejected") return "flagged";
  return "watch";
}

/**
 * Approvals/Audit Log (prd.md §4.4.3) — every AlertAction, across every DM
 * (single-DM-jurisdiction scale for this prototype, per the task brief).
 * This is where brain.md §3 rule 3 gets enforced in code: it reads the same
 * AlertAction table the Alerts Inbox writes to, so any decision taken there
 * shows up here immediately, alongside its Project, Alert Type, Decision,
 * Justification, DM name, and Timestamp.
 */
export default async function AuditLogPage() {
  const actions = await prisma.alertAction.findMany({
    include: {
      alert: { include: { project: { select: { id: true, title: true } } } },
      dm: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const resolvedCount = actions.length;
  const auditCount = actions.filter((a) => a.decision === "audit_initiated").length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl tracking-tight text-ink-950">Approvals / Audit Log</h1>
        <p className="mt-1 text-sm text-ink-950/60">
          <span className="font-mono tabular-nums">{resolvedCount}</span> decisions recorded ·{" "}
          <span className="font-mono tabular-nums">{auditCount}</span> under audit.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-ink-950/10 bg-paper-2">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-ink-950/5 text-left text-xs uppercase tracking-wide text-ink-950/50">
            <tr>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Alert Type</th>
              <th className="px-4 py-3">Decision</th>
              <th className="px-4 py-3">Justification</th>
              <th className="px-4 py-3">DM</th>
              <th className="px-4 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-950/10">
            {actions.map((a) => (
              <tr key={a.id} className="hover:bg-ink-950/5">
                <td className="px-4 py-3 font-medium text-ink-950">{a.alert.project?.title ?? "—"}</td>
                <td className="px-4 py-3 text-ink-950/70">{a.alert.type.replace(/_/g, " ")}</td>
                <td className="px-4 py-3">
                  <Badge tier={decisionTier(a.decision)}>{DECISION_LABELS[a.decision] ?? a.decision}</Badge>
                </td>
                <td className="px-4 py-3 max-w-xs text-ink-950/70">{a.justificationNote}</td>
                <td className="px-4 py-3 text-ink-950/70">{a.dm.name}</td>
                <td className="px-4 py-3 font-mono tabular-nums text-ink-950/50">{formatDate(a.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {actions.length === 0 && (
          <p className="p-10 text-center text-sm text-ink-950/40">No decisions recorded yet.</p>
        )}
      </div>
    </div>
  );
}
