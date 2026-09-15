import { PROJECT_STAGES, PROJECT_STAGE_LABELS } from "@/lib/enums";
import { ChartCard, DashboardPill } from "@/components/national-dashboard/dashboard-card";

/**
 * Persuade-mode fork of src/components/ministry/StatusFunnel.tsx — marigold
 * fill instead of the Untitled UI brand scale, matching the primary-action
 * accent used elsewhere on /projects and /mp-allocations.
 */
export function DashboardStatusFunnel({ counts }: { counts: Record<string, number> }) {
  const max = Math.max(1, ...PROJECT_STAGES.map((s) => counts[s] ?? 0));
  const total = PROJECT_STAGES.reduce((sum, s) => sum + (counts[s] ?? 0), 0);

  return (
    <ChartCard
      title="Project Status Funnel"
      description={`Counts across all ${total} monitored projects by current lifecycle stage.`}
      action={<DashboardPill tone="teal">Real</DashboardPill>}
    >
      <div className="flex flex-col gap-2.5">
        {PROJECT_STAGES.map((stage) => {
          const count = counts[stage] ?? 0;
          const widthPct = Math.max(6, (count / max) * 100);
          return (
            <div key={stage} className="flex items-center gap-3">
              <span className="w-32 shrink-0 text-xs text-ink-950/60">
                {PROJECT_STAGE_LABELS[stage]}
              </span>
              <div className="h-6 flex-1 rounded-md bg-ink-950/5">
                <div
                  className="flex h-6 items-center justify-end rounded-md bg-marigold-600 px-2"
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
