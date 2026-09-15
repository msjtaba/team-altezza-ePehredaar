import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";

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
        <h1 className="text-3xl font-semibold text-navy-950">Approvals / Audit Log</h1>
        <p className="mt-1 text-sm text-slate-500">
          <span className="font-mono tabular-nums">{resolvedCount}</span> decisions recorded ·{" "}
          <span className="font-mono tabular-nums">{auditCount}</span> under audit.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Alert Type</th>
              <th className="px-4 py-3">Decision</th>
              <th className="px-4 py-3">Justification</th>
              <th className="px-4 py-3">DM</th>
              <th className="px-4 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {actions.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-navy-950">{a.alert.project?.title ?? "—"}</td>
                <td className="px-4 py-3 text-slate-600">{a.alert.type.replace(/_/g, " ")}</td>
                <td className="px-4 py-3">
                  <Badge tier={decisionTier(a.decision)}>{DECISION_LABELS[a.decision] ?? a.decision}</Badge>
                </td>
                <td className="px-4 py-3 max-w-xs text-slate-600">{a.justificationNote}</td>
                <td className="px-4 py-3 text-slate-600">{a.dm.name}</td>
                <td className="px-4 py-3 font-mono tabular-nums text-slate-500">{formatDate(a.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {actions.length === 0 && (
          <p className="p-10 text-center text-sm text-slate-400">No decisions recorded yet.</p>
        )}
      </div>
    </div>
  );
}
