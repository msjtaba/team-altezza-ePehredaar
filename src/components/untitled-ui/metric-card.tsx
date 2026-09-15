import type { ReactNode } from "react";
import { TrendUp, TrendDown } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/cn";
import { Card } from "./card";

// Untitled UI React metric/stat card pattern (changes-2.md §2): a card with
// a label, a large figure, and a small trend indicator (up/down arrow + %)
// where applicable — the baseline for the Ministry Overview KPI strip.
export function MetricCard({
  label,
  value,
  sub,
  trend,
  trendLabel,
  tone = "default",
  icon,
  interactive,
  className,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down";
  trendLabel?: string;
  tone?: "default" | "success" | "warning" | "error";
  icon?: ReactNode;
  interactive?: boolean;
  className?: string;
}) {
  const toneClasses: Record<string, string> = {
    default: "",
    success: "border-healthy/30 bg-healthy-tint/40 dark:bg-healthy/10",
    warning: "border-watch/30 bg-watch-tint/40 dark:bg-watch/10",
    error: "border-flagged/30 bg-flagged-tint/40 dark:bg-flagged/10",
  };

  return (
    <Card
      className={cn(
        "p-4",
        toneClasses[tone],
        interactive && "h-full transition-colors duration-150 hover:border-brand-400",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
        {icon && (
          <span
            className={
              tone === "error" ? "text-flagged" : tone === "warning" ? "text-watch" : "text-slate-400"
            }
          >
            {icon}
          </span>
        )}
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <p className="font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">{value}</p>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-semibold",
              trend === "up" ? "text-healthy" : "text-flagged"
            )}
          >
            {trend === "up" ? <TrendUp size={13} weight="bold" /> : <TrendDown size={13} weight="bold" />}
            {trendLabel}
          </span>
        )}
      </div>
      {sub && <p className="mt-1 text-xs leading-snug text-slate-500 dark:text-slate-400">{sub}</p>}
    </Card>
  );
}
