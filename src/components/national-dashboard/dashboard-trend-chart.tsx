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
import { ChartCard, DashboardPill } from "@/components/national-dashboard/dashboard-card";

export type TrendPoint = {
  month: string;
  sanctioned: number;
  spent: number;
  parked: number;
};

/**
 * Persuade-mode fork of src/components/ministry/TrendChart.tsx. Same
 * illustrative-series rationale (no historical time series in the seed
 * data, changes-3.md §2 explicitly allows this) — only the color tokens
 * change, from Watchtower Navy to the Civic Editorial trio (indigo/
 * marigold/teal), to match the Persuade palette used on /projects,
 * /mp-allocations, /jan-pramaan.
 */
export function DashboardTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <ChartCard
      title="Fund Utilization Trend"
      description="Sample trend, not derived from seed data (no historical series exists to derive it from)."
      action={<DashboardPill tone="indigo">Illustrative — 12 mo.</DashboardPill>}
    >
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#14142B14" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#14142B80" }} axisLine={{ stroke: "#14142B26" }} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: "#14142B80" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `₹${v}Cr`}
            />
            <Tooltip
              formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")} Cr`, ""]}
              contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: "#14142B1A", background: "#FBF8F2" }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area
              type="monotone"
              dataKey="sanctioned"
              name="Sanctioned"
              stroke="#26317A"
              fill="#26317A"
              fillOpacity={0.14}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="spent"
              name="Spent"
              stroke="#E08A2E"
              fill="#E08A2E"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="parked"
              name="Parked"
              stroke="#0F6B62"
              fill="#0F6B62"
              fillOpacity={0.22}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
