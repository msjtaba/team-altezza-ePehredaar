import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

// Untitled UI React badge/pill pattern. Distinct from the locked
// healthy/watch/flagged risk-tier `Badge` in src/components/ui/badge.tsx
// (design.md §3.3 — that three-tier semantic system stays exactly as-is);
// this is the general-purpose "gray/brand/success/warning/error" pill used
// for neutral labeling (stage chips, counts, filters) on the Untitled
// UI-pattern surfaces (Ministry Overview, Collusion page chrome).
type Color = "gray" | "brand" | "success" | "warning" | "error";

const colors: Record<Color, string> = {
  gray: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  brand: "bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-300",
  success: "bg-healthy-tint text-healthy dark:bg-healthy/15 dark:text-healthy",
  warning: "bg-watch-tint text-watch dark:bg-watch/15 dark:text-watch",
  error: "bg-flagged-tint text-flagged dark:bg-flagged/15 dark:text-flagged",
};

export function UuiBadge({
  color = "gray",
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { color?: Color }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        colors[color],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
