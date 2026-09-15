import { PROJECT_STAGES, PROJECT_STAGE_LABELS } from "@/lib/enums";
import { ChartCard } from "@/components/untitled-ui/chart-card";
import { UuiBadge } from "@/components/untitled-ui/badge";

export function StatusFunnel({ counts }: { counts: Record<string, number> }) {
  const max = Math.max(1, ...PROJECT_STAGES.map((s) => counts[s] ?? 0));

  return (
    <ChartCard
      title="Project Status Funnel"
      description="Counts across all 10 monitored projects by current lifecycle stage."
      action={<UuiBadge color="brand">Real</UuiBadge>}
    >
      <div className="flex flex-col gap-2.5">
        {PROJECT_STAGES.map((stage) => {
          const count = counts[stage] ?? 0;
          const widthPct = Math.max(6, (count / max) * 100);
          return (
            <div key={stage} className="flex items-center gap-3">
              <span className="w-32 shrink-0 text-xs text-slate-600 dark:text-slate-400">
                {PROJECT_STAGE_LABELS[stage]}
              </span>
              <div className="h-6 flex-1 rounded-md bg-slate-100 dark:bg-slate-800">
                <div
                  className="flex h-6 items-center justify-end rounded-md bg-brand-600 px-2"
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
    </ChartCard>
  );
}
