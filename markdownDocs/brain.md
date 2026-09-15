# brain.md — Project Brain
## MPLADS AI Watchdog — Prototype

Single source of truth synthesizing `prd.md` (product scope), `trd.md` (architecture/stack/schema), and `data.md` (real reference data). Read this first; it does not restate every line of those three, it distills what actually drives design and build decisions.

---

## 1. What this is, in one paragraph

A static/functional prototype of an oversight layer sitting on top of India's MPLADS scheme (₹5 Cr/year per MP for local infrastructure). It does **not** run any real fraud-detection AI — every alert, score, and flag is pre-seeded, illustrative data presented as if a live model produced it. What it *does* demonstrate, for real: how five different audiences (public, citizen verifier, contractor, District Magistrate, Ministry) would each see a role-appropriate slice of the same underlying project/fund data, and how a citizen-verification loop ("Jan-Pramaan") and procurement-fraud alerts would gate payments and drive DM decisions.

**Why it exists:** existing systems (e-SAKSHI, PFMS) track paperwork, not physical reality. This prototype's whole pitch is "here's what it would look like to also track the ground truth."

---

## 2. The five audiences (design for all of them, distinctly)

| Audience | Where they live | What they need to *feel* | Impeccable mode |
|---|---|---|---|
| **Citizen (public, unauthenticated)** | Public site, no login | Transparency, trust, "I can check this myself" | Persuade / Read |
| **Citizen (verifier)** | Mobile web, on-site | Fast, dead-simple, one-thumb | Persuade (task-focused) |
| **Contractor** | Authenticated portal | Fair, legible, "I know exactly where I stand" | Operate |
| **District Magistrate (DM)** | Authenticated dashboard | In-control, fast triage, zero ambiguity on risk | Operate |
| **Ministry / national** | Authenticated dashboard | Commanding overview, credible at a glance | Operate (with a Persuade-grade hero KPI strip) |

This role split is the single biggest driver of the whole product — see [design.md](design.md) §2 for how it's expressed visually, and [implementation.md](implementation.md) §3 for the route map that enforces it.

---

## 3. Non-negotiable cross-cutting rules

These apply everywhere and were called out in the PRD precisely because no single page owns them — treat any violation as a bug, not a design choice:

1. **One project status, one truth.** `projects.status` (`sanctioned → tendered → awarded → in_progress → completed → citizen_verified → payment_released`) is read identically by the public tracker, the contractor's milestone view, the DM's project view, and the Ministry funnel. No view maintains its own copy.
2. **Risk is always three-tier.** Healthy / Watch / Flagged, everywhere a risk level appears — DM heatmap, alert badges, audit dossier cards, collusion graph nodes. Never a fourth tier, never inconsistent color mapping between modules.
3. **Every DM decision is logged.** Approve/reject/escalate/audit always carries a justification note + DM identity + timestamp, and shows up in both the Approvals/Audit Log *and* the per-project/per-contractor history.
4. **Provenance is a data concern, not a display concern.** Every table that can hold real-or-fake data carries `is_real_data`. The UI never needs a "this might be fake" disclaimer baked into a component — but the underlying honesty (real data where supplied, structurally-matched fake data elsewhere) must hold.
5. **Jan-Pramaan photo-level detail is DM-only, always.** Public/citizen views only ever see the aggregate consensus meter (count + thumbs up/down split). This is a hard privacy/security boundary, not a progressive-disclosure UX choice — never build a "see more" path from public into DM detail.
6. **A single thumbs-down never freezes a payment.** Negative consensus requires a minimum threshold (3–5) of independent submissions before it triggers a freeze + DM audit alert.
7. **QR generation is gated.** A project's Jan-Pramaan QR code only exists after the contractor marks it 100% complete. Don't design a state where an in-progress project has a scannable code.

---

## 4. What is real vs. what is illustrative (and why it matters for design)

| Data | Status | Design implication |
|---|---|---|
| MP fund allocation (543 MPs, ₹8,335.21 Cr total) | **Real** — validated against source PDF | Must render as a **searchable/filterable list** (user's explicit instruction — not a chart, not a summary) wherever "Allocated Limit for Hon'ble MPs" is opened |
| 4 public project examples (2 completed, 2 incomplete) | **Real** | Completed projects open a detail card with a payment/installment timeline on click. **Incomplete projects do not open a card at all** — this is a real interaction-pattern rule, not a placeholder gap |
| Audit dossiers, Trust Scores, KYC badges, Jan-Pramaan consensus counts, all Alerts Inbox content, collusion graph scenario | **Illustrative/hardcoded** — no detection engine exists | These need to look *authoritative and precise* (risk %, timestamps, GPS deltas) — precision here isn't dishonest, because every one of these numbers is explicitly documented as sample data at the product-scope level, not fabricated at the display level |

One MP record (Sr. No. 108, Chavan Vasantrao Balwantrao, Nanded) has no source amount — decide once (fake-fill vs. "data not available" label) and apply consistently; don't leave it ambiguous per-page.

---

## 5. Module inventory (from PRD §4, for quick reference)

1. **Public Project & Bidding Page** — tender listing, project detail, public status tracker, contractor public profile (star-rating Trust Score, never a raw number)
2. **Contractor Dashboard** — signup/KYC (represented, not executed), bidding (verified-only), My Bids/My Projects with milestone tracker, Trust Score visibility, grievance panel
3. **Jan-Pramaan** — 4 surfaces (public desktop read-only, mobile-web capture, standalone app *documented only*, DM review inbox) — see rule 5 and 6 above
4. **DM Dashboard** — Overview, Alerts Inbox (4 tabs: Financial/Procurement, Image Forensics, Jan-Pramaan, Fund/Timeline), Approvals/Audit Log, Projects, Contractors, Fund Tracker (Sankey)
5. **Ministry/National Overview** — the main landing page for the ministry role: KPI strip, India choropleth, trend + alert-breakdown charts, top-10 risk rankings, project-status funnel, activity feed
6. **Cartel/Collusion Graph** — one hardcoded 3-node/2-edge scenario, reached only via a DM alert click, never a public or explorable feature
7. **Parliamentary Works & Audit Dossiers** — searchable/filterable dossier index, color-coded risk badges (red ≥70%, yellow ~40–70%, green <25%)

---

## 6. Stack, at a glance (full detail in trd.md)

Next.js 14 (App Router) + TypeScript · Tailwind CSS · TanStack Query · Prisma + PostgreSQL (Supabase/Neon) · NextAuth.js (credentials/OTP) · react-simple-maps (India choropleth) · OpenLayers (project pins + satellite overlay) · Recharts (trend/bar/donut) · @nivo/sankey (Fund Tracker) · custom SVG (collusion graph — deliberately not a graph library) · qrcode.react + html5-qrcode (Jan-Pramaan QR) · native `capture="environment"` file input (camera-only, no gallery). One monolith, one deployable unit, no AI/ML runtime anywhere.

---

## 7. Explicitly out of scope (don't accidentally build these)

Live AI/ML inference of any kind · real Aadhaar/PAN+GST KYC · standalone citizen mobile app · document/proof upload center · national explorable collusion graph · Smart Escrow automated payment release · push notifications/offline sync · any object-storage service (photos are static assets or base64, per TRD §1) · a graph database (the collusion graph is one fixed scenario, drawn by hand).

---

## 8. Open items carried forward

- MP Sr. No. 108 amount: fake-fill or "not available in source" — needs one decision, applied consistently.
- Only 4 of the scoped 5–7 public project examples are supplied; the rest are fake-filled to round out the listing page, same field structure.

See [tracker.md](tracker.md) for how these get resolved and tracked, and [implementation.md](implementation.md) for build sequencing.
