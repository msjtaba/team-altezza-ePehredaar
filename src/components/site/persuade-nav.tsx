"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react/dist/ssr";

/**
 * Shared Persuade-mode header (design.md §3.0/§4.1 — Anton wordmark, paper
 * background) for every citizen-facing storytelling page: /projects,
 * /mp-allocations, /jan-pramaan*, /contractors/[id]. Extracted from the old
 * marketing homepage (changes-1.md §1/§7) so the same header renders
 * identically across all Persuade surfaces, including the Jan-Pramaan pages
 * another agent owns.
 *
 * "Home" points at `/` — the National Overview Dashboard, which
 * changes-3.md §1 converged onto this same Persuade system (a deliberate
 * departure from design.md's earlier v3 amendment, which had scoped `/` as
 * Operate-mode alongside `/ministry`) — so the wordmark/"Home" link now
 * stays within one visual register end-to-end.
 *
 * Nav item set is the final list per changes-3.md §8: Projects, MP
 * Allocations, Contractors, Cartel, JAN PRAMAAN — in that order. The
 * dashboard itself is deliberately NOT a nav item (changes-3.md §9.1) —
 * it's reached via the wordmark/logo link above.
 *
 * changes-4.md §9 — mobile had no way to navigate at all (the desktop
 * `<nav>` below is `hidden md:flex`). This adds a hamburger toggle that is
 * the LEFTMOST element in the mobile header (menu icon, then logo, then
 * "ePehredaar" wordmark), which expands a panel surfacing the same nav set
 * plus sign-in. The whole component is a client component (just for the
 * open/closed toggle) since it's small and has no other server-only needs.
 */
export function PersuadeNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close the mobile panel whenever the route changes (e.g. a nav
  // link click), so navigating away never leaves it stuck open.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-950/10 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-dashboard items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="-ml-1.5 flex h-9 w-9 items-center justify-center rounded-md text-ink-950 transition-colors hover:text-marigold-600 md:hidden"
          >
            {open ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
          </button>
          <Link href="/" className="flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 30 30" aria-hidden="true">
              <rect width="30" height="30" rx="7" fill="#26317A" />
              <path
                d="M8 20V10l7 6 7-6v10"
                stroke="#E08A2E"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <span className="font-display text-base tracking-wide text-ink-950 sm:text-lg">
              ePehredaar
            </span>
          </Link>
        </div>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-ink-950/70 md:flex">
          <Link href="/projects" className="transition-colors hover:text-marigold-600">
            Projects
          </Link>
          <Link href="/mp-allocations" className="transition-colors hover:text-marigold-600">
            MP Allocations
          </Link>
          <Link href="/contractors" className="transition-colors hover:text-marigold-600">
            Contractors
          </Link>
          <Link href="/cartel" className="transition-colors hover:text-marigold-600">
            Cartel
          </Link>
          {/* changes-1.md §6 — distinct treatment: larger, all-caps, bold. */}
          <Link
            href="/jan-pramaan"
            className="text-base font-bold uppercase tracking-wide text-indigo-700 transition-colors hover:text-marigold-600"
          >
            Jan-Pramaan
          </Link>
        </nav>
        <Link
          href="/sign-in"
          className="inline-flex items-center justify-center rounded-md border-2 border-ink-950/15 px-4 py-2 text-sm font-semibold text-ink-950 transition-all duration-[250ms] hover:-translate-y-0.5 hover:border-ink-950"
        >
          Sign in
        </Link>
      </div>

      {/* Mobile nav panel — changes-4.md §9. Same nav set as desktop, plus
          sign-in/portal access. Auto-closes on link click / route change. */}
      <div
        className={`grid overflow-hidden transition-[grid-template-rows] duration-[250ms] md:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden border-b border-ink-950/10 bg-paper">
          <nav className="mx-auto flex max-w-dashboard flex-col gap-1 px-4 py-3 text-sm font-semibold text-ink-950/70 sm:px-6">
            <Link
              href="/projects"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2.5 transition-colors hover:bg-ink-950/5 hover:text-marigold-600"
            >
              Projects
            </Link>
            <Link
              href="/mp-allocations"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2.5 transition-colors hover:bg-ink-950/5 hover:text-marigold-600"
            >
              MP Allocations
            </Link>
            <Link
              href="/contractors"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2.5 transition-colors hover:bg-ink-950/5 hover:text-marigold-600"
            >
              Contractors
            </Link>
            <Link
              href="/cartel"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2.5 transition-colors hover:bg-ink-950/5 hover:text-marigold-600"
            >
              Cartel
            </Link>
            {/* changes-1.md §6 — distinct treatment: larger, all-caps, bold. */}
            <Link
              href="/jan-pramaan"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2.5 text-base font-bold uppercase tracking-wide text-indigo-700 transition-colors hover:bg-ink-950/5 hover:text-marigold-600"
            >
              Jan-Pramaan
            </Link>
            <Link
              href="/sign-in"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-md border-2 border-ink-950/15 px-4 py-2 text-sm font-semibold text-ink-950 transition-all duration-[250ms] hover:-translate-y-0.5 hover:border-ink-950"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
