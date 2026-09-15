# implementation.md — Build Plan
## MPLADS AI Watchdog — Prototype

Structured as GSD-style phases (per `/gsd`'s discuss→plan→execute→verify model) with Superpowers-style discipline per phase (`/super-power`: brainstorm→plan→TDD→review→finish). This is the execution plan; product scope lives in `prd.md`, architecture in `trd.md`, design system in `design.md`. Status tracking lives in `tracker.md` — this file is the plan, that file is the live state.

---

## 0. Build philosophy for this prototype

- **One monolith, phased by audience-readiness, not by technical layer.** Each phase should leave the product in a demoable state for at least one full audience, per `trd.md` §1's monolith rationale.
- **Schema and seed data come before UI.** Every phase below assumes the Prisma schema (`trd.md` §5) and seed script (`trd.md` §6) exist first — building screens against mock JSON and then rewiring to Prisma later is out of scope for a prototype timeline.
- **Verification-before-completion applies per phase** (Superpowers discipline): a phase isn't "done" because the code compiles, it's done when the specific demoable outcome for that phase is actually clickable in a browser.
- **`is_real_data` is seeded once, correctly, and never revisited per-component.** Get the seed script right in Phase 1; every later phase just queries normally.

---

## 1. Phase breakdown

### Phase 1 — Foundation (schema, seed, design tokens)
**Goal:** an empty but structurally correct app that can be seeded and reset to a known demo state.

- Scaffold Next.js 14 App Router + TypeScript + Tailwind v4 + shadcn/ui, per `design.md` §12.
- Implement the full Prisma schema from `trd.md` §5 (all 15 tables/views).
- Define design tokens once, centrally: color scale (`design.md` §3), type scale (§4), radius scale (§5) as Tailwind theme extensions / CSS variables — every later phase consumes these, never redefines them.
- Load `next/font` for Inter + IBM Plex Mono.
- Build the idempotent seed script (`trd.md` §6): parse `data.md`'s 543 MP records + 4 project examples first (`is_real_data = true`), then generate fake-but-structurally-matched records to reach each module's stated counts (audit dossiers, KYC examples, collusion scenario, alerts).
- Decide and implement the Sr. No. 108 gap (brain.md §8) — pick fake-fill or "not available in source" once, seed it that way.
- NextAuth.js credentials/OTP provider wired, role enum on `users`, route-level middleware skeleton for `/contractor/*`, `/dm/*`, `/ministry`.

**Demoable outcome:** `npm run seed` populates a real Postgres instance; an empty-shell app with working auth and a role-correct redirect exists, no real pages yet.

---

### Phase 2 — Public surface (the audience with no login)
**Goal:** anyone can open the site and understand the product without an account.

- `/` — Tender/Project Listing, filterable by State/District/MP/Category/Status.
- `/projects/[id]` — Individual Project Page with the public Status Tracker (Sanctioned→Payment Released), and the **completed-opens-a-card / incomplete-does-not** interaction rule from `data.md` §2 applied exactly as specified.
- `/contractors/[id]` — Contractor Public Profile: KYC badge, project counts, star-rating Trust Score (never a number), full bid/win history across MPs/districts.
- The MP Fund Allocation list (543 real rows) as a dedicated searchable/filterable **list** view — per `data.md` §1's explicit instruction, not a chart.
- Persuade-mode visual treatment per `design.md` §7.

**Demoable outcome:** a citizen can browse tenders, open a completed project's payment timeline, check a contractor's public trust profile, and search the full real MP allocation list — all with zero auth.

---

### Phase 3 — Jan-Pramaan (public + mobile-web surfaces only)
**Goal:** demonstrate the citizen-verification loop end to end on the surfaces actually in scope (desktop read-only + mobile-web capture — **not** the standalone app, which stays documentation-only per `prd.md` §4.3.3).

- `/jan-pramaan/[id]` desktop: status banner (Awaiting/Verified/Disputed) + consensus meter (count + thumbs split, no photo detail — brain.md §3 rule 5).
- Mobile-web: geofence-gated "Verify This Project" button (`navigator.geolocation`, 50m check client-side), QR scan (`html5-qrcode`), camera-only capture (`<input capture="environment">`, no gallery picker), thumbs up/down, submit.
- Photo storage per `trd.md` §1: seeded demo photos as static assets; any live-captured demo photo stored as base64 in `jan_pramaan_submissions.photo_url`.
- QR generation (`qrcode.react`) gated strictly on `project.status === 'completed'`.
- The reassuring, slightly-more-expressive confirmation motion from `design.md` §6.1 lives here.

**Demoable outcome:** on a phone, near a (spoofed-for-demo) project location, a full scan→capture→submit flow works and visibly updates the consensus meter.

---

### Phase 4 — Contractor portal
**Goal:** a contractor can register, get represented as KYC-verified (not executed live), bid, and track their work.

- `/contractor/*`: signup/login, unverified-by-default state, "Place Bid" gated on `kyc_status = verified`.
- Bidding: price quote + timeline + supporting-docs field (static path/placeholder, no upload service, per `trd.md` §5.4).
- My Bids (submitted/under_review/won/lost) and My Projects with the milestone tracker (Sanctioned→Started→In Process→Completed→Citizen-Verified→Paid) and per-milestone payment status (pending/released/frozen — the "Smart Escrow" field that isn't a real payment flow).
- Trust Score visibility (illustrative number, contractor-only view — public only ever sees stars).
- Grievance/Dispute panel: submission routes to the relevant DM, status open/resolved/rejected.
- Operate-mode visual treatment per `design.md` §7.

**Demoable outcome:** log in as a seeded verified contractor, place a bid on an open tender, see it move through status, and view a milestone tracker on an awarded project.

---

### Phase 5 — DM Dashboard
**Goal:** the single busiest surface in the product — a District Magistrate can triage everything in their jurisdiction.

- `/dm/*` Overview: stat cards (real where derivable, sample elsewhere), risk heatmap, 10-event activity feed, quick-jump to high-priority alerts.
- Alerts Inbox, all 4 tabs (Financial/Procurement, Image Forensics, Jan-Pramaan, Fund/Timeline) with tab-appropriate actions, risk-% badges, priority sort (frozen payments float to top), shared filter (Project/Contractor/Date) and shared Approval History.
- Approvals/Audit Log table (Project, Alert Type, Decision, Justification, DM, Timestamp) — this is where brain.md §3 rule 3 gets enforced in code.
- Projects tab (DM-only sections: Jan-Pramaan photo gallery, full alert history) and Contractors tab (sortable by Trust Score, flag history).
- Fund Tracker: `@nivo/sankey` Ministry→State→District→Contractor, plus the parked-funds aging report table.
- `/dm/audit/collusion/[id]` — the one hardcoded collusion scenario, reached only by clicking the relevant Financial/Procurement alert (never a standalone nav item).

**Demoable outcome:** a DM can land on Overview, drill into a flagged alert in any of the 4 tabs, approve/reject with a justification note, and see that decision reflected in the Audit Log — plus open the one collusion graph scenario from its alert.

---

### Phase 6 — Ministry / National Overview + Audit Dossiers
**Goal:** the top-of-the-product "so what" view, and the searchable dossier index.

- `/ministry`: KPI strip (Sanctioned/Utilized/Parked/Alerts/Completed-vs-Delayed), India choropleth (`react-simple-maps`), 12-month trend + alert-breakdown charts (Recharts), top-10 risk districts/contractors, project-status funnel, low-emphasis activity feed. Real MP allocation data drives whatever's derivable; sample data fills 12-month trend history and alert-breakdown counts (per `prd.md` §4.5).
- Audit Dossiers index: grid/table toggle, summary stat cards, search (case ID/title/district/contractor), filters (category/risk/district), sort-by-risk, color-coded risk badges (red ≥70/yellow 40–70/green <25), billed-vs-sanctioned progress indicator.

**Demoable outcome:** the Ministry landing page tells a complete national story at a glance, with working state drill-down and a fully searchable dossier index behind it.

---

### Phase 7 — Cross-cutting polish + verification pass
**Goal:** the product reads as *one* product, not six separately-built surfaces.

- Run `design.md`'s locked systems as an actual audit, not just a reference: Color Consistency Lock, Shape Consistency Lock, risk-triad consistency across every module that shows it (brain.md §3 rule 2).
- `prefers-reduced-motion` and `prefers-color-scheme` pass across all surfaces (`design.md` §6.3, §11).
- Accessibility pass: contrast (`design.md` §10), color-plus-text/icon pairing on every status signal, keyboard nav on every form including the Jan-Pramaan flow's non-camera controls.
- Copy self-audit (`design.md` §9) — every visible string re-read once, end to end.
- Cross-role consistency check: open the same project as public visitor, contractor, and DM in three tabs — confirm the status/stage value and any shared fields genuinely match (brain.md §3 rule 1).

**Demoable outcome:** the product is ready to walk a stakeholder through start to finish without a single visible inconsistency.

---

## 2. Route map (from `trd.md` §3, restated for phase traceability)

```
/                         Phase 2   Public: tender/project listing
/projects/[id]            Phase 2   Public: project detail + timeline
/contractors/[id]         Phase 2   Public: contractor profile
/jan-pramaan/[id]         Phase 3   Public + mobile web
/contractor/*             Phase 4   Authenticated contractor portal
/dm/*                     Phase 5   Authenticated DM dashboard
/ministry                 Phase 6   Authenticated ministry overview
/dm/audit/collusion/[id]  Phase 5   DM-only, alert-linked only
```

## 3. What each phase must NOT do

Carried from `prd.md` §9 / `trd.md` §8 — repeated here because it's easy to accidentally scope-creep a prototype toward these:

- No real model inference, no vector search, no graph-algorithm service (Phase 5's collusion graph is hand-drawn SVG, fixed data).
- No real Aadhaar/PAN+GST integration (Phase 4's KYC is a pre-assigned badge).
- No document/proof upload service, no standalone citizen app (Phase 3 stops at mobile-web).
- No payment gateway/escrow integration (Phase 4's milestone payment_status is a field, not a flow).
- No object storage (Phase 3's photos are static assets or base64, per `trd.md` §1).

## 4. Dependency notes

- Phase 3 (Jan-Pramaan) depends on Phase 2's project detail page existing (status banner lives there) and on Phase 1's photo-storage decision.
- Phase 5 (DM) depends on Phase 3 (photo gallery pulls from Jan-Pramaan submissions) and Phase 4 (contractor flag history).
- Phase 6 (Ministry) can start in parallel with Phase 5 once Phase 1's seed data exists — they share no UI, only the underlying real MP allocation dataset.
- Phase 7 cannot start meaningfully until Phases 2–6 are all in a demoable state — it's a cross-cutting pass, not a feature phase.

Live status per phase: see [tracker.md](tracker.md).
