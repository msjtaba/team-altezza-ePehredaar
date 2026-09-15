"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartCard } from "@/components/untitled-ui/chart-card";
import { UuiBadge } from "@/components/untitled-ui/badge";

export type TrendPoint = {
  month: string;
  sanctioned: number;
  spent: number;
  parked: number;
};

// Illustrative 12-month series — the seed data has no historical time
// series (prd.md §4.5 / brain.md §4 explicitly allow sample data here).
// Generated in src/app/ministry/page.tsx and clearly labeled illustrative
// wherever it's shown, per brain.md §4's honesty rule.
export function TrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <ChartCard
      title="Fund Utilization Trend"
      description="Sample trend, not derived from seed data (no historical series exists to derive it from)."
      action={<UuiBadge color="gray">Illustrative — 12 mo.</UuiBadge>}
    >
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E3EAF2" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={{ stroke: "#CBD5E1" }} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748B" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `₹${v}Cr`}
            />
            <Tooltip
              formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")} Cr`, ""]}
              contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: "#E3EAF2" }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area
              type="monotone"
              dataKey="sanctioned"
              name="Sanctioned"
              stroke="#1E3A5F"
              fill="#1E3A5F"
              fillOpacity={0.12}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="spent"
              name="Spent"
              stroke="#3E5C82"
              fill="#3E5C82"
              fillOpacity={0.18}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="parked"
              name="Parked"
              stroke="#8CA3BE"
              fill="#8CA3BE"
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
