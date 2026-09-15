import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Persuade-mode card primitives for the National Overview Dashboard
 * (changes-3.md §1). Forked from src/components/untitled-ui/card.tsx's API
 * shape so the ministry-originated chart components could be re-skinned
 * with minimal prop churn, but the visual language here matches the
 * Persuade card pattern already used on /projects, /mp-allocations, and
 * /jan-pramaan (see project-kpis.tsx / mp-allocations/page.tsx): warm
 * `paper-2` fill, hairline `ink-950/10` border, `rounded-lg`, no shadow on
 * static in-flow cards (design.md §5). This file is dashboard-only — it
 * does not touch src/components/untitled-ui/card.tsx, which /ministry still
 * uses unchanged.
 */
export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-lg border border-ink-950/10 bg-paper-2", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1 border-b border-ink-950/10 px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("font-display text-sm tracking-wide text-ink-950", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs leading-relaxed text-ink-950/50", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function ChartCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {action}
      </CardHeader>
      <CardContent className={cn("pt-3", contentClassName)}>{children}</CardContent>
    </Card>
  );
}

type PillTone = "indigo" | "marigold" | "teal";

const pillTones: Record<PillTone, string> = {
  indigo: "bg-indigo-500/10 text-indigo-700",
  marigold: "bg-marigold-100 text-marigold-600",
  teal: "bg-teal-100 text-teal-700",
};

/** Neutral labeling pill (e.g. "Illustrative", "Real"), Persuade-toned. */
export function DashboardPill({
  tone = "indigo",
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: PillTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        pillTones[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
