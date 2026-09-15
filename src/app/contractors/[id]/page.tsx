import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { TrustStars } from "@/components/trust-stars";
import { DmOnlyContractorSection } from "@/components/dm/dm-only-contractor-section";
import { formatRupees, formatDate } from "@/lib/format";
import { PROJECT_STAGE_LABELS, type ProjectStage } from "@/lib/enums";

/**
 * Contractor Public Profile (prd.md §4.1) — name, KYC badge, project
 * counts, star-rating Trust Score (never a raw number — design.md §3.4),
 * and the full bid/win history across MPs/districts.
 */
export default async function ContractorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const contractor = await prisma.contractor.findUnique({
    where: { id },
    include: {
      projects: { include: { mp: true, district: true } },
    },
  });

  if (!contractor) notFound();

  const session = await getServerSession(authOptions);
  const isDm = session?.user?.role === "dm";

  const bids = await prisma.bid.findMany({
    where: { contractorId: id },
    include: { tender: { include: { project: { include: { mp: true, district: true } } } } },
    orderBy: { submittedAt: "desc" },
  });

  const stalledAlerts = await prisma.alert.findMany({
    where: { contractorId: id, type: "stalled_project", status: "open" },
  });
  const stalledProjectIds = new Set(stalledAlerts.map((a) => a.projectId).filter(Boolean));

  const completed = contractor.projects.filter((p) =>
    ["completed", "citizen_verified", "payment_released"].includes(p.status)
  );
  const ongoingAll = contractor.projects.filter((p) => ["awarded", "in_progress"].includes(p.status));
  const delayed = ongoingAll.filter((p) => stalledProjectIds.has(p.id));
  const ongoing = ongoingAll.filter((p) => !stalledProjectIds.has(p.id));

  const trustScore = contractor.trustScore ? Number(contractor.trustScore.toString()) : null;

  return (
    <main className="font-body">
      <div className="border-b border-ink-950/10 bg-paper-2">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-950/60 hover:text-marigold-600"
          >
            <ArrowLeft size={16} weight="bold" />
            Back to listing
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl tracking-tight text-ink-950 md:text-4xl">
              {contractor.companyName.toUpperCase()}
            </h1>
            <p className="mt-2 text-sm text-ink-950/60">Reg. No. {contractor.registrationNumber}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {contractor.kycStatus === "verified" ? (
              <Badge tier="healthy">Verified</Badge>
            ) : (
              <Badge tier="stage">Unverified</Badge>
            )}
            <TrustStars score={trustScore} />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-ink-950/10 bg-paper-2 p-5 text-center">
            <p className="font-serif text-3xl text-teal-700">{completed.length}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-ink-950/50">Completed</p>
          </div>
          <div className="rounded-lg border border-ink-950/10 bg-paper-2 p-5 text-center">
            <p className="font-serif text-3xl text-indigo-700">{ongoing.length}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-ink-950/50">Ongoing</p>
          </div>
          <div className="rounded-lg border border-ink-950/10 bg-paper-2 p-5 text-center">
            <p className="font-serif text-3xl text-flagged">{delayed.length}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-ink-950/50">Delayed</p>
          </div>
        </div>

        <section className="mt-14">
          <h2 className="font-display text-xl tracking-wide text-ink-950">BIDS &amp; PROJECTS</h2>
          <p className="mt-2 text-sm text-ink-950/60">
            Every tender this contractor has bid on or won, across MPs and districts.
          </p>

          {bids.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-ink-950/15 bg-paper-2 p-10 text-center text-ink-950/50">
              No bids on record for this contractor.
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-lg border border-ink-950/10">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-paper-2 text-left text-xs uppercase tracking-wide text-ink-950/50">
                  <tr>
                    <th className="px-4 py-3">Project</th>
                    <th className="px-4 py-3">MP / District</th>
                    <th className="px-4 py-3">Price Quote</th>
                    <th className="px-4 py-3">Submitted</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-950/10">
                  {bids.map((b) => (
                    <tr key={b.id}>
                      <td className="px-4 py-3 font-medium text-ink-950">
                        <Link href={`/projects/${b.tender.project.id}`} className="hover:text-marigold-600 hover:underline">
                          {b.tender.project.title.length > 60
                            ? `${b.tender.project.title.slice(0, 60)}…`
                            : b.tender.project.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-ink-950/70">
                        {b.tender.project.mp.name} · {b.tender.project.district.name}
                      </td>
                      <td className="px-4 py-3 text-ink-950/70">{formatRupees(b.priceQuote.toString())}</td>
                      <td className="px-4 py-3 text-ink-950/70">{formatDate(b.submittedAt)}</td>
                      <td className="px-4 py-3">
                        <Badge
                          tier={
                            b.status === "won" ? "healthy" : b.status === "lost" ? "flagged" : "stage"
                          }
                        >
                          {b.status === "won"
                            ? "Selected"
                            : b.status === "lost"
                              ? "Not Selected"
                              : b.status === "under_review"
                                ? "Under Review"
                                : "Submitted"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {contractor.projects.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-xl tracking-wide text-ink-950">AWARDED PROJECTS</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {contractor.projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="rounded-lg border border-ink-950/10 bg-paper-2 p-5 transition-all hover:-translate-y-0.5 hover:border-marigold-600"
                >
                  <Badge tier="stage">{PROJECT_STAGE_LABELS[p.status as ProjectStage] ?? p.status}</Badge>
                  <p className="mt-3 text-sm font-semibold text-ink-950">{p.title}</p>
                  <p className="mt-1 text-xs text-ink-950/50">
                    {p.mp.name} · {p.district.name}, {p.district.state}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {isDm && <DmOnlyContractorSection contractorId={contractor.id} />}
      </div>
    </main>
  );
}
