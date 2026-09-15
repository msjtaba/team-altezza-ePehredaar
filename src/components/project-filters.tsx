"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PROJECT_CATEGORY_LABELS, PROJECT_STAGE_LABELS, type ProjectCategory, type ProjectStage } from "@/lib/enums";

/**
 * Filter controls for the Projects tab (changes-1.md §4). Client-side
 * URL-search-param filtering — appropriate at this prototype's scale (10
 * projects), no separate API route needed. Selecting a value pushes to the
 * URL so filters are shareable/bookmarkable and the listing (a server
 * component) re-renders filtered.
 *
 * State/District lists are the **full** seeded lists (queried from Prisma
 * in the server component, not derived from just the 10 projects) per
 * changes-1.md §4's explicit "list all states/districts" instruction. The
 * standalone "Select MP" dropdown is gone — the MP dropdown only appears
 * once a State is chosen, and only lists that state's MPs.
 */
export function ProjectFilters({
  states,
  districts,
  mpsByState,
}: {
  states: string[];
  districts: string[];
  mpsByState: Record<string, string[]>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string, clearKeys: string[] = []) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    for (const k of clearKeys) params.delete(k);
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, {
      scroll: false,
    });
  }

  const selectClass =
    "rounded-md border border-ink-950/15 bg-paper px-3 py-2 text-sm text-ink-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marigold-600";

  const selectedState = searchParams.get("state") ?? "";
  const mpsForState = selectedState ? mpsByState[selectedState] ?? [] : [];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        className={selectClass}
        value={selectedState}
        // Changing state invalidates any previously-selected MP from a
        // different state (changes-1.md §4's dynamic-MP-dropdown rule).
        onChange={(e) => setParam("state", e.target.value, ["mp"])}
        aria-label="Filter by state"
      >
        <option value="">All States</option>
        {states.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={searchParams.get("district") ?? ""}
        onChange={(e) => setParam("district", e.target.value)}
        aria-label="Filter by district"
      >
        <option value="">All Districts</option>
        {districts.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {selectedState && (
        <select
          className={selectClass}
          value={searchParams.get("mp") ?? ""}
          onChange={(e) => setParam("mp", e.target.value)}
          aria-label={`Filter by MP in ${selectedState}`}
        >
          <option value="">All MPs in {selectedState}</option>
          {mpsForState.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      )}

      <select
        className={selectClass}
        value={searchParams.get("category") ?? ""}
        onChange={(e) => setParam("category", e.target.value)}
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>
        {(Object.keys(PROJECT_CATEGORY_LABELS) as ProjectCategory[]).map((c) => (
          <option key={c} value={c}>
            {PROJECT_CATEGORY_LABELS[c]}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={searchParams.get("status") ?? ""}
        onChange={(e) => setParam("status", e.target.value)}
        aria-label="Filter by status"
      >
        <option value="">All Statuses</option>
        {(Object.keys(PROJECT_STAGE_LABELS) as ProjectStage[]).map((s) => (
          <option key={s} value={s}>
            {PROJECT_STAGE_LABELS[s]}
          </option>
        ))}
      </select>

      {(searchParams.get("state") ||
        searchParams.get("district") ||
        searchParams.get("mp") ||
        searchParams.get("category") ||
        searchParams.get("status")) && (
        <button
          type="button"
          onClick={() => router.push(pathname, { scroll: false })}
          className="text-sm font-semibold text-indigo-700 underline-offset-2 hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
