"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-navy-950">Alert Breakdown by Type</h3>
        <span className="text-[11px] font-medium text-slate-400">Real — {total} seeded alerts</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">Grouped from the 11 seeded alert records by category.</p>
      <div className="mt-3 h-64">
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
    </div>
  );
}
