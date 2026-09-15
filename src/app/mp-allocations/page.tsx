import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { MpAllocationsList } from "@/components/mp-allocations-list";

/**
 * MP Fund Allocation list (data.md §1) — the real 543-MP dataset, rendered
 * as a searchable/filterable list per the explicit product requirement,
 * never a chart or summary.
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

  return (
    <main className="font-body">
      <div className="border-b border-ink-950/10 bg-paper-2">
        <div className="mx-auto max-w-dashboard px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-950/60 hover:text-marigold-600"
          >
            <ArrowLeft size={16} weight="bold" />
            Back to home
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-dashboard px-6 py-16">
        <p className="font-serif text-xl italic text-teal-700">Allocated Limit for Hon&apos;ble MPs</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight text-ink-950 md:text-5xl">
          MP FUND ALLOCATIONS
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-950/70">
          All {mps.length} Members of Parliament and their MPLADS allocation,
          sourced from the official allocation list. Sr. No. 108 has no
          amount in the source document and is shown as such, not fake-filled.
        </p>

        <div className="mt-10">
          <MpAllocationsList mps={rows} states={states} />
        </div>
      </div>
    </main>
  );
}
