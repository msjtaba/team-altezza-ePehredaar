import Link from "next/link";
import { PersuadeNav } from "@/components/site/persuade-nav";
import { SiteFooter } from "@/components/site/site-footer";

type SitemapEntry = {
  href: string;
  label: string;
  description: string;
};

type SitemapSection = {
  title: string;
  note?: string;
  entries: SitemapEntry[];
};

const SECTIONS: SitemapSection[] = [
  {
    title: "Public site",
    note: "Open to everyone, no sign-in required.",
    entries: [
      { href: "/", label: "Home — National Overview Dashboard", description: "National-level MPLADS health: KPI cards, state choropleth, fund utilization trend, alert breakdown, risk rankings, status funnel." },
      { href: "/projects", label: "Projects", description: "Every sanctioned MPLADS project in this build, filterable by state, district, and MP." },
      { href: "/mp-allocations", label: "MP Allocations", description: "The real, 543-MP fund allocation table sourced from the official MPLADS list." },
      { href: "/contractors", label: "Contractors", description: "Every contractor in the system, with KYC status and Trust Score." },
      { href: "/cartel", label: "Cartel & Collusion Surveillance", description: "A fixed demonstration scenario mapping indirect vendor connections to expose bid rigging." },
      { href: "/jan-pramaan", label: "Jan-Pramaan", description: "Citizen verification: a project's citizen-verified status and consensus meter (mobile web adds the capture flow)." },
      { href: "/sign-in", label: "Sign in / Sign up", description: "Unified sign-in for Contractor and District Magistrate accounts." },
    ],
  },
  {
    title: "Contractor Portal",
    note: "Requires a Contractor account.",
    entries: [
      { href: "/contractor", label: "Overview", description: "KYC status and Trust Score for the signed-in contractor." },
      { href: "/contractor/bids", label: "My Bids", description: "Bids placed, tagged submitted / under review / won / lost." },
      { href: "/contractor/projects", label: "My Projects", description: "Awarded projects with a milestone tracker and payment status." },
      { href: "/contractor/grievances", label: "Grievances", description: "File a dispute against an AI-generated flag or a frozen payment." },
    ],
  },
  {
    title: "District Magistrate Portal",
    note: "Requires a District Magistrate account.",
    entries: [
      { href: "/dm", label: "Overview", description: "Stat cards, risk heatmap, and recent activity feed for the DM's jurisdiction." },
      { href: "/dm/alerts", label: "Alerts Inbox", description: "Financial & Procurement, Image Forensics, Jan-Pramaan, and Fund/Timeline alert tabs." },
      { href: "/dm/projects", label: "Projects", description: "All projects in scope, filterable by status and risk." },
      { href: "/dm/contractors", label: "Contractors", description: "Vendor list sortable by Trust Score." },
      { href: "/dm/audit-log", label: "Approvals / Audit Log", description: "Every decision, with justification note, DM name, and timestamp." },
      { href: "/dm/funds", label: "Fund Tracker", description: "Sankey-style Ministry → State → District → Contractor fund flow, plus a parked-funds aging report." },
    ],
  },
  {
    title: "Ministry Portal",
    note: "Requires a Ministry account.",
    entries: [
      { href: "/ministry", label: "Ministry Overview", description: "A second, authenticated national-level dashboard view." },
    ],
  },
  {
    title: "Legal",
    entries: [
      { href: "/sitemap", label: "Sitemap", description: "This page." },
      { href: "/privacy", label: "Privacy Policy", description: "What data this prototype collects and how it's used." },
    ],
  },
];

export const metadata = {
  title: "Sitemap — ePehredaar",
};

export default function SitemapPage() {
  return (
    <main className="font-body">
      <PersuadeNav />

      <div className="mx-auto max-w-dashboard px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="font-display text-3xl tracking-tight text-ink-950 sm:text-4xl">
          SITEMAP
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-950/60 sm:text-base">
          Every page in ePehredaar, grouped by who can reach it. Portal routes redirect to sign-in if you&apos;re not
          logged in with the matching role.
        </p>

        <div className="mt-10 flex flex-col gap-10">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-ink-950/10 pb-2">
                <h2 className="font-display text-lg tracking-wide text-ink-950">{section.title.toUpperCase()}</h2>
                {section.note && <p className="text-xs text-ink-950/45">{section.note}</p>}
              </div>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {section.entries.map((entry) => (
                  <li key={entry.href}>
                    <Link
                      href={entry.href}
                      className="block h-full rounded-lg border border-ink-950/10 bg-paper-2 p-4 transition-all duration-[250ms] hover:-translate-y-0.5 hover:border-marigold-600 hover:shadow-lg hover:shadow-ink-950/5"
                    >
                      <p className="text-sm font-semibold text-ink-950">{entry.label}</p>
                      <p className="mt-1 font-mono text-xs text-marigold-600">{entry.href}</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-ink-950/55">{entry.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
