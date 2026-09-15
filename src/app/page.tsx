import {
  Users,
  Camera,
  HardHat,
  Scales,
  ChartLineUp,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/components/project-card";
import { ProjectFilters } from "@/components/project-filters";

// Real figures from data.md §1 — used here, not sample data (brain.md §4).
const MP_COUNT = "543";
const TOTAL_ALLOCATED_CR = "₹8,335.21 Cr";
const STATES_COVERED = "28";

const STAT_TICKER = [
  `${MP_COUNT} Members of Parliament monitored`,
  `${TOTAL_ALLOCATED_CR} allocated nationally`,
  `${STATES_COVERED} states & union territories`,
  "5 role-based views, 1 shared truth",
  "3-tier risk system — Healthy · Watch · Flagged",
];

const AUDIENCES = [
  {
    name: "Citizens",
    desc: "Browse every tender and project in your area — no login needed.",
    icon: Users,
    accent: "marigold" as const,
  },
  {
    name: "Citizen Verifiers",
    desc: "Scan, photograph, and confirm a completed project from your phone.",
    icon: Camera,
    accent: "teal" as const,
  },
  {
    name: "Contractors",
    desc: "Bid on open tenders and track your Trust Score and payments.",
    icon: HardHat,
    accent: "indigo" as const,
  },
  {
    name: "District Magistrates",
    desc: "Triage alerts, approve payments, and audit every flagged project.",
    icon: Scales,
    accent: "marigold" as const,
  },
  {
    name: "Ministry",
    desc: "See fund utilization and risk hotspots across every state.",
    icon: ChartLineUp,
    accent: "teal" as const,
  },
] as const;

const ACCENT_STYLES = {
  marigold: {
    chip: "bg-marigold-100 text-marigold-600",
    ring: "group-hover:border-marigold-600",
  },
  teal: {
    chip: "bg-teal-100 text-teal-700",
    ring: "group-hover:border-teal-700",
  },
  indigo: {
    chip: "bg-indigo-500/10 text-indigo-700",
    ring: "group-hover:border-indigo-700",
  },
};

// Simple, confident, hand-drawn constellation motif — the one place this
// product hand-rolls decorative SVG (design.md §12 exception clause).
function Constellation() {
  const dots = [
    { x: 40, y: 60, r: 3, d: "0s" },
    { x: 140, y: 30, r: 2, d: "0.8s" },
    { x: 220, y: 110, r: 4, d: "1.6s" },
    { x: 310, y: 50, r: 2.5, d: "0.4s" },
    { x: 380, y: 140, r: 3, d: "1.2s" },
    { x: 90, y: 170, r: 2, d: "2s" },
    { x: 260, y: 190, r: 3.5, d: "0.6s" },
  ];
  const lines = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [0, 5],
    [2, 6],
  ];
  return (
    <svg
      viewBox="0 0 420 220"
      className="h-full w-full opacity-60"
      aria-hidden="true"
    >
      {lines.map(([a, b], i) => (
        <line
          key={i}
          x1={dots[a].x}
          y1={dots[a].y}
          x2={dots[b].x}
          y2={dots[b].y}
          stroke="#F0A73C"
          strokeOpacity="0.25"
          strokeWidth="1"
        />
      ))}
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.r}
          fill="#F0A73C"
          className="animate-drift"
          style={{ animationDelay: d.d, transformOrigin: `${d.x}px ${d.y}px` }}
        />
      ))}
    </svg>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const get = (key: string) => {
    const v = params[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const projects = await prisma.project.findMany({
    include: { mp: true, district: true },
    orderBy: { sanctionDate: "desc" },
  });

  const stateFilter = get("state");
  const districtFilter = get("district");
  const mpFilter = get("mp");
  const categoryFilter = get("category");
  const statusFilter = get("status");

  const filteredProjects = projects.filter((p) => {
    if (stateFilter && p.district.state !== stateFilter) return false;
    if (districtFilter && p.district.name !== districtFilter) return false;
    if (mpFilter && p.mp.name !== mpFilter) return false;
    if (categoryFilter && p.category !== categoryFilter) return false;
    if (statusFilter && p.status !== statusFilter) return false;
    return true;
  });

  const uniqueStates = Array.from(new Set(projects.map((p) => p.district.state))).sort();
  const uniqueDistricts = Array.from(new Set(projects.map((p) => p.district.name))).sort();
  const uniqueMps = Array.from(new Set(projects.map((p) => p.mp.name))).sort();

  return (
    <main className="font-body">
      {/* Nav — sticky, translucent on scroll */}
      <header className="sticky top-0 z-50 border-b border-ink-950/10 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-dashboard items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
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
            <span className="font-display text-lg tracking-wide text-ink-950">
              WATCHDOG
            </span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-ink-950/70 md:flex">
            <a href="/#projects" className="transition-colors hover:text-marigold-600">
              Projects
            </a>
            {/* TODO: no public contractor index page in Phase 2 scope (per
                implementation.md's route map) — anchoring to the project
                listing until a /contractors index exists. */}
            <a href="/#projects" className="transition-colors hover:text-marigold-600">
              Contractors
            </a>
            <a href="/mp-allocations" className="transition-colors hover:text-marigold-600">
              MP Allocations
            </a>
            <a href="#" className="transition-colors hover:text-marigold-600">
              Jan-Pramaan
            </a>
          </nav>
          <Button variant="outline-paper" className="px-4 py-2 text-sm">
            Sign in
          </Button>
        </div>
      </header>

      {/* Hero — full viewport, dark editorial, Anton display + Playfair accent */}
      <section className="relative flex min-h-[calc(100dvh-73px)] flex-col justify-center overflow-hidden bg-ink-950">
        {/* Ambient gradient wash */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 75% 20%, rgba(38,49,122,0.55), transparent 60%), radial-gradient(ellipse 50% 40% at 15% 85%, rgba(224,138,46,0.12), transparent 60%)",
          }}
        />
        <div className="pointer-events-none absolute right-[4%] top-[12%] h-[220px] w-[420px] max-w-[50vw]">
          <Constellation />
        </div>

        <div className="relative mx-auto w-full max-w-dashboard px-6 py-24">
          <div className="max-w-3xl">
            <p className="font-serif text-xl italic text-marigold-400 md:text-2xl">
              A watch kept in the open.
            </p>
            <h1 className="mt-4 font-display text-6xl leading-[0.95] tracking-tight text-paper md:text-8xl">
              SEE WHERE
              <br />
              THE MONEY WENT.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/70">
              An oversight layer for MPLADS funds — cross-checking every
              claim against citizen-verified evidence, project by project,
              district by district.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#projects">
                <Button variant="marigold" className="px-7 py-3.5 text-base">
                  View open tenders
                  <ArrowRight className="ml-2" size={18} weight="bold" />
                </Button>
              </a>
              <Button
                variant="outline-paper"
                className="border-paper/25 px-7 py-3.5 text-base text-paper hover:border-paper"
              >
                How verification works
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-drift text-paper/40">
          <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
            <rect
              x="1"
              y="1"
              width="18"
              height="26"
              rx="9"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="10" cy="9" r="2" fill="currentColor" />
          </svg>
        </div>
      </section>

      {/* Stat marquee — one per page (design.md §6.3) */}
      <section className="overflow-hidden border-b border-ink-950/10 bg-paper-2 py-5">
        <div className="marquee-fade flex whitespace-nowrap">
          <div className="flex animate-marquee items-center gap-12 pr-12">
            {[...STAT_TICKER, ...STAT_TICKER].map((s, i) => (
              <span
                key={i}
                className="flex items-center gap-3 font-serif text-lg italic text-ink-950/70"
              >
                {s}
                <span className="text-marigold-600">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Tender/Project Listing — prd.md §4.1, implementation.md Phase 2 */}
      <section id="projects" className="border-b border-ink-950/10 scroll-mt-20">
        <div className="mx-auto max-w-dashboard px-6 py-24">
          <Reveal>
            <p className="font-serif text-xl italic text-teal-700">Open the ledger</p>
            <h2 className="mt-2 font-display text-4xl tracking-tight text-ink-950 md:text-5xl">
              TENDERS &amp; PROJECTS
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-950/70">
              Every sanctioned MPLADS project in this build, real and
              structurally-matched sample records alike — filterable by
              State, District, MP, Category, and Status.
            </p>
          </Reveal>

          <div className="mt-8">
            <Suspense fallback={null}>
              <ProjectFilters states={uniqueStates} districts={uniqueDistricts} mps={uniqueMps} />
            </Suspense>
          </div>

          <p className="mt-6 text-sm text-ink-950/50">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>

          {filteredProjects.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-ink-950/15 bg-paper-2 p-12 text-center text-ink-950/50">
              No projects match these filters.
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(i, 6) * 60}>
                  <ProjectCard
                    project={{
                      id: p.id,
                      title: p.title,
                      category: p.category,
                      status: p.status,
                      sanctionedAmount: p.sanctionedAmount.toString(),
                      mp: { name: p.mp.name },
                      district: { name: p.district.name, state: p.district.state },
                    }}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Five audiences — interactive hover cards */}
      <section className="border-b border-ink-950/10">
        <div className="mx-auto max-w-dashboard px-6 py-24">
          <Reveal>
            <h2 className="font-display text-4xl tracking-tight text-ink-950 md:text-5xl">
              ONE DATASET, FIVE HONEST VIEWS
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-950/70">
              Every role sees the same underlying project and fund data —
              scoped to exactly what they need, nothing they shouldn&apos;t.
            </p>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {AUDIENCES.map((a, i) => {
              const Icon = a.icon;
              const accent = ACCENT_STYLES[a.accent];
              return (
                <Reveal key={a.name} delay={i * 80}>
                  <div
                    className={`group h-full rounded-lg border-2 border-transparent bg-paper-2 p-7 transition-all duration-[300ms] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-ink-950/5 ${accent.ring}`}
                  >
                    <span
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${accent.chip}`}
                    >
                      <Icon size={24} weight="bold" />
                    </span>
                    <h3 className="mt-5 font-display text-xl tracking-wide text-ink-950">
                      {a.name.toUpperCase()}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-950/65">
                      {a.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission pull-quote — Playfair italic, editorial */}
      <section className="border-b border-ink-950/10 bg-paper-2">
        <div className="mx-auto max-w-3xl px-6 py-28 text-center">
          <Reveal>
            <p className="font-serif text-3xl italic leading-snug text-ink-950 md:text-4xl">
              &ldquo;Every rupee has a route. Every project has a ground
              truth. This is what it looks like when both are visible —
              to a citizen, a contractor, and a magistrate, all at once.&rdquo;
            </p>
          </Reveal>
        </div>
      </section>

      {/* Risk system legend — dark band for contrast, still functionally locked */}
      <section className="bg-ink-950">
        <div className="mx-auto max-w-dashboard px-6 py-20">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight text-paper md:text-4xl">
              ONE RISK SYSTEM, EVERYWHERE
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-paper/60">
              Every alert, dossier, and project card uses the same
              three-tier scale — never a color without the number next to
              it.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Badge tier="healthy">Healthy · risk 12%</Badge>
              <Badge tier="watch">Watch · risk 54%</Badge>
              <Badge tier="flagged">Flagged · risk 81%</Badge>
              <Badge tier="stage">Stage: In Progress</Badge>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="bg-ink-950">
        <div className="mx-auto max-w-dashboard px-6 py-10 text-xs leading-relaxed text-paper/40">
          <p>
            MP fund allocation figures are real, sourced from the official
            MPLADS allocation list. Alert scores, Trust Scores, and
            Jan-Pramaan consensus data shown elsewhere in this prototype are
            illustrative sample data — no detection model runs live in this
            build.
          </p>
        </div>
      </footer>
    </main>
  );
}
