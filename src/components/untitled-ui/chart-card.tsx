import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./card";
import { cn } from "@/lib/cn";

// Untitled UI React chart-container pattern (changes-2.md §1/§2): wraps
// Recharts output in a titled card instead of an ad hoc container. Their
// theme.css also strips the default `.recharts-surface` focus outline —
// mirrored in globals.css so this matches the upstream chart styling.
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
