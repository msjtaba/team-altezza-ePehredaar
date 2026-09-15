"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

// Operate-mode top nav (design.md §7) — Inter/navy, ≤150ms color-only
// transitions on the active link only. prd.md §4.4's exact nav spec:
// Overview · Alerts Inbox · Projects · Contractors · Approvals/Audit Log ·
// Fund Tracker. /dm/audit/collusion/[id] is deliberately NOT listed here —
// prd.md §4.6 requires it be reached only via the collusion alert click.
const links = [
  { href: "/dm", label: "Overview" },
  { href: "/dm/alerts", label: "Alerts Inbox" },
  { href: "/dm/projects", label: "Projects" },
  { href: "/dm/contractors", label: "Contractors" },
  { href: "/dm/audit-log", label: "Approvals / Audit Log" },
  { href: "/dm/funds", label: "Fund Tracker" },
];

export function DmNav({ name, district }: { name: string; district: string | null }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-ink-950/10 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-dashboard flex-wrap items-center justify-between gap-4 px-6 py-3">
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/dm" className="font-display text-base tracking-wide text-ink-950">
            ePehredaar <span className="font-body text-sm font-normal text-ink-950/40">· DM Dashboard</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            {links.map((l) => {
              const active = l.href === "/dm" ? pathname === l.href : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                    active
                      ? "bg-marigold-100 text-marigold-600"
                      : "text-ink-950/60 hover:bg-paper-2 hover:text-marigold-600"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-ink-950">{name}</p>
            <p className="mt-0.5 text-xs text-ink-950/50">
              District Magistrate{district ? ` · ${district}` : ""}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/sign-in" })}
            className="rounded-md border border-ink-950/15 bg-paper px-3 py-1.5 text-sm font-medium text-ink-950/70 transition-colors duration-150 hover:bg-paper-2"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
