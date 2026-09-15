import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { JanPramaanCapture } from "@/components/jan-pramaan-capture";

/**
 * Dedicated Jan-Pramaan surface (prd.md §4.3.1 desktop + §4.3.2 mobile-web),
 * one responsive route rather than two. Desktop is strictly read-only — no
 * capture/submission UI is even rendered above `md` (prd.md §4.3.1: "there
 * is no capture/submission action here"). Only the aggregate consensus is
 * ever shown; brain.md §3 rule 5 forbids any per-submission/photo detail on
 * this or any other public surface, full stop.
 */
export default async function JanPramaanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { janPramaanConsensus: true, district: true },
  });

  if (!project) notFound();

  const consensus = project.janPramaanConsensus;
  const status = (consensus?.status as "awaiting" | "verified" | "disputed") ?? "awaiting";
  const submissionCount = consensus?.submissionCount ?? 0;
  const thumbsUpCount = consensus?.thumbsUpCount ?? 0;
  const thumbsDownCount = consensus?.thumbsDownCount ?? 0;
  const upPct = submissionCount > 0 ? (thumbsUpCount / submissionCount) * 100 : 0;
  const downPct = submissionCount > 0 ? (thumbsDownCount / submissionCount) * 100 : 0;

  const statusCopy: Record<typeof status, { label: string; tone: string; pulse?: boolean }> = {
    awaiting: { label: "Awaiting Citizen Verification", tone: "bg-ink-950/8 text-ink-950", pulse: true },
    verified: { label: "✅ Citizen-Verified", tone: "bg-teal-100 text-teal-700" },
    disputed: { label: "⚠️ Under Dispute", tone: "bg-flagged-tint text-flagged" },
  };
  const c = statusCopy[status];

  return (
    <main className="min-h-[100dvh] bg-paper font-body">
      <div className="border-b border-ink-950/10 bg-paper-2">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <Link
            href={`/projects/${project.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-950/60 hover:text-marigold-600"
          >
            <ArrowLeft size={16} weight="bold" />
            Back to project
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-14">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Jan-Pramaan Verification</p>
        <h1 className="mt-3 font-display text-3xl tracking-tight text-ink-950 md:text-4xl">
          {project.title}
        </h1>
        <p className="mt-2 text-sm text-ink-950/60">
          {project.district.name}, {project.district.state}
        </p>

        {/* Status banner */}
        <div className="mt-8 rounded-lg border border-ink-950/10 bg-paper-2 p-6">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${c.tone} ${
              c.pulse ? "animate-pulse" : ""
            }`}
          >
            {c.label}
          </span>

          {/* Consensus meter — design.md §8: simple split bar + raw text,
              never a gauge/dial (would overstate precision on a small
              sample). Marigold for thumbs-up, ink-tone for thumbs-down —
              deliberately NOT the risk triad, since this is a citizen vote
              tally, not a risk signal (per brief). */}
          <p className="mt-4 text-sm font-semibold text-ink-950">
            {submissionCount === 0
              ? "No citizen submissions yet."
              : `${submissionCount} submitted — 👍 ${thumbsUpCount} 👎 ${thumbsDownCount}`}
          </p>
          {submissionCount > 0 && (
            <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-ink-950/10">
              <div className="h-full bg-marigold-600" style={{ width: `${upPct}%` }} />
              <div className="h-full bg-ink-950/50" style={{ width: `${downPct}%` }} />
            </div>
          )}
          <p className="mt-3 text-xs text-ink-950/50">
            This is the full public record — individual submissions and photos are never shown here;
            they&apos;re reviewed privately by the District Magistrate.
          </p>
        </div>

        {/* Mobile-web capture flow — hidden entirely at md+ (desktop is
            read-only per prd.md §4.3.1), CSS breakpoint only, no device
            sniffing. */}
        <div className="mt-8 md:hidden">
          <JanPramaanCapture
            projectId={project.id}
            siteLat={project.latitude}
            siteLng={project.longitude}
          />
        </div>

        <div className="mt-8 hidden rounded-lg border border-dashed border-ink-950/15 p-5 text-sm text-ink-950/50 md:block">
          Please use your mobile device to access this feature.
        </div>
      </div>
    </main>
  );
}
