/**
 * KPI boxes for the Projects tab (changes-1.md §4) — four boxes:
 * (a) completed-vs-incomplete ratio bar, (b) status breakdown, (c) sanctioned
 * vs. paid-out value, (d) open-alert count. All four default to the
 * national figure and recalculate to the selected state once one is chosen
 * (computed by the server-component caller, this is purely presentational).
 * Colors use the locked healthy/watch/flagged tokens (design.md §3.3),
 * never ad hoc hex — completed = healthy, incomplete = flagged.
 */
import { formatRupees } from "@/lib/format";

export function ProjectKpis({
  scopeLabel,
  completedCount,
  inProgressCount,
  incompleteCount,
  totalCount,
  sanctionedTotal,
  paidTotal,
  openAlertCount,
}: {
  scopeLabel: string;
  completedCount: number;
  inProgressCount: number;
  incompleteCount: number;
  totalCount: number;
  sanctionedTotal: number;
  paidTotal: number;
  openAlertCount: number;
}) {
  const notCompleted = inProgressCount + incompleteCount;
  const completedPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const paidPct = sanctionedTotal > 0 ? Math.round((paidTotal / sanctionedTotal) * 100) : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* (a) Completed vs incomplete ratio bar */}
      <div className="rounded-lg border border-ink-950/10 bg-paper-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-950/50">
          Completed vs. Incomplete — {scopeLabel}
        </p>
        <p className="mt-2 font-serif text-2xl text-ink-950">{completedPct}% complete</p>
        <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-ink-950/10">
          <div className="h-full bg-healthy" style={{ width: `${completedPct}%` }} />
          <div className="h-full bg-flagged" style={{ width: `${100 - completedPct}%` }} />
        </div>
        <p className="mt-2 text-xs text-ink-950/50">
          {completedCount} completed · {notCompleted} incomplete
        </p>
      </div>

      {/* (b) Status breakdown */}
      <div className="rounded-lg border border-ink-950/10 bg-paper-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-950/50">
          Total Projects — {scopeLabel}
        </p>
        <p className="mt-2 font-serif text-2xl text-ink-950">{totalCount}</p>
        <ul className="mt-3 flex flex-col gap-1.5 text-xs text-ink-950/60">
          <li className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-healthy" /> Completed
            </span>
            <span className="font-mono tabular-nums">{completedCount}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-watch" /> In Progress
            </span>
            <span className="font-mono tabular-nums">{inProgressCount}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-flagged" /> Incomplete
            </span>
            <span className="font-mono tabular-nums">{incompleteCount}</span>
          </li>
        </ul>
      </div>

      {/* (c) Sanctioned vs paid-out value */}
      <div className="rounded-lg border border-ink-950/10 bg-paper-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-950/50">
          Sanctioned vs. Paid — {scopeLabel}
        </p>
        <p className="mt-2 font-serif text-xl text-ink-950">{formatRupees(sanctionedTotal)}</p>
        <p className="mt-1 text-xs text-ink-950/50">sanctioned</p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink-950/10">
          <div className="h-full bg-indigo-700" style={{ width: `${Math.min(paidPct, 100)}%` }} />
        </div>
        <p className="mt-2 text-xs text-ink-950/50">
          {formatRupees(paidTotal)} paid out ({paidPct}%)
        </p>
      </div>

      {/* (d) Open alert/flag count */}
      <div className="rounded-lg border border-flagged/30 bg-flagged-tint/40 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-950/50">
          Open Alerts — {scopeLabel}
        </p>
        <p className="mt-2 font-serif text-2xl text-flagged">{openAlertCount}</p>
        <p className="mt-1 text-xs text-ink-950/50">projects with an unresolved flag</p>
      </div>
    </div>
  );
}
