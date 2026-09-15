"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { KycBadge } from "@/components/contractor/kyc-badge";

// changes-6.md §1 — Persuade-mode top nav (paper/ink, marigold accent,
// Anton wordmark), matching the shared theme used by `PersuadeNav` on the
// public site. This stays its own component rather than reusing
// `PersuadeNav` — it's an in-portal nav (Dashboard/My Bids/My
// Projects/Grievances + sign-out) serving a different purpose than the
// site-wide marketing header, just recolored/refonted to match it.
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
    <header className="sticky top-0 z-50 border-b border-ink-950/10 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-dashboard flex-wrap items-center justify-between gap-4 px-6 py-3">
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/contractor" className="font-display text-base tracking-wide text-ink-950">
            ePehredaar{" "}
            <span className="font-body text-sm font-normal text-ink-950/50">
              · Contractor Portal
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {links.map((l) => {
              const active = l.href === "/contractor" ? pathname === l.href : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors duration-[250ms] ${
                    active
                      ? "bg-marigold-100 text-ink-950"
                      : "text-ink-950/60 hover:bg-ink-950/5 hover:text-marigold-600"
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
            <p className="text-sm font-medium text-ink-950">{companyName}</p>
            <div className="mt-0.5">
              <KycBadge status={kycStatus} />
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/sign-in" })}
            className="rounded-md border-2 border-ink-950/15 px-3 py-1.5 text-sm font-semibold text-ink-950 transition-colors duration-[250ms] hover:border-ink-950"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
