import { type ReactNode } from "react";

// design.md §3.3 — locked three-tier risk system, plus a neutral "stage"
// variant for project-status chips. Never mix these two families on one
// card (brain.md §3 rule 2 / design.md §8).
type Tier = "healthy" | "watch" | "flagged" | "stage";

const tiers: Record<Tier, string> = {
  healthy: "bg-healthy-tint text-healthy",
  watch: "bg-watch-tint text-watch",
  flagged: "bg-flagged-tint text-flagged",
  // Neutral stage chip — ink-based so it reads correctly on Persuade's
  // paper background; Operate dashboards may restyle to navy-100/700 in
  // their own context once built (design.md §1.1 keeps that system separate).
  stage: "bg-ink-950/8 text-ink-950",
};

export function Badge({
  tier,
  children,
}: {
  tier: Tier;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${tiers[tier]}`}
    >
      {children}
    </span>
  );
}
