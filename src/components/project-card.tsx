import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatRupees } from "@/lib/format";
import { PROJECT_CATEGORY_LABELS, PROJECT_STAGE_LABELS, isStageCompletedOrLater, type ProjectCategory, type ProjectStage } from "@/lib/enums";

type ProjectCardData = {
  id: string;
  title: string;
  category: string;
  status: string;
  sanctionedAmount: number | string;
  mp: { name: string };
  district: { name: string; state: string };
};

/**
 * data.md §2's interaction rule, applied to every project card (not just the
 * 4 real examples): a project that has reached "completed" or later opens
 * through to the detail page with its payment timeline. Anything earlier
 * renders as an inert card — no link, no click-through — per brain.md §4.
 */
export function ProjectCard({ project }: { project: ProjectCardData }) {
  const clickable = isStageCompletedOrLater(project.status);
  const categoryLabel = PROJECT_CATEGORY_LABELS[project.category as ProjectCategory] ?? project.category;
  const stageLabel = PROJECT_STAGE_LABELS[project.status as ProjectStage] ?? project.status;

  const body = (
    <div
      className={`h-full rounded-lg border border-ink-950/10 bg-paper-2 p-6 transition-all duration-[250ms] ${
        clickable ? "hover:-translate-y-1 hover:border-marigold-600 hover:shadow-lg hover:shadow-ink-950/5" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <Badge tier="stage">{stageLabel}</Badge>
        <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-teal-700">
          {categoryLabel}
        </span>
      </div>
      <h3 className="mt-3 line-clamp-3 font-display text-lg leading-snug tracking-wide text-ink-950">
        {project.title.toUpperCase()}
      </h3>
      <p className="mt-2 text-sm text-ink-950/60">
        {project.district.name}, {project.district.state}
      </p>
      <div className="mt-4 flex items-end justify-between border-t border-ink-950/10 pt-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-950/40">Sanctioned</p>
          <p className="font-serif text-lg text-ink-950">{formatRupees(project.sanctionedAmount)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-ink-950/40">MP</p>
          <p className="text-sm font-semibold text-ink-950/80">{project.mp.name}</p>
        </div>
      </div>
      {!clickable && (
        <p className="mt-3 text-xs text-ink-950/40">
          Full payment timeline unlocks once this project is marked complete.
        </p>
      )}
    </div>
  );

  if (!clickable) {
    return <div className="cursor-default">{body}</div>;
  }

  return (
    <Link href={`/projects/${project.id}`} className="block h-full">
      {body}
    </Link>
  );
}
