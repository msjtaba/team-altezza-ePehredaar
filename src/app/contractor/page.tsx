import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { KycBadge } from "@/components/contractor/kyc-badge";

// prd.md §4.2 "Trust Score Visibility" — the contractor can see their own
// real numeric Trust Score here; only the public profile renders it as
// stars (see src/app/layout.tsx's public pages, out of scope for Phase 4).
export default async function ContractorDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/contractor");
  if (session.user.role !== "contractor") redirect("/sign-in?callbackUrl=/contractor");

  const contractor = await prisma.contractor.findUnique({
    where: { userId: session.user.id },
  });
  if (!contractor) redirect("/sign-in?callbackUrl=/contractor");

  const [activeBidsCount, ongoingProjectsCount, openTendersNotBid] = await Promise.all([
    prisma.bid.count({
      where: { contractorId: contractor.id, status: { in: ["submitted", "under_review"] } },
    }),
    prisma.project.count({
      where: {
        assignedContractorId: contractor.id,
        status: { in: ["awarded", "in_progress"] },
      },
    }),
    prisma.tender.count({
      where: { status: "open", bids: { none: { contractorId: contractor.id } } },
    }),
  ]);

  const trustScore = contractor.trustScore != null ? Number(contractor.trustScore) : null;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl tracking-tight text-ink-950 sm:text-3xl">
          Welcome back, {contractor.companyName}
        </h1>
        <p className="mt-1 text-sm text-ink-950/60">
          Registration No. <span className="font-mono">{contractor.registrationNumber}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-ink-950/10 bg-paper-2 p-5">
          <p className="text-xs uppercase tracking-wide text-ink-950/50">
            KYC Status
          </p>
          <div className="mt-3">
            <KycBadge status={contractor.kycStatus} />
          </div>
          {contractor.kycStatus !== "verified" && (
            <p className="mt-2 text-xs text-ink-950/50">
              Verification required to bid on open tenders.
            </p>
          )}
        </div>

        <div className="rounded-lg border border-ink-950/10 bg-paper-2 p-5">
          <p className="text-xs uppercase tracking-wide text-ink-950/50">
            Trust Score
          </p>
          <p className="mt-3 font-serif text-3xl text-indigo-700">
            {trustScore != null ? trustScore.toFixed(0) : "—"}
          </p>
          <p className="mt-1 text-xs text-ink-950/50">
            Illustrative sample score, contractor-only view.
          </p>
        </div>

        <div className="rounded-lg border border-ink-950/10 bg-paper-2 p-5">
          <p className="text-xs uppercase tracking-wide text-ink-950/50">
            Active Bids
          </p>
          <p className="mt-3 font-serif text-3xl text-marigold-600">
            {activeBidsCount}
          </p>
          <Link
            href="/contractor/bids"
            className="mt-1 inline-block text-xs font-semibold text-ink-950/60 hover:text-marigold-600"
          >
            View My Bids
          </Link>
        </div>

        <div className="rounded-lg border border-ink-950/10 bg-paper-2 p-5">
          <p className="text-xs uppercase tracking-wide text-ink-950/50">
            Ongoing Projects
          </p>
          <p className="mt-3 font-serif text-3xl text-teal-700">
            {ongoingProjectsCount}
          </p>
          <Link
            href="/contractor/projects"
            className="mt-1 inline-block text-xs font-semibold text-ink-950/60 hover:text-marigold-600"
          >
            View My Projects
          </Link>
        </div>
      </div>

      {openTendersNotBid > 0 && (
        <div className="rounded-lg border border-marigold-600/30 bg-marigold-100 p-5">
          <p className="text-sm text-ink-950">
            <span className="font-serif font-semibold">{openTendersNotBid}</span>{" "}
            open tender{openTendersNotBid === 1 ? "" : "s"} you haven&apos;t bid on yet.
          </p>
          <Link
            href="/contractor/bids"
            className="mt-2 inline-block text-sm font-semibold text-marigold-600 hover:underline"
          >
            Go to My Bids →
          </Link>
        </div>
      )}
    </div>
  );
}
