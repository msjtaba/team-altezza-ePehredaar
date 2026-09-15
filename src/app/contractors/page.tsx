import { prisma } from "@/lib/prisma";
import { PersuadeNav } from "@/components/site/persuade-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { ContractorCard, type ContractorCardData } from "@/components/contractor-card";

/**
 * changes-3.md §7 — top-level Contractors index (sibling to the existing
 * /contractors/[id] detail view). Lists every contractor in the system as a
 * card; clicking one navigates into the existing, unauthenticated detail
 * page, which already owns the Verified/Unverified badge, Trust Score, and
 * project-history rendering (prd.md §4.1) — this page does not duplicate
 * that logic, it only queries + lists.
 *
 * Public/unauthenticated, same as /contractors/[id] (that page only reads
 * the session to gate an extra DM-only section — it has no access check of
 * its own), and styled with the same Persuade shell (PersuadeNav, paper/ink
 * tokens, projects-grid's card grid conventions) as /projects,
 * /mp-allocations, and /jan-pramaan.
 */
export default async function ContractorsPage() {
  const contractors = await prisma.contractor.findMany({
    include: {
      _count: { select: { projects: true } },
    },
    orderBy: { companyName: "asc" },
  });

  const cards: ContractorCardData[] = contractors.map((c) => ({
    id: c.id,
    companyName: c.companyName,
    registrationNumber: c.registrationNumber,
    kycStatus: c.kycStatus,
    trustScore: c.trustScore ? Number(c.trustScore.toString()) : null,
    projectCount: c._count.projects,
  }));

  return (
    <main className="font-body">
      <PersuadeNav />

      <div className="mx-auto max-w-dashboard px-4 py-10 sm:px-6 sm:py-14">
        <p className="max-w-2xl font-serif text-base italic leading-snug text-ink-950/70 sm:text-lg">
          &ldquo;Every project has an executor. Every executor has a record.&rdquo;
        </p>

        <h1 className="mt-4 font-display text-3xl tracking-tight text-ink-950 sm:text-4xl">
          CONTRACTORS
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-950/60 sm:text-base">
          Every implementing agency registered in this build, with its KYC
          status, Trust Score, and awarded project count at a glance.
        </p>

        <p className="mt-6 text-sm text-ink-950/50">
          Showing {cards.length} contractor{cards.length === 1 ? "" : "s"}
        </p>

        {cards.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-ink-950/15 bg-paper-2 p-12 text-center text-ink-950/50">
            No contractors on record.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => (
              <ContractorCard key={c.id} contractor={c} />
            ))}
          </div>
        )}
      </div>

      <SiteFooter
        disclaimer="KYC status is illustrative for sample contractors and Trust Scores are sample values — no verification or scoring model runs live in this build."
      />
    </main>
  );
}
