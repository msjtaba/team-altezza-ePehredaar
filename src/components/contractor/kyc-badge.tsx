// design.md §8 — "KYC badge: binary Verified/Unverified — Verified uses
// Healthy green, Unverified uses neutral slate-400, not amber/red (unverified
// isn't a risk flag, it's a status)." Built as its own component rather than
// reusing `Badge`'s "stage" tier, which carries banned Persuade `ink-*`
// tokens on this Operate surface (design.md §1.1).
export function KycBadge({ status }: { status: string }) {
  const verified = status === "verified";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
        verified ? "bg-healthy-tint text-healthy" : "bg-slate-200 text-slate-600"
      }`}
    >
      {verified ? "KYC Verified" : "KYC Unverified"}
    </span>
  );
}
