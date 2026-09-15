"use client";

import { useMemo, useState } from "react";
import { formatCrore } from "@/lib/format";

type MpRow = {
  srNo: number;
  state: string;
  name: string;
  constituency: string;
  allocatedAmount: string | null;
};

const PAGE_SIZE = 50;

/**
 * data.md §1's explicit instruction: this dataset renders as a
 * browsable/searchable **list**, never a chart or summary. All 543 rows
 * are passed down from the server component; search/state-filter/pagination
 * all happen client-side, which is cheap at this row count.
 */
export function MpAllocationsList({ mps, states }: { mps: MpRow[]; states: string[] }) {
  const [query, setQuery] = useState("");
  const [state, setState] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mps.filter((mp) => {
      if (state && mp.state !== state) return false;
      if (!q) return true;
      return (
        mp.name.toLowerCase().includes(q) ||
        mp.constituency.toLowerCase().includes(q) ||
        mp.state.toLowerCase().includes(q)
      );
    });
  }, [mps, query, state]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
          placeholder="Search by name, constituency, or state…"
          className="w-full max-w-sm rounded-md border border-ink-950/15 bg-paper px-3 py-2 text-sm text-ink-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marigold-600"
        />
        <select
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
          className="rounded-md border border-ink-950/15 bg-paper px-3 py-2 text-sm text-ink-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marigold-600"
        >
          <option value="">All States</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-4 text-sm text-ink-950/50">
        Showing {visible.length} of {filtered.length} MPs
        {filtered.length !== mps.length ? ` (filtered from ${mps.length})` : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-ink-950/15 bg-paper-2 p-12 text-center text-ink-950/50">
          No MPs match this search.
        </div>
      ) : (
        <>
          <div className="mt-6 overflow-x-auto rounded-lg border border-ink-950/10">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-paper-2 text-left text-xs uppercase tracking-wide text-ink-950/50">
                <tr>
                  <th className="px-4 py-3">Sr. No.</th>
                  <th className="px-4 py-3">State</th>
                  <th className="px-4 py-3">Member of Parliament</th>
                  <th className="px-4 py-3">Constituency</th>
                  <th className="px-4 py-3 text-right">Allocated Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-950/10">
                {visible.map((mp) => (
                  <tr key={mp.srNo} className="hover:bg-paper-2">
                    <td className="px-4 py-3 text-ink-950/50">{mp.srNo}</td>
                    <td className="px-4 py-3 text-ink-950/70">{mp.state}</td>
                    <td className="px-4 py-3 font-medium text-ink-950">{mp.name}</td>
                    <td className="px-4 py-3 text-ink-950/70">{mp.constituency}</td>
                    <td className="px-4 py-3 text-right font-serif tabular-nums text-ink-950">
                      {formatCrore(mp.allocatedAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {visibleCount < filtered.length && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="rounded-md border-2 border-ink-950/15 px-6 py-2.5 text-sm font-semibold text-ink-950 transition-all hover:border-ink-950"
              >
                Load 50 more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
