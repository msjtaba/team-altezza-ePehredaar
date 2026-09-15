import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/untitled-ui/card";
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

export function RiskRankings({
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
            Ranked by peak alert risk score, {districts.length} of 10 shown — the prototype seed
            spans only {districts.length} districts.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <ol className="divide-y divide-slate-100 dark:divide-slate-800">
            {districts.map((d, i) => (
              <li key={d.district} className="flex items-center justify-between gap-3 py-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono tabular-nums text-xs text-slate-400 w-4 shrink-0">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-800 dark:text-slate-200">{d.district}</p>
                    <p className="truncate text-xs text-slate-400">{d.state} · {d.alertCount} alert{d.alertCount === 1 ? "" : "s"}</p>
                  </div>
                </div>
                <Badge tier={d.tier}>{d.maxRiskScore}%</Badge>
              </li>
            ))}
            {districts.length === 0 && (
              <li className="py-3 text-sm text-slate-400">No project-linked alerts on record.</li>
            )}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Highest-Risk Contractors</CardTitle>
          <CardDescription>
            {contractors.length} of 10 shown — the prototype seed has only {contractors.length}
            {" "}
            contractors. Ranked by linked-alert risk score where one exists, else by inverse Trust
            Score (prototype heuristic).
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <ol className="divide-y divide-slate-100 dark:divide-slate-800">
            {contractors.map((c, i) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono tabular-nums text-xs text-slate-400 w-4 shrink-0">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <Link
                      href={`/contractors/${c.id}`}
                      className="truncate text-sm text-brand-700 hover:underline block dark:text-brand-400"
                    >
                      {c.companyName}
                    </Link>
                    <p className="truncate text-xs text-slate-400">
                      {c.basis === "alerts" ? "Linked alert score" : "Trust-score proxy"} ·{" "}
                      {c.kycStatus === "verified" ? "KYC Verified" : "KYC Unverified"}
                    </p>
                  </div>
                </div>
                <Badge tier={c.tier}>{c.score}%</Badge>
              </li>
            ))}
            {contractors.length === 0 && (
              <li className="py-3 text-sm text-slate-400">No contractors on record.</li>
            )}
          </ol>
        </CardContent>
      </Card>
    </section>
  );
}
