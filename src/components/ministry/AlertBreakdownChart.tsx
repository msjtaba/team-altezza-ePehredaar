"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartCard } from "@/components/untitled-ui/chart-card";
import { UuiBadge } from "@/components/untitled-ui/badge";

export type AlertBreakdownPoint = {
  category: string;
  label: string;
  count: number;
};

// Navy-scale slices only — category isn't a risk-tier value, so the
// semantic risk triad doesn't apply here (design.md §3.3: risk color is
// reserved for risk meaning, never decorative/categorical use).
const NAVY_SHADES = ["#10233F", "#1E3A5F", "#3E5C82", "#8CA3BE"];

export function AlertBreakdownChart({ data }: { data: AlertBreakdownPoint[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  return (
    <ChartCard
      title="Alert Breakdown by Type"
      description="Grouped from the 11 seeded alert records by category."
      action={<UuiBadge color="brand">Real — {total} seeded alerts</UuiBadge>}
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
                <Cell key={entry.category} fill={NAVY_SHADES[i % NAVY_SHADES.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: "#E3EAF2" }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
