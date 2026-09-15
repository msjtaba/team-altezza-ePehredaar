"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatRupees } from "@/lib/format";
import { PROJECT_STAGES, PROJECT_STAGE_LABELS, RISK_TIERS, type ProjectStage, type RiskTier } from "@/lib/enums";

type Row = {
  id: string;
  title: string;
  status: string;
  district: string;
  contractor: string | null;
  sanctionedAmount: string;
  riskTier: RiskTier;
  riskScore: number;
  openAlertCount: number;
};

export function ProjectsTableClient({ rows }: { rows: Row[] }) {
  const [statusFilter, setStatusFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");

  const filtered = useMemo(() => {
    return rows.filter(
      (r) => (!statusFilter || r.status === statusFilter) && (!riskFilter || r.riskTier === riskFilter)
    );
  }, [rows, statusFilter, riskFilter]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl tracking-tight text-ink-950">Projects</h1>
        <p className="mt-1 text-sm text-ink-950/60">
          All {rows.length} monitored projects. Click through for the full public detail plus DM-only sections.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-ink-950/10 bg-paper-2 p-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-ink-950/50">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-ink-950/15 bg-paper px-3 py-1.5 text-sm text-ink-950/80 focus:border-marigold-600 focus:outline-none"
          >
            <option value="">All statuses</option>
            {PROJECT_STAGES.map((s) => (
              <option key={s} value={s}>
                {PROJECT_STAGE_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-ink-950/50">Risk</label>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="rounded-md border border-ink-950/15 bg-paper px-3 py-1.5 text-sm text-ink-950/80 focus:border-marigold-600 focus:outline-none"
          >
            <option value="">All tiers</option>
            {RISK_TIERS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-ink-950/10 bg-paper-2">
        <table className="w-full min-w-[880px] text-sm">
          <thead className="bg-ink-950/5 text-left text-xs uppercase tracking-wide text-ink-950/50">
            <tr>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">District</th>
              <th className="px-4 py-3">Contractor</th>
              <th className="px-4 py-3">Sanctioned</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-950/10">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-ink-950/5">
                <td className="px-4 py-3 font-medium text-ink-950">
                  <Link href={`/projects/${r.id}`} className="hover:underline">
                    {r.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-950/70">{r.district}</td>
                <td className="px-4 py-3 text-ink-950/70">{r.contractor ?? "—"}</td>
                <td className="px-4 py-3 font-mono tabular-nums text-ink-950/80">
                  {formatRupees(r.sanctionedAmount)}
                </td>
                <td className="px-4 py-3">
                  <Badge tier="stage">{PROJECT_STAGE_LABELS[r.status as ProjectStage] ?? r.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge tier={r.riskTier}>
                    {r.riskScore > 0 && <span className="font-mono tabular-nums">{r.riskScore}%</span>} {r.riskTier}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-10 text-center text-sm text-ink-950/40">No projects match the current filters.</p>
        )}
      </div>
    </div>
  );
}
