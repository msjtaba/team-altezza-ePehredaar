import Link from "next/link";
import type { ReactNode } from "react";

const SITE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/mp-allocations", label: "MP Allocations" },
  { href: "/contractors", label: "Contractors" },
  { href: "/cartel", label: "Cartel" },
  { href: "/jan-pramaan", label: "Jan-Pramaan" },
];

const LEGAL_LINKS = [
  { href: "/sitemap", label: "Sitemap" },
  { href: "/privacy", label: "Privacy Policy" },
];

/**
 * Shared dark footer for every Persuade-mode public page. Each page kept
 * its own hand-written data-provenance disclaimer paragraph before this
 * component existed (real-vs-illustrative notes) — that copy is now passed
 * in as `disclaimer` so it's preserved per page, with the same dark
 * ink-950 band, site-wide nav links, and the new Sitemap/Privacy Policy
 * links added underneath.
 */
export function SiteFooter({ disclaimer }: { disclaimer?: ReactNode }) {
  return (
    <footer className="border-t border-ink-950/10 bg-ink-950">
      <div className="mx-auto max-w-dashboard px-4 py-10 sm:px-6">
        {disclaimer && (
          <p className="text-xs leading-relaxed text-paper/40">{disclaimer}</p>
        )}

        <div
          className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-paper/60 ${
            disclaimer ? "mt-6 border-t border-paper/10 pt-6" : ""
          }`}
        >
          {SITE_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-marigold-400">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-paper/10 pt-4 text-xs text-paper/40">
          <p>© {new Date().getFullYear()} ePehredaar. Prototype build — not a live government system.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="font-medium text-paper/60 transition-colors hover:text-marigold-400">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
