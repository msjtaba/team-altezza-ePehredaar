# Changes-2.md
## ePehredaar — Change Requests (Round 2)

**Companion documents:** `prd.md`, `trd.md`, `data.md`, `changes.md` (Round 1)
**Context:** this round addresses two problems found after the Round 1 changes were reviewed — (1) the National Overview Dashboard's visuals don't match the rest of the site, and it still has no real dashboard elements on it, and (2) the Contractor Collusion page from Round 1 (§8) still hasn't been built. It also introduces a shared component library so problem (1) doesn't recur on future pages.

---

## 1. Adopt Untitled UI React as the Shared Design System

**Why this is the fix for the theme mismatch:** the National Overview Dashboard looking out of place is a symptom of pages being styled ad hoc rather than pulling from one shared set of design tokens and components. Standardizing on a single component library resolves this at the root, not just for this one page.

- [x] **Integrate Untitled UI React** (`https://www.untitledui.com/react`) into the Next.js app, following their official Next.js integration guide (`https://www.untitledui.com/react/integrations/nextjs`):
  - Install via their CLI (`npx untitledui@latest init --nextjs`) or manually add the package set + `theme.css` + `globals.css` setup as documented.
  - This brings in their full design-token system (color scales, typography scale, spacing, radius, shadows) plus a `RouteProvider` (wired to Next.js navigation) and a `ThemeProvider` (light/dark mode support via `next-themes`).
  - It is built on **Tailwind CSS + React Aria**, which lines up with the TRD's existing choice of Tailwind CSS — this is additive, not a stack change.
  - **Build note:** the official CLI (`npx untitledui@latest init --nextjs`) was tried first; it runs, but Untitled UI React v8 (the current published version) generates a Tailwind **v4** CSS-first setup (`@theme` in CSS, no `tailwind.config.js`), while this app is pinned to Tailwind **v3.4** with a locked, extensive custom token system (design.md §12). Adopting the CLI's output verbatim would have meant migrating the whole app off Tailwind v3, far outside this task's scope. Fell back to the manual-wiring path the brief allows: added `react-aria-components`, `next-themes`, `clsx`, `tailwind-merge`, `class-variance-authority` as real dependencies; added a `brand` color scale (derived from `#E08A2E`) and Untitled UI's shadow scale to `tailwind.config.ts`; added the `.recharts-surface` outline-removal rule from their `theme.css` to `globals.css`; and hand-built the `RouteProvider`/`ThemeProvider` wiring plus a small `src/components/untitled-ui/` primitive set (Card, Badge, MetricCard, ChartCard, ThemeToggle) matching Untitled UI's component patterns on top of Tailwind v3.
- [x] **Re-theme to match brand:** during setup, set the brand color to whatever ePehredaar's primary color is (the CLI asks for this directly), so the component library's "brand" tokens map onto the site's actual palette rather than Untitled UI's default purple. (Brand color: `#E08A2E`, matching the existing `marigold-600` token — see `tailwind.config.ts`'s new `brand` scale.)
- [x] **Use their component set as the baseline for all dashboard-style UI going forward** — cards, badges, buttons, inputs, tables, and (notably) chart containers. Their `theme.css` already includes Recharts-specific styling overrides (`.recharts-surface` outline removal), which lines up with the TRD's existing choice of **Recharts** for charts — so no charting library change is needed, just wrap Recharts output in Untitled UI's card/chart component patterns instead of ad hoc containers.
- [ ] **Retrofit existing pages, not just the dashboard:** deliberately deferred — out of scope for this task per an explicit scoping decision (time constraints ahead of the demo). Only the Ministry Overview dashboard and the Collusion page were moved onto the new Untitled UI component set; Projects, MP Allocation, Jan-Pramaan, DM portal, and Contractor portal keep their existing styling untouched.
- [x] **TRD note:** this should be added to `trd.md`'s technology stack table as the frontend component/design-system layer, sitting alongside the existing Tailwind CSS entry.

---

## 2. National Overview Dashboard — Add the Actual Dashboard Elements

Round 1 (§2) asked for this section to exist; it still doesn't have real content. This item finishes that work, now built with Untitled UI components per §1 above so it matches the rest of the site from the start.

- [x] **KPI/metric card row** (top section, unchanged from Round 1 intent) — rebuild using Untitled UI's metric/stat card component pattern for consistent styling: card with a label, a large figure, and a small trend indicator (up/down arrow + %) where applicable. Confirmed card: **"Allocated Limit for Hon'ble MPs"** (clickable → MP Allocation page). Remaining cards per PRD §4.5: Total Funds Sanctioned, Total Utilized (%), Total Parked/Unspent, Active High-Risk Alerts, Projects Completed vs. Delayed. (The MP-allocation card wasn't actually wired as a link before this pass — added the `/mp-allocations` click-through while restyling it onto `MetricCard`.)
- [x] **Chart/visualization section** (below the KPI row) — build out each of the following, per PRD §4.5, using Recharts wrapped in Untitled UI card containers:
  - National risk/utilization **map** (states shaded by risk or utilization %, click-through to state drill-down).
  - **Fund Utilization Trend** line chart (sanctioned / spent / parked over the last 12 months).
  - **Alert Breakdown by Type** chart (pie or bar — Cost Anomalies, Duplicates/Smurfing, Cartel Flags, Image Forensics, Jan-Pramaan Disputes).
  - **Top 10 risk rankings** — two lists/tables: highest-risk districts, highest-risk contractors (each linking through to its profile/detail page).
  - **Project status funnel** (Sanctioned → Tendered → Awarded → In Progress → Completed → Citizen-Verified → Payment Released).
  - **Recent national activity feed** — a low-emphasis scrolling list of recent events, styled quietly so it doesn't compete with the charts above it.
  - (All of the above already existed with real data-wiring going into this task — see `src/app/ministry/page.tsx` + `src/components/ministry/*.tsx`. This pass restyled each onto the Untitled UI `Card`/`ChartCard`/`MetricCard` pattern; no data or business logic changed.)
- [x] **Data source:** per `data.md`'s data approach — use real MP allocation data wherever a metric can be derived from it; use fake data (matching the same structure) for anything else (12-month trend history, alert-breakdown counts, etc.), consistent with the rule already established for this dashboard. (Unchanged by this pass — already correct.)

---

## 3. Contractor Collusion Page — Still Missing, Build Now

This was already requested in Round 1 (§8) and confirmed again as missing. Re-stating with the added styling direction:

- [x] Build the page per PRD §4.6 — the fixed 3-contractor demonstration scenario (node/edge graph), side panel on node click showing that contractor's connections, and a plain-language alert card summarizing the collusion risk. (Already existed going into this task — `src/app/dm/audit/collusion/[id]/page.tsx` + `src/components/dm/collusion-graph.tsx` — this pass only restyled its chrome, see below.)
- [x] Use the graph approach already scoped in `trd.md` (§2, "Collusion graph" row) — a custom lightweight SVG component, since it's only ever rendering one fixed 3-node/2-edge scenario. No new graph library needed. (Unchanged — the SVG node/edge drawing code in `collusion-graph.tsx` was not touched.)
- [x] **Style it using the same Untitled UI component set as the rest of the site** (§1) — the graph itself stays custom SVG, but the surrounding page chrome (card containers, the alert summary banner, badges on nodes, the side detail panel) should use Untitled UI components so this page doesn't end up visually disconnected the way the dashboard did. (Page-level card containers + the alert banner now use `Card`/`CardBanner`/`UuiBadge`; the side "Bidder Detail" panel's chrome uses the new `Card` styling — its risk badge stays the locked `healthy`/`watch`/`flagged` `Badge` since that's a semantic, not decorative, choice per design.md §3.3.)
- [x] **Prioritize readability and transparency** (carried over from Round 1): a judge or non-technical viewer should understand the collusion pattern at a glance — favor clear labeling and a calm, readable layout over visual density. (Unchanged — the plain-language sentence-style labeling in the alert banner and side panel was preserved as-is.)
- [x] Reached from the DM Dashboard's Alerts Inbox → Financial & Procurement tab, by clicking the relevant collusion alert (per PRD §4.6) — confirm this navigation path is wired up once the page exists. (Confirmed — `src/components/dm/alerts-inbox-client.tsx`'s "View collusion graph →" link on `cartel_collusion` alerts routes to this page.)

---

## 4. Open Items / Things to Confirm Before Build

1. **Brand color for Untitled UI setup** — confirm ePehredaar's primary/brand color (hex value) so the CLI setup step in §1 maps it correctly, rather than defaulting to Untitled UI's stock purple.
2. **Dark mode** — Untitled UI ships dark mode support out of the box (§1). Confirm whether ePehredaar should offer a dark mode toggle, or whether the site should stay light-mode-only for now (in which case the dark mode setup can be skipped to save time).
3. **Scope of the "retrofit existing pages" item** — confirm whether this should happen now (before the demo) or after, given time constraints; it's the most time-consuming item in this round since it touches every page already built, not just the dashboard.
