import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { TrustStars } from "@/components/trust-stars";

export type ContractorCardData = {
  id: string;
  companyName: string;
  registrationNumber: string;
  kycStatus: string;
  trustScore: number | null;
  projectCount: number;
};

/**
 * changes-3.md §7 — one card per contractor on the /contractors index.
 * Mirrors ProjectCard's Persuade card shell (rounded-lg border, paper-2
 * background, marigold hover lift) and reuses the same Verified/Unverified
 * `Badge` + `TrustStars` treatment already used on the contractor detail
 * page (src/app/contractors/[id]/page.tsx), so the two pages read as one
 * system rather than two badge implementations.
 */
export function ContractorCard({ contractor }: { contractor: ContractorCardData }) {
  return (
    <Link
      href={`/contractors/${contractor.id}`}
      className="block h-full rounded-lg border border-ink-950/10 bg-paper-2 p-6 transition-all duration-[250ms] hover:-translate-y-1 hover:border-marigold-600 hover:shadow-lg hover:shadow-ink-950/5"
    >
      <div className="flex items-start justify-between gap-3">
        {contractor.kycStatus === "verified" ? (
          <Badge tier="healthy">Verified</Badge>
        ) : (
          <Badge tier="flagged">Unverified</Badge>
        )}
        <TrustStars score={contractor.trustScore} />
      </div>
      <h3 className="mt-3 font-display text-lg leading-snug tracking-wide text-ink-950">
        {contractor.companyName.toUpperCase()}
      </h3>
      <p className="mt-2 text-sm text-ink-950/60">Reg. No. {contractor.registrationNumber}</p>
      <div className="mt-4 flex items-end justify-between border-t border-ink-950/10 pt-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-950/40">Projects</p>
          <p className="font-serif text-lg text-ink-950">{contractor.projectCount}</p>
        </div>
      </div>
    </Link>
  );
}
