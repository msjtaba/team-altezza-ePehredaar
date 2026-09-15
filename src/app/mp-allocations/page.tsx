import { prisma } from "@/lib/prisma";
import { MpAllocationsList } from "@/components/mp-allocations-list";
import { PersuadeNav } from "@/components/site/persuade-nav";
import { SiteFooter } from "@/components/site/site-footer";

// Vercel/serverless fix: this page/layout queries Prisma at render time,
// which must never happen during Next's static-generation build step (no
// working DATABASE_URL exists in that build container) — force per-request
// rendering instead.
export const dynamic = "force-dynamic";

/**
 * MP Fund Allocation list (data.md §1) — the real 543-MP dataset, rendered
 * as a searchable/filterable list per the explicit product requirement,
 * never a chart or summary. changes-1.md §3: visual polish pass only — the
 * list requirement itself doesn't change.
 */
export default async function MpAllocationsPage() {
  const mps = await prisma.mp.findMany({ orderBy: { srNo: "asc" } });

  const rows = mps.map((mp) => ({
    srNo: mp.srNo,
    state: mp.state,
    name: mp.name,
    constituency: mp.constituency,
    allocatedAmount: mp.allocatedAmount ? mp.allocatedAmount.toString() : null,
  }));

  const states = Array.from(new Set(mps.map((mp) => mp.state))).sort();
  const totalAllocated = mps.reduce(
    (sum, mp) => sum + (mp.allocatedAmount ? Number(mp.allocatedAmount.toString()) : 0),
    0
  );

  return (
    <main className="font-body">
      <PersuadeNav />

      <div className="mx-auto max-w-dashboard px-4 py-10 sm:px-6 sm:py-16">
        <p className="font-serif text-lg italic text-teal-700 sm:text-xl">
          Allocated Limit for Hon&apos;ble MPs
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-ink-950 sm:text-4xl md:text-5xl">
          MP FUND ALLOCATIONS
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-950/70 sm:text-base">
          All {mps.length} Members of Parliament and their MPLADS allocation,
          sourced from the official allocation list. Sr. No. 108 has no
          amount in the source document and is shown as such, not fake-filled.
        </p>

        {/* Stat strip — real figures from data.md §1 (brain.md §4). */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-ink-950/10 bg-paper-2 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-950/50">
              Members of Parliament
            </p>
            <p className="mt-1.5 font-serif text-2xl text-ink-950">{mps.length}</p>
          </div>
          <div className="rounded-lg border border-ink-950/10 bg-paper-2 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-950/50">
              Total Allocated
            </p>
            <p className="mt-1.5 font-serif text-2xl text-ink-950">
              ₹{(totalAllocated).toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr
            </p>
          </div>
          <div className="rounded-lg border border-ink-950/10 bg-paper-2 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-950/50">
              States &amp; UTs Covered
            </p>
            <p className="mt-1.5 font-serif text-2xl text-ink-950">{states.length}</p>
          </div>
        </div>

        <div className="mt-10">
          <MpAllocationsList mps={rows} states={states} />
        </div>
      </div>

      <SiteFooter disclaimer="MP fund allocation figures are real, sourced from the official MPLADS allocation list." />
    </main>
  );
}
