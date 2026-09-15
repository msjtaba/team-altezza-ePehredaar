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
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-dashboard flex-wrap items-center justify-between gap-4 px-6 py-3">
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/dm" className="text-base font-semibold text-navy-950">
            MPLADS Watchdog <span className="font-normal text-slate-400">· DM Dashboard</span>
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
                      ? "bg-navy-100 text-navy-900"
                      : "text-slate-600 hover:bg-navy-50 hover:text-navy-900"
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
            <p className="text-sm font-medium text-navy-950">{name}</p>
            <p className="mt-0.5 text-xs text-slate-500">
              District Magistrate{district ? ` · ${district}` : ""}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/sign-in" })}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-100"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
