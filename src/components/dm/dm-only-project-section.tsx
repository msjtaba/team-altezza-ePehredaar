import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { riskTierFromScore } from "@/lib/enums";

const DECISION_LABELS: Record<string, string> = {
  approved_with_justification: "Approved",
  audit_initiated: "Audit Initiated",
  rejected: "Rejected",
  physical_audit_requested: "Physical Audit Requested",
  reminder_sent: "Reminder Sent",
  escalated: "Escalated",
};

/**
 * DM-only section rendered on the public /projects/[id] page (brain.md §3
 * rule 5 — Jan-Pramaan photo-level detail is DM-only, always; this is the
 * one surface allowed to show it). Shows every JanPramaanSubmission's
 * photo/device+server timestamps/GPS deviation/mock-location flag/vote,
 * with the citizen identified only by a short hash prefix — never a real
 * name — plus this project's full alert history (prd.md §4.4.4).
 */
export async function DmOnlyProjectSection({ projectId }: { projectId: string }) {
  const [submissions, alerts] = await Promise.all([
    prisma.janPramaanSubmission.findMany({
      where: { projectId },
      orderBy: { serverTimestamp: "desc" },
    }),
    prisma.alert.findMany({
      where: { projectId },
      include: { actions: { include: { dm: { select: { name: true } } }, orderBy: { createdAt: "asc" } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="mt-14 rounded-lg border border-navy-700/30 bg-navy-50 p-6 font-sans">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-navy-700 px-2.5 py-0.5 text-xs font-semibold text-white">DM Only</span>
        <h2 className="text-lg font-semibold text-navy-950">District Magistrate View</h2>
      </div>

      <section className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-navy-900">
          Jan-Pramaan Submissions ({submissions.length})
        </h3>
        {submissions.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No citizen submissions recorded for this project.</p>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {submissions.map((s) => (
              <div key={s.id} className="rounded-md border border-slate-200 bg-white p-3 text-xs">
                <div className="flex items-center justify-between">
                  <Badge tier={s.vote === "up" ? "healthy" : "flagged"}>{s.vote === "up" ? "👍 Up" : "👎 Down"}</Badge>
                  {s.mockLocationFlag && <Badge tier="flagged">Mock Location</Badge>}
                </div>
                <div className="mt-2 aspect-video overflow-hidden rounded bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.photoUrl} alt="Jan-Pramaan submission" className="h-full w-full object-cover" />
                </div>
                <dl className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-slate-500">
                  <dt>Citizen</dt>
                  <dd className="font-mono text-navy-900">{(s.citizenId ?? "anon").slice(0, 8)}…</dd>
                  <dt>Device time</dt>
                  <dd className="font-mono tabular-nums">{formatDate(s.deviceTimestamp)}</dd>
                  <dt>Server time</dt>
                  <dd className="font-mono tabular-nums">{formatDate(s.serverTimestamp)}</dd>
                  <dt>GPS</dt>
                  <dd className="font-mono tabular-nums">
                    {s.gpsLat.toFixed(4)}, {s.gpsLng.toFixed(4)}
                  </dd>
                  <dt>GPS deviation</dt>
                  <dd className="font-mono tabular-nums">
                    {s.gpsDeviationM !== null ? `${s.gpsDeviationM.toFixed(1)} m` : "—"}
                  </dd>
                  <dt>Photo hash</dt>
                  <dd className="truncate font-mono text-navy-900">{s.photoHash ? `${s.photoHash.slice(0, 10)}…` : "—"}</dd>
                </dl>
                {s.note && <p className="mt-2 border-t border-slate-100 pt-2 text-slate-600">&ldquo;{s.note}&rdquo;</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-navy-900">
          Full Alert History ({alerts.length})
        </h3>
        {alerts.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No alerts recorded for this project.</p>
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
                {a.actions.length > 0 && (
                  <ul className="mt-2 flex flex-col gap-1.5 border-t border-slate-100 pt-2">
                    {a.actions.map((act) => (
                      <li key={act.id} className="text-xs text-slate-500">
                        <span className="font-medium text-navy-900">{DECISION_LABELS[act.decision] ?? act.decision}</span>{" "}
                        by {act.dm.name} on <span className="font-mono tabular-nums">{formatDate(act.createdAt)}</span> —{" "}
                        {act.justificationNote}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
