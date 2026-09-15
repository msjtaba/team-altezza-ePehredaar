"use client";

import { useEffect } from "react";
import { X } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import { SatelliteMap } from "@/components/satellite-map";
import { formatRupees, formatLakhShort, formatDate } from "@/lib/format";
import { PROJECT_CATEGORY_LABELS, PROJECT_STAGE_LABELS, type ProjectCategory, type ProjectStage } from "@/lib/enums";

export type DrawerProject = {
  id: string;
  title: string;
  category: string;
  status: string;
  sanctionedAmount: number | string;
  mp: { name: string };
  district: { name: string; state: string };
  contractorName: string | null;
  latitude: number | null;
  longitude: number | null;
  payments: { id: string; amount: number | string; paidAt: string; status: string }[];
};

/**
 * changes-1.md §4: completed-project click opens this side drawer instead
 * of a full page navigation, with a subtle entrance animation (CSS
 * transition, reduced-motion respected globally via globals.css). Slides
 * from the right on desktop, from the bottom on mobile so it's usable down
 * to ~375px width. `/projects/[id]` stays a real route for direct linking —
 * this drawer is purely an in-page affordance on the listing.
 */
export function ProjectDrawer({
  project,
  onClose,
}: {
  project: DrawerProject | null;
  onClose: () => void;
}) {
  const open = project !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const categoryLabel = project
    ? PROJECT_CATEGORY_LABELS[project.category as ProjectCategory] ?? project.category
    : "";
  const stageLabel = project
    ? PROJECT_STAGE_LABELS[project.status as ProjectStage] ?? project.status
    : "";
  const totalPaid =
    project?.payments.reduce((s, p) => s + Number(p.amount.toString()), 0) ?? 0;

  return (
    <div
      className={`fixed inset-0 z-[90] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-ink-950/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel — slides from bottom on mobile, from the right from sm up */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={project ? project.title : "Project details"}
        className={`absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col overflow-y-auto rounded-t-lg border-t border-ink-950/10 bg-paper shadow-xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:inset-y-0 sm:inset-x-auto sm:right-0 sm:max-h-none sm:w-full sm:max-w-md sm:rounded-t-none sm:rounded-l-lg sm:border-l sm:border-t-0 ${
          open
            ? "translate-y-0 sm:translate-x-0"
            : "translate-y-full sm:translate-y-0 sm:translate-x-full"
        }`}
      >
        {project && (
          <div className="flex flex-col p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tier="stage">{stageLabel}</Badge>
                <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                  {categoryLabel}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="shrink-0 rounded-md p-1.5 text-ink-950/50 transition-colors hover:bg-ink-950/5 hover:text-ink-950"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            <h2 className="mt-4 font-display text-2xl leading-tight tracking-wide text-ink-950">
              {project.title}
            </h2>

            <div className="mt-6 grid grid-cols-2 gap-5 rounded-lg border border-ink-950/10 bg-paper-2 p-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-950/40">Sanctioned Cost</p>
                <p className="mt-1 font-serif text-lg text-ink-950">
                  {formatRupees(project.sanctionedAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-950/40">MP</p>
                <p className="mt-1 text-sm font-semibold text-ink-950">{project.mp.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-950/40">Constituency</p>
                <p className="mt-1 text-sm font-semibold text-ink-950">
                  {project.district.name}, {project.district.state}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-950/40">Contractor</p>
                <p className="mt-1 text-sm font-semibold text-ink-950">
                  {project.contractorName ?? "Not yet assigned"}
                </p>
              </div>
            </div>

            <section className="mt-6">
              <h3 className="font-display text-base tracking-wide text-ink-950">
                PAYMENT TIMELINE
              </h3>
              <div className="mt-3 rounded-lg border border-ink-950/10 bg-paper-2 p-4">
                <div className="flex flex-wrap gap-6 border-b border-ink-950/10 pb-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink-950/40">Installments</p>
                    <p className="mt-0.5 font-serif text-lg text-ink-950">{project.payments.length}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink-950/40">Total Paid</p>
                    <p className="mt-0.5 font-serif text-lg text-ink-950">
                      {formatLakhShort(totalPaid)}
                    </p>
                  </div>
                </div>
                {project.payments.length === 0 ? (
                  <p className="mt-3 text-sm text-ink-950/50">No payments recorded yet.</p>
                ) : (
                  <ul className="mt-3 flex flex-col gap-2">
                    {project.payments.map((p) => (
                      <li
                        key={p.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-paper px-3 py-2 text-sm"
                      >
                        <span className="font-semibold text-ink-950">{formatDate(p.paidAt)}</span>
                        <span className="text-ink-950/70">{formatRupees(p.amount)}</span>
                        <Badge tier={p.status === "success" ? "healthy" : p.status === "failed" ? "flagged" : "watch"}>
                          {p.status === "success" ? "Success" : p.status === "failed" ? "Failed" : "Pending"}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            <section className="mt-6">
              <h3 className="font-display text-base tracking-wide text-ink-950">
                SATELLITE VIEW
              </h3>
              <div className="mt-3">
                {project.latitude !== null && project.longitude !== null ? (
                  <SatelliteMap lat={project.latitude} lng={project.longitude} height={220} />
                ) : (
                  <div className="rounded-lg border border-dashed border-ink-950/15 bg-paper-2 p-8 text-center text-sm text-ink-950/50">
                    No location on file for this project.
                  </div>
                )}
              </div>
            </section>

            <a
              href={`/projects/${project.id}`}
              className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-indigo-700 underline-offset-2 hover:underline"
            >
              Open full project page →
            </a>
          </div>
        )}
      </aside>
    </div>
  );
}
