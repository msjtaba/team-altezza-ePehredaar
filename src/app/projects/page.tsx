import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { PersuadeNav } from "@/components/site/persuade-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { ProjectFilters } from "@/components/project-filters";
import { ProjectKpis } from "@/components/project-kpis";
import { ProjectsGrid } from "@/components/projects-grid";
import { isStageCompletedOrLater } from "@/lib/enums";
import type { DrawerProject } from "@/components/project-drawer";

/**
 * Projects tab (changes-1.md §4) — the old homepage's tender/project
 * listing, moved here. Order top-to-bottom per the spec: shrunk pull-quote,
 * KPI boxes, filters, project grid. The marketing hero and the "one
 * dataset, five honest views" section are both removed entirely (not
 * carried over), per §1/§4.
 */

// changes-1.md §4 / §10: demo-only ordering — Owaisi's projects first, then
// D M Kathir Anand's, then everyone else. A literal comparator, not a
// general "featured" system; flagged in the report as one-off, not
// permanent product behavior.
const FEATURED_MP_ORDER = ["Asaduddin Owaisi", "D M Kathir Anand"];
function featuredRank(mpName: string): number {
  const idx = FEATURED_MP_ORDER.indexOf(mpName);
  return idx === -1 ? FEATURED_MP_ORDER.length : idx;
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const get = (key: string) => {
    const v = params[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const [projects, allMps, allDistricts, openAlerts] = await Promise.all([
    prisma.project.findMany({
      include: {
        mp: true,
        district: true,
        assignedContractor: true,
        payments: { orderBy: { paidAt: "asc" } },
      },
    }),
    // Full seeded MP list (543 records) — not just the ~10 projects' MPs —
    // per changes-1.md §4's "list all states" / dynamic-MP-dropdown spec.
    prisma.mp.findMany({ select: { name: true, state: true } }),
    // Full seeded district list — the District table's own extent is the
    // complete "all districts" set available in this dataset.
    prisma.district.findMany({ select: { name: true, state: true } }),
    prisma.alert.findMany({ where: { status: "open" }, select: { projectId: true } }),
  ]);

  const stateFilter = get("state");
  const districtFilter = get("district");
  const mpFilter = get("mp");
  const categoryFilter = get("category");
  const statusFilter = get("status");

  const filteredProjects = projects
    .filter((p) => {
      if (stateFilter && p.district.state !== stateFilter) return false;
      if (districtFilter && p.district.name !== districtFilter) return false;
      if (mpFilter && p.mp.name !== mpFilter) return false;
      if (categoryFilter && p.category !== categoryFilter) return false;
      if (statusFilter && p.status !== statusFilter) return false;
      return true;
    })
    .sort((a, b) => featuredRank(a.mp.name) - featuredRank(b.mp.name));

  // Full lists for filter dropdowns, independent of what the 10 seeded
  // projects happen to touch.
  const uniqueStates = Array.from(new Set(allMps.map((m) => m.state))).sort();
  const uniqueDistricts = Array.from(new Set(allDistricts.map((d) => d.name))).sort();
  const mpsByState: Record<string, string[]> = {};
  for (const mp of allMps) {
    (mpsByState[mp.state] ??= []).push(mp.name);
  }
  for (const state of Object.keys(mpsByState)) mpsByState[state].sort();

  // KPI scope: state-selection dynamic (changes-1.md §4) — falls back to
  // the national (all-projects) figure when no state is chosen, regardless
  // of the other filters (district/MP/category/status), which only affect
  // the list below.
  const kpiScope = stateFilter ? projects.filter((p) => p.district.state === stateFilter) : projects;
  const scopeLabel = stateFilter ?? "National";

  const completedCount = kpiScope.filter((p) => isStageCompletedOrLater(p.status)).length;
  const inProgressCount = kpiScope.filter((p) => p.status === "in_progress").length;
  const incompleteCount = kpiScope.length - completedCount - inProgressCount;
  const sanctionedTotal = kpiScope.reduce((s, p) => s + Number(p.sanctionedAmount.toString()), 0);
  const paidTotal = kpiScope.reduce((s, p) => s + Number(p.billedAmount.toString()), 0);
  const kpiProjectIds = new Set(kpiScope.map((p) => p.id));
  const openAlertCount = new Set(
    openAlerts.filter((a) => a.projectId && kpiProjectIds.has(a.projectId)).map((a) => a.projectId)
  ).size;

  const drawerProjects: DrawerProject[] = filteredProjects.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    status: p.status,
    sanctionedAmount: p.sanctionedAmount.toString(),
    mp: { name: p.mp.name },
    district: { name: p.district.name, state: p.district.state },
    contractorName: p.assignedContractor?.companyName ?? null,
    latitude: p.latitude,
    longitude: p.longitude,
    payments: p.payments.map((pay) => ({
      id: pay.id,
      amount: pay.amount.toString(),
      paidAt: pay.paidAt.toISOString(),
      status: pay.status,
    })),
  }));

  return (
    <main className="font-body">
      <PersuadeNav />

      <div className="mx-auto max-w-dashboard px-4 py-10 sm:px-6 sm:py-14">
        {/* Pull-quote — kept per changes-1.md §4, but shrunk from the old
            hero-scale treatment (text-3xl/4xl) to a modest opening line. */}
        <p className="max-w-2xl font-serif text-base italic leading-snug text-ink-950/70 sm:text-lg">
          &ldquo;Every rupee has a route. Every project has a ground truth.&rdquo;
        </p>

        <h1 className="mt-4 font-display text-3xl tracking-tight text-ink-950 sm:text-4xl">
          PROJECTS
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-950/60 sm:text-base">
          Every sanctioned MPLADS project in this build, real and
          structurally-matched sample records alike.
        </p>

        <div className="mt-8">
          <ProjectKpis
            scopeLabel={scopeLabel}
            completedCount={completedCount}
            inProgressCount={inProgressCount}
            incompleteCount={incompleteCount}
            totalCount={kpiScope.length}
            sanctionedTotal={sanctionedTotal}
            paidTotal={paidTotal}
            openAlertCount={openAlertCount}
          />
        </div>

        <div className="mt-8">
          <Suspense fallback={null}>
            <ProjectFilters states={uniqueStates} districts={uniqueDistricts} mpsByState={mpsByState} />
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
          <ProjectsGrid projects={drawerProjects} />
        )}
      </div>

      <SiteFooter
        disclaimer="MP fund allocation figures are real, sourced from the official MPLADS allocation list. Alert scores and other sample fields shown elsewhere in this prototype are illustrative — no detection model runs live in this build."
      />
    </main>
  );
}
