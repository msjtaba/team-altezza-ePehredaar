import { PROJECT_STAGES, PROJECT_STAGE_LABELS } from "@/lib/enums";

export function StatusFunnel({ counts }: { counts: Record<string, number> }) {
  const max = Math.max(1, ...PROJECT_STAGES.map((s) => counts[s] ?? 0));

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-navy-950">Project Status Funnel</h3>
      <p className="mt-1 text-xs text-slate-500">
        Real — counts across all 10 monitored projects by current lifecycle stage.
      </p>
      <div className="mt-4 flex flex-col gap-2.5">
        {PROJECT_STAGES.map((stage) => {
          const count = counts[stage] ?? 0;
          const widthPct = Math.max(6, (count / max) * 100);
          return (
            <div key={stage} className="flex items-center gap-3">
              <span className="w-32 shrink-0 text-xs text-slate-600">
                {PROJECT_STAGE_LABELS[stage]}
              </span>
              <div className="h-6 flex-1 rounded-md bg-slate-100">
                <div
                  className="flex h-6 items-center justify-end rounded-md bg-navy-700 px-2"
                  style={{ width: `${widthPct}%` }}
                >
                  <span className="font-mono tabular-nums text-xs font-semibold text-white">
                    {count}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
