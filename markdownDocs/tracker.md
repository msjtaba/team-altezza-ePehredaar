# tracker.md — Live Status
## MPLADS AI Watchdog — Prototype

This is the *state* file — update it as work happens. It does not restate the plan (`implementation.md`), the design system (`design.md`), or the product context (`brain.md`); it only tracks what's actually done, in progress, or blocked.

**Last updated:** 2026-09-15 — all 7 phases built, integrated, and verified. Prototype is feature-complete per `implementation.md`.

---

## 1. Phase status

| Phase | Status | Notes |
|---|---|---|
| 1 — Foundation (schema, seed, tokens) | ✅ Done (2026-09-15) | Prisma schema (SQLite, see §8), 543-MP + 10-project seed, NextAuth credentials/OTP, route middleware, shared UI (Button/Badge/Reveal), `/sign-in` |
| 2 — Public surface | ✅ Done (2026-09-15) | Real filterable listing on `/`, `/projects/[id]` (with the completed-opens-a-card rule), `/contractors/[id]` (star rating, never raw score), `/mp-allocations` (all 543 real MPs, searchable list, Sr. No. 108 shown as "Not available in source"). |
| 3 — Jan-Pramaan | ✅ Done (2026-09-15) | Responsive `/jan-pramaan/[id]` (desktop consensus view + mobile geofence→QR→camera→vote flow), 3-vote threshold before flipping status, stage-gated QR. See §8 deviation #5 — seed lacked project coordinates, fixed post-hoc. |
| 4 — Contractor portal | ✅ Done (2026-09-15) | Dashboard, KYC-gated bids, milestone-tracked projects, grievance panel. Login: `bharat.infra.developers@example.com` / `password123` (verified) or `uttarayan.roadworks@example.com` (unverified, to see the bid-gate). |
| 5 — DM Dashboard | ✅ Done (2026-09-15) | Overview, 4-tab Alerts Inbox w/ justification-gated server actions, Projects/Contractors tabs, Audit Log, Fund Tracker Sankey, collusion graph, DM-only sections layered onto the public project/contractor pages. Login: `dm@example.com` / `password123`. |
| 6 — Ministry / National Overview | ✅ Done (2026-09-15) | KPI strip, interactive India choropleth w/ table fallback, trend + alert-breakdown charts, top-10 rankings, status funnel, activity feed. Login: `ministry@example.com` / `password123`. |
| 7 — Cross-cutting polish + verification | ✅ Done (2026-09-15) | See §9 for exactly what was checked and what's still open. |

Legend: ⬜ Not started · 🟨 In progress · ✅ Done · 🔴 Blocked

**Demo logins** (password `password123` or OTP `123456`, any account):
- Contractor (KYC verified): `bharat.infra.developers@example.com`
- Contractor (KYC unverified, to see the bid-gate): `uttarayan.roadworks@example.com`
- District Magistrate: `dm@example.com`
- Ministry: `ministry@example.com`

---

## 2. Planning artifacts — status

| Document | Status | Last touched |
|---|---|---|
| `prd.md` | ✅ Draft v1 (source) | pre-existing |
| `trd.md` | ✅ Draft v1 (source) | pre-existing |
| `data.md` | ✅ Real data captured, 2 open gaps (see §4) | pre-existing |
| `brain.md` | ✅ Generated | 2026-09-15 |
| `design.md` | ✅ Generated, v2-amended | 2026-09-15 |
| `implementation.md` | ✅ Generated | 2026-09-15 |
| `tracker.md` | ✅ This file | 2026-09-15 |

---

## 3. Open decisions (resolved 2026-09-15, to unblock Phase 1 build)

| # | Decision | Resolution |
|---|---|---|
| 1 | MP Sr. No. 108 (no source amount) | **"Not available in source"** — seeded as `is_real_data: true`, `allocated_amount: null`. Fake-filling a documented source gap would contradict the honesty principle in brain.md §4; the UI shows it plainly instead. |
| 2 | Remaining public project examples beyond the 4 supplied | Seed the 4 real examples (`is_real_data: true`) + **6 generated fake ones** (`is_real_data: false`), reaching **10 total** — covers the PRD's 5–7 scope for the public listing, and lines up exactly with prd.md §4.7's "10 monitored works" audit-dossier count (one dossier per project, 1:1 per schema). |
| 3 | Light/dark mode | **Light-only for v1**, dark deferred. The editorial dark *sections* already in the homepage (hero, risk-legend band) are a design choice, not a system-wide dark-mode toggle — no `next-themes`/toggle wired yet. |
| 4 | Auth OTP delivery | **Demo-only fixed-OTP bypass** (`123456` accepted for any account). No SMS/email provider integration — out of scope per prd.md §7's "no live KYC" assumption; matches trd.md's Credentials-provider choice. |
| 5 | `trd.md` §5.2's `mps` table has no column for the allocated-amount figure, despite data.md §1 being exactly that dataset — a schema gap in trd.md, not a design choice | Added `allocated_amount Decimal?` to `mps` in `prisma/schema.prisma`, nullable to hold decision #1's gap record. Logged here rather than silently patching trd.md, since trd.md is a fixed source document. |
| 6 | MP dataset transcription check | 543 rows, no duplicate Sr. No.s, only row 108 missing an amount (as documented). Summed total is ₹8,335.28 Cr vs. data.md's stated ₹8,335.21 Cr — a ₹0.07 Cr (~₹7 lakh) gap, almost certainly a single-row rounding slip across 542 hand-transcribed two-decimal values. Not re-verified row-by-row against the source PDF (not worth the effort at this delta); flagged here for anyone reconciling against the original PDF later. |

---

## 4. Data gaps carried from `data.md` §3 — resolved

- [x] Sr. No. 108 amount decision — resolved, see §3 decision #1.
- [x] Fill remaining public project slots with fake records matching the real examples' field structure — resolved, see §3 decision #2.

---

## 5. Risks / watch items

- **Scope creep into "documented, not built" features.** `implementation.md` §3 lists five things explicitly out of scope (real KYC, document upload, standalone app, escrow, live collusion explorer) — none were pulled in during the build; re-check this if any future phase touches those areas.
- **Design-system drift.** `design.md`'s Color/Shape Consistency Locks depend on tokens staying centralized in `tailwind.config.ts`. Phase 7's audit found and fixed one drift instance (5 stray `rounded-sm` swatches in the Ministry map) — re-run the `rounded-*` grep sweep (§9) after any future UI change.
- **Cross-role status desync.** The single-source-of-truth `projects.status` rule (brain.md §3 rule 1) held structurally and at runtime as of Phase 7's audit — re-verify if any future work adds a cached/denormalized copy of project stage anywhere.
- **Postgres migration not yet exercised.** §8's SQLite deviation is designed to be a drop-in swap, but that swap itself has not been tested against a real Postgres instance.

---

## 6. How to update this file

- Flip a phase's status when work actually starts/finishes — not when it's merely planned.
- When an open decision (§3) is resolved, move it to a dated changelog entry below and update the corresponding phase note in `implementation.md` if it changes scope.
- Add new risks to §5 as they're discovered; don't let this file go stale relative to what `implementation.md` assumes.

---

## 7. Changelog

- **2026-09-15** — `brain.md`, `design.md`, `implementation.md`, `tracker.md` generated from `prd.md` + `trd.md` + `data.md`, using `/gsd`-style phase structure, `/super-power`-style plan discipline, and `/taste` + `/impeccable:impeccable` + `/design-motion-principles` for the brand/design system.
- **2026-09-15** — Homepage design pass: lively/interactive/"worldly" Persuade-mode direction (Anton/Playfair Display/Nunito, Civic Editorial palette), scoped to public surfaces only. `design.md` versioned v1 (Operate, unchanged) / v2 (Persuade). See design.md §1 amendment note.
- **2026-09-15** — Phase 1 foundation built: Prisma schema (15 models, mirrors trd.md §5 plus the `mps.allocated_amount` fix), full seed (543 real MPs, 10 projects, 6 contractors, 11 alerts, 10 audit dossiers, 1 collusion scenario, Jan-Pramaan + fund-flow + grievance samples), NextAuth (Credentials + demo-OTP), role-based middleware, shared UI (`Button`, `Badge`, `Reveal`), `/sign-in`.
- **2026-09-15** — Phases 2 (public surface), 4 (contractor portal), and 6 (Ministry overview) built in parallel by three independent agents, each scoped to non-overlapping files/routes. All three landed with clean builds; a follow-up integration build confirmed no conflicts.
- **2026-09-15** — Phase 3 (Jan-Pramaan) built after Phase 2 landed. Surfaced a real Phase 1 gap (no project coordinates seeded) — fixed at the source in `prisma/seed.ts` rather than worked around.
- **2026-09-15** — Phase 5 (DM Dashboard) built after Phases 3 & 4 landed — the largest single phase (Overview, 4-tab Alerts Inbox with justification-gated server actions, Projects/Contractors tabs, Audit Log, Fund Tracker Sankey, collusion graph, DM-only sections layered onto the shared public pages).
- **2026-09-15** — Phase 7 polish/verification pass: full integration rebuild, design-system token-bleed audit (1 fix), cross-role consistency and DM-only visibility boundary both verified at runtime with real authenticated sessions across all three roles (including the OTP login path). See §9.

---

## 8. Deviations from trd.md (logged, not silent)

| # | Deviation | Reason |
|---|---|---|
| 1 | **SQLite instead of PostgreSQL/Supabase/Neon** | No hosted Postgres instance available in this build environment. Every model/relation is identical to what Postgres needs — swapping `datasource.provider` to `"postgresql"` and pointing `DATABASE_URL` at a real instance is the only change required later. |
| 2 | **Enum columns modeled as `String`, not native enums** | SQLite has no enum type. Allowed values are documented per-field in `prisma/schema.prisma` and centralized in `src/lib/enums.ts`. Becomes real Prisma enums on a Postgres migration. |
| 3 | **Prisma pinned to v5**, not latest | Prisma 7 (what `npm install prisma` pulled by default) removed schema-level `datasource.url` in favor of driver adapters — a much larger setup change than this prototype needs. v5 keeps the traditional schema-first flow trd.md assumes. |
| 4 | **Two routes added beyond trd.md §3's route map**: `/sign-in` (shared NextAuth credentials page — trd.md specified the provider but not a page) and `/mp-allocations` (the real 543-MP searchable list data.md §1 explicitly requires, which didn't map to any route trd.md listed) | Both are load-bearing for features the PRD/data.md require; neither contradicts trd.md, just fills a gap it left open. |
| 5 | **Phase 1's seed script never set `Project.latitude`/`longitude`**, discovered when the Phase 3 (Jan-Pramaan) agent tried to test the 50m geofence flow end-to-end and found every project had null coordinates | Patched `prisma/seed.ts`: added lat/lng centers for all 8 seeded districts plus a small deterministic per-project jitter, and re-ran the seed. Rebuilt clean afterward. Districts' centers are real town coordinates; the jitter is cosmetic, not claimed as real site-survey data. |
| 6 | **`fund_flows` seed data only has Ministry→State and State→District legs**, no District→Contractor rows | The DM Fund Tracker's District→Contractor leg is derived display-side from each project's `billedAmount`/`assignedContractor` rather than a seeded row. Noted by the Phase 5 agent rather than silently patched into `prisma/seed.ts`, since it's a display-layer synthesis, not a data-honesty issue (no real or fake figure is misrepresented). |

---

## 9. Phase 7 — what was actually verified

Run 2026-09-15, after all six feature phases landed. Real checks against the running app, not just code review:

**Done and confirmed:**
- Clean production build with all 18 routes, from a fully cleared `.next` (ruling out stale-cache false positives).
- **Design-system audit**: grepped every `rounded-*` class across the app — found and fixed 5 stray `rounded-sm` legend swatches in the Ministry map (design.md's shape lock only allows `md`/`lg`/`full`). Confirmed zero Operate-mode tokens (navy/Inter) leak into Persuade routes and zero Persuade tokens (marigold/teal/ink/paper/Anton/Playfair) leak into Operate routes — including confirming the DM-only sections embedded in the public project/contractor pages deliberately break to Operate styling (navy + `font-sans` + a "DM Only" badge), which is correct, not a bug.
- **Cross-role status consistency** (brain.md §3 rule 1): confirmed structurally — every `status:` usage across the app is a live Prisma query filter or a read of `PROJECT_STAGE_LABELS`, never a hardcoded duplicate label map. Confirmed at runtime — the same project's stage renders identically on its public page.
- **DM-only visibility boundary** (brain.md §3 rule 5): confirmed at runtime with real sessions — the same project URL shows the "DM Only" Jan-Pramaan/alert-history section to an authenticated DM and shows nothing extra to an anonymous visitor.
- **Full auth flow, all three roles, against the real NextAuth endpoint** (not just middleware unit logic): DM, contractor, and ministry all log in and reach their dashboards; confirmed the demo OTP (`123456`) works as an alternate credential, not just the seeded password.
- **Marquee-max-one-per-page**: still exactly one, on the homepage.
- Swept for stray `console.log`/`debugger` (none found) and `TODO`/`FIXME` (one found, disclosed below).

**Known, disclosed gaps (not blockers, just honest about scope):**
- No public contractor *index* page exists — the homepage nav's "Contractors" link points at the project listing with a code comment explaining why (no such page was in any phase's scope; individual contractor profiles are reached via project pages, which does satisfy the PRD).
- No automated accessibility tooling (axe, Lighthouse) was run — contrast/ARIA compliance rests on each phase agent's design.md-guided implementation and manual spot-checks, not a tooled audit.
- Copy self-audit (design.md §9) was spot-checked during review, not re-read string-by-string across all ~18 routes.
- `fund_flows` seed data gap — see §8 deviation #6.
