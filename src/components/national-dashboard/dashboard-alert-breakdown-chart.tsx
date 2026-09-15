"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartCard, DashboardPill } from "@/components/national-dashboard/dashboard-card";

export type AlertBreakdownPoint = {
  category: string;
  label: string;
  count: number;
};

// Civic Editorial accent rotation (design.md §3.0) — category is not a
// risk-tier value, so the semantic risk triad doesn't apply (design.md
// §3.3: risk color is reserved for risk meaning, never decorative use).
const EDITORIAL_SHADES = ["#26317A", "#E08A2E", "#0F6B62", "#3D4AA8"];

/**
 * Persuade-mode fork of src/components/ministry/AlertBreakdownChart.tsx —
 * same real, seed-derived data, re-themed off Watchtower Navy.
 */
export function DashboardAlertBreakdownChart({ data }: { data: AlertBreakdownPoint[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  return (
    <ChartCard
      title="Alert Breakdown by Type"
      description="Grouped from the seeded alert records by category."
      action={<DashboardPill tone="marigold">Real — {total} seeded alerts</DashboardPill>}
    >
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="label"
              innerRadius="55%"
              outerRadius="85%"
              paddingAngle={2}
            >
              {data.map((entry, i) => (
                <Cell key={entry.category} fill={EDITORIAL_SHADES[i % EDITORIAL_SHADES.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: "#14142B1A", background: "#FBF8F2" }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
