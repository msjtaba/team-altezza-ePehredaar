# MPLADS AI Watchdog — Prototype

An oversight-layer prototype for India's MPLADS scheme — five role-based views (public, citizen verifier, contractor, District Magistrate, Ministry) over one shared fund/project dataset, with a demonstration (not live) fraud-alert and citizen-verification layer.

## Document map

**Source of truth (product/tech/data — read these to understand *what* is being built):**
- [prd.md](prd.md) — product requirements, features, roles
- [trd.md](trd.md) — architecture, stack, database schema
- [data.md](data.md) — real reference data (543 MPs' fund allocations, real project examples)

**Planning & design (generated from the above — read these to understand *how* it gets built):**
- [brain.md](brain.md) — synthesized project context: the cross-cutting rules, module inventory, real-vs-illustrative data map. Start here.
- [design.md](design.md) — brand identity, color system, typography, motion, and component rules
- [implementation.md](implementation.md) — phased build plan with dependencies and route map
- [tracker.md](tracker.md) — live status: phase progress, open decisions, risks. The only file that should change without a corresponding plan change.

## Quick facts

- **Brand color:** Watchtower Navy `#1E3A5F` (single accent — see [design.md](design.md) §3)
- **Risk system:** three-tier, locked — Healthy (green) / Watch (amber) / Flagged (red), never decorative
- **Type:** Inter (UI) + IBM Plex Mono (technical/tabular) — see [design.md](design.md) §4
- **Stack:** Next.js 14 + TypeScript + Tailwind + shadcn/ui + Prisma/PostgreSQL — see [trd.md](trd.md) §2
- **Current status:** Phase 1 scaffolded, homepage built for design review — see [tracker.md](tracker.md)

## Running the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Full stack is wired up: Prisma/SQLite (seeded — `npm run seed`), NextAuth (see `tracker.md` for demo logins), and all seven build phases from `implementation.md` are complete — public site, Jan-Pramaan, Contractor portal, DM Dashboard, and Ministry Overview.

# team-altezza-ePehredaar
