import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/national-dashboard/dashboard-card";
import type { RiskTier } from "@/lib/enums";

export type DistrictRisk = {
  district: string;
  state: string;
  maxRiskScore: number;
  alertCount: number;
  tier: RiskTier;
};

export type ContractorRisk = {
  id: string;
  companyName: string;
  score: number;
  tier: RiskTier;
  basis: "alerts" | "trust-proxy";
  kycStatus: string;
};

/**
 * Persuade-mode fork of src/components/ministry/RiskRankings.tsx — same
 * ranked-list content and the shared risk-tier Badge (design.md §3.3: the
 * triad is identical across Operate and Persuade by design), only the
 * surrounding chrome/neutrals move from Slate to Ink/Paper.
 */
export function DashboardRiskRankings({
  districts,
  contractors,
}: {
  districts: DistrictRisk[];
  contractors: ContractorRisk[];
}) {
  return (
    <section id="risk-rankings" className="grid grid-cols-1 gap-6 lg:grid-cols-2 scroll-mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Highest-Risk Districts</CardTitle>
          <CardDescription>
            Ranked by peak alert risk score, {districts.length} shown — the prototype seed spans
            only {districts.length} districts with alerts.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <ol className="divide-y divide-ink-950/8">
            {districts.map((d, i) => (
              <li key={d.district} className="flex items-center justify-between gap-3 py-2">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="w-4 shrink-0 font-mono text-xs tabular-nums text-ink-950/40">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink-950/80">{d.district}</p>
                    <p className="truncate text-xs text-ink-950/40">
                      {d.state} · {d.alertCount} alert{d.alertCount === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
                <Badge tier={d.tier}>{d.maxRiskScore}%</Badge>
              </li>
            ))}
            {districts.length === 0 && (
              <li className="py-3 text-sm text-ink-950/40">No project-linked alerts on record.</li>
            )}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Highest-Risk Contractors</CardTitle>
          <CardDescription>
            {contractors.length} shown. Ranked by linked-alert risk score where one exists, else by
            inverse Trust Score (prototype heuristic).
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <ol className="divide-y divide-ink-950/8">
            {contractors.map((c, i) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-2">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="w-4 shrink-0 font-mono text-xs tabular-nums text-ink-950/40">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <Link
                      href={`/contractors/${c.id}`}
                      className="block truncate text-sm text-indigo-700 hover:underline"
                    >
                      {c.companyName}
                    </Link>
                    <p className="truncate text-xs text-ink-950/40">
                      {c.basis === "alerts" ? "Linked alert score" : "Trust-score proxy"} ·{" "}
                      {c.kycStatus === "verified" ? "KYC Verified" : "KYC Unverified"}
                    </p>
                  </div>
                </div>
                <Badge tier={c.tier}>{c.score}%</Badge>
              </li>
            ))}
            {contractors.length === 0 && (
              <li className="py-3 text-sm text-ink-950/40">No contractors on record.</li>
            )}
          </ol>
        </CardContent>
      </Card>
    </section>
  );
}
