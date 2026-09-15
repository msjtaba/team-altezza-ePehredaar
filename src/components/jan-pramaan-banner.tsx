import Link from "next/link";

/**
 * Jan-Pramaan public status banner (prd.md §4.3.1 / brain.md §3 rule 5).
 * Public/desktop view: status banner + aggregate consensus meter only —
 * count and thumbs split. Never individual submission or photo detail;
 * that's DM-only (Phase 5's DM Review Inbox), never built here.
 * Links through to the dedicated /jan-pramaan/[id] surface (desktop
 * read-only view there; mobile-web adds the citizen capture flow) rather
 * than duplicating any of that logic here.
 */
export function JanPramaanBanner({
  projectId,
  status,
  submissionCount,
  thumbsUpCount,
  thumbsDownCount,
}: {
  projectId: string;
  status: "awaiting" | "verified" | "disputed";
  submissionCount: number;
  thumbsUpCount: number;
  thumbsDownCount: number;
}) {
  const copy: Record<typeof status, { label: string; tone: string }> = {
    awaiting: { label: "Awaiting Citizen Verification", tone: "bg-ink-950/8 text-ink-950" },
    verified: { label: "✅ Citizen-Verified", tone: "bg-teal-100 text-teal-700" },
    disputed: { label: "⚠️ Under Dispute", tone: "bg-flagged-tint text-flagged" },
  };
  const c = copy[status];

  return (
    <div className="rounded-lg border border-ink-950/10 bg-paper-2 p-5">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${c.tone} ${
          status === "awaiting" ? "animate-pulse" : ""
        }`}
      >
        {c.label}
      </span>
      <p className="mt-3 text-sm text-ink-950/70">
        {submissionCount === 0
          ? "No citizen submissions yet."
          : `${submissionCount} submitted — 👍 ${thumbsUpCount} 👎 ${thumbsDownCount}`}
      </p>
      {submissionCount > 0 && (
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-950/10">
          <div
            className="h-full bg-teal-700"
            style={{ width: `${(thumbsUpCount / submissionCount) * 100}%` }}
          />
        </div>
      )}
      <Link
        href={`/jan-pramaan/${projectId}`}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-marigold-600 hover:text-marigold-400"
      >
        Verify this project →
      </Link>
    </div>
  );
}
