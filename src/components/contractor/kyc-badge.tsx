import { Badge } from "@/components/ui/badge";

// design.md §8 — "KYC badge: binary Verified/Unverified — Verified uses
// Healthy green, Unverified uses neutral slate-400, not amber/red (unverified
// isn't a risk flag, it's a status)." changes-6.md §1 retheme: now built on
// the shared `Badge` component (Persuade `ink-*` tokens) instead of its own
// bespoke markup, so the portal pulls from the same design system as the
// rest of the site. Semantics unchanged — Verified maps to Badge's
// `healthy` tier, Unverified maps to the neutral `stage` tier (ink-based,
// NOT the `flagged` risk-red tier), matching how
// `src/app/contractors/[id]/page.tsx`'s public profile badges KYC status
// prior to that page's changes-4.md §7 flagged-red treatment, which was a
// deliberate exception for that specific public-facing context and doesn't
// apply to this internal portal status display.
export function KycBadge({ status }: { status: string }) {
  const verified = status === "verified";
  return <Badge tier={verified ? "healthy" : "stage"}>{verified ? "KYC Verified" : "KYC Unverified"}</Badge>;
}
