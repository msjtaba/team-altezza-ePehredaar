# ePehredaar MPLADS AI Watchdog — Prototype

An oversight-layer prototype for India's MPLADS scheme — five role-based views (public, citizen verifier, contractor, District Magistrate, Ministry) over one shared fund/project dataset, with a demonstration (not live) fraud-alert and citizen-verification layer.

## Document map

All planning/reference docs live under [markdownDocs/](markdownDocs/); round-by-round change requests live under [markdownDocs/changesDocs/](markdownDocs/changesDocs/).

**Source of truth (product/tech/data — read these to understand *what* is being built):**
- [prd.md](markdownDocs/prd.md) — product requirements, features, roles
- [trd.md](markdownDocs/trd.md) — architecture, stack, database schema
- [data.md](markdownDocs/data.md) — real reference data (543 MPs' fund allocations, real project examples)

**Planning & design (generated from the above — read these to understand *how* it gets built):**
- [brain.md](markdownDocs/brain.md) — synthesized project context: the cross-cutting rules, module inventory, real-vs-illustrative data map. Start here.
- [design.md](markdownDocs/design.md) — brand identity, color system, typography, motion, and component rules
- [implementation.md](markdownDocs/implementation.md) — phased build plan with dependencies and route map
- [tracker.md](markdownDocs/tracker.md) — live status: phase progress, open decisions, risks. The only file that should change without a corresponding plan change.

**Change requests (round-by-round):**
- [markdownDocs/changesDocs/](markdownDocs/changesDocs/) — `changes-1.md` through `changes-6.md`

## Quick facts

- **Brand color:** Watchtower Navy `#1E3A5F` (single accent — see [design.md](markdownDocs/design.md) §3)
- **Risk system:** three-tier, locked — Healthy (green) / Watch (amber) / Flagged (red), never decorative
- **Type:** Inter (UI) + IBM Plex Mono (technical/tabular) — see [design.md](markdownDocs/design.md) §4
- **Stack:** Next.js 14 + TypeScript + Tailwind + shadcn/ui + Prisma/PostgreSQL — see [trd.md](markdownDocs/trd.md) §2
- **Current status:** Phase 1 scaffolded, homepage built for design review — see [tracker.md](markdownDocs/tracker.md)

## Running the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Full stack is wired up: Prisma/SQLite (seeded — `npm run seed`), NextAuth (see `markdownDocs/tracker.md` for demo logins), and all seven build phases from `markdownDocs/implementation.md` are complete — public site, Jan-Pramaan, Contractor portal, DM Dashboard, and Ministry Overview.

# team-altezza-ePehredaar
