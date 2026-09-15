import { PROJECT_STAGES, PROJECT_STAGE_LABELS, type ProjectStage } from "@/lib/enums";

/**
 * The public Status Tracker (prd.md §4.1 / brain.md §3 rule 1) — a visual
 * progression through the 7 project stages, current stage highlighted.
 * This reads `status` directly off the Project row; it never maintains its
 * own copy, so it renders identically wherever a project's stage appears.
 */
export function StatusTracker({ status }: { status: string }) {
  const currentIdx = PROJECT_STAGES.indexOf(status as ProjectStage);

  return (
    <ol className="flex flex-col gap-0 sm:flex-row sm:items-start sm:gap-0">
      {PROJECT_STAGES.map((stage, i) => {
        const done = currentIdx >= 0 && i < currentIdx;
        const current = i === currentIdx;
        return (
          <li key={stage} className="flex flex-1 items-start sm:flex-col">
            <div className="flex flex-col items-center sm:w-full sm:flex-row">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  current
                    ? "bg-marigold-600 text-ink-950"
                    : done
                      ? "bg-teal-700 text-white"
                      : "bg-ink-950/10 text-ink-950/40"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              {i < PROJECT_STAGES.length - 1 && (
                <span
                  className={`mx-0 my-1 w-0.5 flex-1 sm:mx-2 sm:my-0 sm:h-0.5 sm:w-auto ${
                    done ? "bg-teal-700" : "bg-ink-950/10"
                  }`}
                  style={{ minHeight: 16 }}
                  aria-hidden="true"
                />
              )}
            </div>
            <p
              className={`ml-3 pb-4 text-xs font-semibold leading-tight sm:ml-0 sm:mt-2 sm:pb-0 sm:text-center ${
                current ? "text-ink-950" : done ? "text-ink-950/70" : "text-ink-950/40"
              }`}
            >
              {PROJECT_STAGE_LABELS[stage]}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
