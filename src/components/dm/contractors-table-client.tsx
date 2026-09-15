"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type Row = {
  id: string;
  companyName: string;
  kycStatus: string;
  trustScore: number | null;
  projectCount: number;
  openAlertCount: number;
  hasCollusionFlag: boolean;
};

export function ContractorsTableClient({ rows }: { rows: Row[] }) {
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    return rows.slice().sort((a, b) => {
      const av = a.trustScore ?? -1;
      const bv = b.trustScore ?? -1;
      return sortDir === "desc" ? bv - av : av - bv;
    });
  }, [rows, sortDir]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl tracking-tight text-ink-950">Contractors</h1>
        <p className="mt-1 text-sm text-ink-950/60">{rows.length} vendors on record, sortable by Trust Score.</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-ink-950/10 bg-paper-2">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-ink-950/5 text-left text-xs uppercase tracking-wide text-ink-950/50">
            <tr>
              <th className="px-4 py-3">Contractor</th>
              <th className="px-4 py-3">KYC</th>
              <th
                className="cursor-pointer select-none px-4 py-3"
                onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
              >
                Trust Score {sortDir === "desc" ? "↓" : "↑"}
              </th>
              <th className="px-4 py-3">Projects</th>
              <th className="px-4 py-3">Open Alerts</th>
              <th className="px-4 py-3">Collusion Flag</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-950/10">
            {sorted.map((c) => (
              <tr key={c.id} className="hover:bg-ink-950/5">
                <td className="px-4 py-3 font-medium text-ink-950">
                  <Link href={`/contractors/${c.id}`} className="hover:underline">
                    {c.companyName}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Badge tier={c.kycStatus === "verified" ? "healthy" : "stage"}>
                    {c.kycStatus === "verified" ? "Verified" : "Unverified"}
                  </Badge>
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-ink-950/80">
                  {c.trustScore !== null ? c.trustScore.toFixed(0) : "—"}
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-ink-950/70">{c.projectCount}</td>
                <td className="px-4 py-3 font-mono tabular-nums text-ink-950/70">{c.openAlertCount}</td>
                <td className="px-4 py-3">
                  {c.hasCollusionFlag ? <Badge tier="flagged">Linked</Badge> : <span className="text-ink-950/30">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
