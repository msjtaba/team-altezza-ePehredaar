"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { KycBadge } from "@/components/contractor/kyc-badge";

// Operate-mode top nav (design.md §7) — Inter/navy, ≤150ms color-only
// transitions on the active link, no hover-lift/scale (that's Persuade-only,
// design.md §6.2).
const links = [
  { href: "/contractor", label: "Dashboard" },
  { href: "/contractor/bids", label: "My Bids" },
  { href: "/contractor/projects", label: "My Projects" },
  { href: "/contractor/grievances", label: "Grievances" },
];

export function PortalNav({
  companyName,
  kycStatus,
}: {
  companyName: string;
  kycStatus: string;
}) {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-dashboard flex-wrap items-center justify-between gap-4 px-6 py-3">
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/contractor" className="text-base font-semibold text-navy-950">
            MPLADS Watchdog{" "}
            <span className="font-normal text-slate-400">· Contractor Portal</span>
          </Link>
          <nav className="flex items-center gap-1">
            {links.map((l) => {
              const active = l.href === "/contractor" ? pathname === l.href : pathname.startsWith(l.href);
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
            <p className="text-sm font-medium text-navy-950">{companyName}</p>
            <div className="mt-0.5">
              <KycBadge status={kycStatus} />
            </div>
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
