import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { StatusTracker } from "@/components/status-tracker";
import { JanPramaanBanner } from "@/components/jan-pramaan-banner";
import { formatRupees, formatLakhShort, formatDate } from "@/lib/format";
import { PROJECT_CATEGORY_LABELS, PROJECT_STAGE_LABELS, isStageCompletedOrLater, type ProjectCategory, type ProjectStage } from "@/lib/enums";
import { PersuadeNav } from "@/components/site/persuade-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { SatelliteMap } from "@/components/satellite-map";

// Vercel/serverless fix: this page/layout queries Prisma at render time,
// which must never happen during Next's static-generation build step (no
// working DATABASE_URL exists in that build container) — force per-request
// rendering instead.
export const dynamic = "force-dynamic";

/**
 * Individual Project Page (prd.md §4.1) — public, read-only. This URL
 * always resolves for any project (data.md §2: the page itself is fine to
 * always exist); the listing decides separately whether a card links here.
 * Only the payment/installment timeline is conditional on stage, since an
 * incomplete project structurally has no payments to show.
 */
export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      mp: true,
      district: true,
      assignedContractor: true,
      payments: { orderBy: { paidAt: "asc" } },
      janPramaanConsensus: true,
    },
  });

  if (!project) notFound();

  const showPaymentTimeline = isStageCompletedOrLater(project.status);
  const totalPaid = project.payments.reduce((s, p) => s + Number(p.amount.toString()), 0);
  const categoryLabel = PROJECT_CATEGORY_LABELS[project.category as ProjectCategory] ?? project.category;
  const stageLabel = PROJECT_STAGE_LABELS[project.status as ProjectStage] ?? project.status;

  const consensus = project.janPramaanConsensus;

  return (
    <main className="font-body">
      <PersuadeNav />
      <div className="border-b border-ink-950/10 bg-paper-2">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-950/60 hover:text-marigold-600"
          >
            <ArrowLeft size={16} weight="bold" />
            Back to listing
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tier="stage">{stageLabel}</Badge>
          <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            {categoryLabel}
          </span>
          {!project.isRealData && (
            <span className="text-xs text-ink-950/40">Sample record — structurally matched, not a real project</span>
          )}
        </div>

        <h1 className="mt-4 font-display text-3xl leading-tight tracking-tight text-ink-950 md:text-4xl">
          {project.title}
        </h1>

        {project.description && (
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-ink-950/70">
            {project.description}
          </p>
        )}

        <div className="mt-10 grid grid-cols-2 gap-6 rounded-lg border border-ink-950/10 bg-paper-2 p-6 sm:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-950/40">Sanctioned Amount</p>
            <p className="mt-1 font-serif text-xl text-ink-950">{formatRupees(project.sanctionedAmount.toString())}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-950/40">MP</p>
            <p className="mt-1 text-sm font-semibold text-ink-950">{project.mp.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-950/40">Sanction Date</p>
            <p className="mt-1 text-sm font-semibold text-ink-950">{formatDate(project.sanctionDate)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-950/40">Location</p>
            <p className="mt-1 text-sm font-semibold text-ink-950">
              {project.district.name}, {project.district.state}
            </p>
          </div>
          {project.workId && (
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-950/40">Work ID</p>
              <p className="mt-1 text-sm font-semibold text-ink-950">{project.workId}</p>
            </div>
          )}
          {project.assignedContractor && (
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-950/40">Awarded To</p>
              <Link
                href={`/contractors/${project.assignedContractor.id}`}
                className="mt-1 block text-sm font-semibold text-indigo-700 hover:underline"
              >
                {project.assignedContractor.companyName}
              </Link>
            </div>
          )}
        </div>

        {project.latitude !== null && project.longitude !== null && (
          <section className="mt-14">
            <h2 className="font-display text-xl tracking-wide text-ink-950">SATELLITE VIEW</h2>
            <div className="mt-6">
              <SatelliteMap lat={project.latitude} lng={project.longitude} height={320} />
            </div>
          </section>
        )}

        <section className="mt-14">
          <h2 className="font-display text-xl tracking-wide text-ink-950">STATUS TRACKER</h2>
          <div className="mt-6 rounded-lg border border-ink-950/10 bg-paper-2 p-6">
            <StatusTracker status={project.status} />
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-xl tracking-wide text-ink-950">JAN-PRAMAAN VERIFICATION</h2>
          <div className="mt-6">
            <JanPramaanBanner
              projectId={project.id}
              status={(consensus?.status as "awaiting" | "verified" | "disputed") ?? "awaiting"}
              submissionCount={consensus?.submissionCount ?? 0}
              thumbsUpCount={consensus?.thumbsUpCount ?? 0}
              thumbsDownCount={consensus?.thumbsDownCount ?? 0}
            />
          </div>
        </section>

        {showPaymentTimeline && (
          <section className="mt-14">
            <h2 className="font-display text-xl tracking-wide text-ink-950">PAYMENT TIMELINE</h2>
            <div className="mt-6 rounded-lg border border-ink-950/10 bg-paper-2 p-6">
              <div className="flex flex-wrap gap-8 border-b border-ink-950/10 pb-5">
                <div>
                  <p className="text-xs uppercase tracking-wide text-ink-950/40">Total Installments</p>
                  <p className="mt-1 font-serif text-2xl text-ink-950">{project.payments.length}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-ink-950/40">Total Amount Paid</p>
                  <p className="mt-1 font-serif text-2xl text-ink-950">{formatLakhShort(totalPaid)}</p>
                </div>
              </div>
              {project.payments.length === 0 ? (
                <p className="mt-5 text-sm text-ink-950/50">No payments recorded yet.</p>
              ) : (
                <ul className="mt-5 flex flex-col gap-3">
                  {project.payments.map((p) => (
                    <li
                      key={p.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-paper px-4 py-3 text-sm"
                    >
                      <span className="font-semibold text-ink-950">{formatDate(p.paidAt)}</span>
                      <span className="text-ink-950/70">{formatRupees(p.amount.toString())}</span>
                      <Badge tier={p.status === "success" ? "healthy" : p.status === "failed" ? "flagged" : "watch"}>
                        {p.status === "success" ? "Payment Success" : p.status === "failed" ? "Payment Failed" : "Pending"}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}
