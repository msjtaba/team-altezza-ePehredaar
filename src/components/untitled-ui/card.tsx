import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

// Untitled UI React card pattern (changes-2.md §1/§3) — the baseline
// container for dashboard-style UI going forward: rounded-xl, hairline
// border, soft elevation, dark-mode aware. Used by the Ministry Overview
// dashboard and the Collusion page chrome; existing pages keep their own
// `rounded-lg border-slate-200` pattern per the deferred-retrofit decision.
export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white shadow-uui-xs",
        "dark:border-slate-700 dark:bg-slate-900",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1 border-b border-slate-200 px-5 py-4 dark:border-slate-700", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-sm font-semibold text-slate-900 dark:text-slate-100", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-slate-500 dark:text-slate-400", className)} {...props}>
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

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-t border-slate-200 px-5 py-3 dark:border-slate-700", className)} {...props}>
      {children}
    </div>
  );
}

export function CardBanner({
  tone = "brand",
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { tone?: "brand" | "success" | "warning" | "error" }) {
  const tones: Record<string, string> = {
    brand: "border-brand-200 bg-brand-50 dark:border-brand-800 dark:bg-brand-950/40",
    success: "border-healthy/30 bg-healthy-tint dark:border-healthy/40 dark:bg-healthy/10",
    warning: "border-watch/30 bg-watch-tint dark:border-watch/40 dark:bg-watch/10",
    error: "border-flagged/40 bg-flagged-tint dark:border-flagged/50 dark:bg-flagged/10",
  };
  return (
    <div className={cn("rounded-xl border p-5", tones[tone], className)} {...props}>
      {children}
    </div>
  );
}

export type { ReactNode };
