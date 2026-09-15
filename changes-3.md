# Changes-3.md
## ePehredaar — Change Requests (Round 3)

**Companion documents:** `prd.md`, `trd.md`, `data.md`, `changes.md` (Round 1), `changes-2.md` (Round 2)
**Context:** Round 2's dashboard-theme and Collusion-page items weren't actually resolved — this round re-states them with harder detail (a concrete reference image for the Collusion page, and an explicit rule for dashboard data syncing), and adds several new items: a unified sign-in/sign-up flow, two new sample projects, and a new Contractors page.

---

## 1. National Overview Dashboard — Theme Consistency (Re-stated, More Specific)

- [x] The dashboard currently does **not** visually match the Projects page, MP Allocation page, or Jan-Pramaan page. This needs to be fixed directly — same card style, same color tokens, same spacing/typography as those three pages (i.e., whatever design system those pages are already using consistently — see `changes-2.md` §1 if the Untitled UI integration is in progress, otherwise just match the existing shared look of those three pages exactly).
- [x] Treat this as a hard visual QA pass: place the dashboard side-by-side with the Projects page and MP Allocation page and confirm card backgrounds, border radii, shadows, font weights, and color usage all match before calling this done.

## 2. National Overview Dashboard — Data Must Sync With `data.md`

- [x] Currently the dashboard's numbers are **not linked** to real data — this needs to change so every figure that *can* be derived from `data.md` actually is, live, rather than being a disconnected placeholder.
- [x] Concrete example: the **"Allocated Limit for Hon'ble MPs"** KPI card must show the actual sum of all 543 MP allocations from `data.md` — **₹8,335.21 Crore** — not a made-up number. If this card currently shows anything else, that's the bug to fix.
- [x] Same rule for any other dashboard figure that has a real-data source: total projects, total sanctioned amount, etc. should be computed from the real projects in `data.md` (Osmania University, Grand Meadows — see §5 — plus the original 4 sample projects), combined with fake data only where `data.md` has no real figure to draw from (per the data approach already established in `prd.md` §6).
- [x] This is the same "real where provided, fake where not" rule already governing the rest of the app — the dashboard just needs to actually follow it instead of showing static mock numbers.

## 3. National Overview Dashboard — Confirmed Element List

Building on `changes-2.md` §2, here is the confirmed, final set of dashboard elements (no more ambiguity about "whatever's essential" — this is the list):

- [x] KPI cards (top row)
- [x] **Funds Utilization by State**
- [x] **State Drill-Down** (interacts with the choropleth map below — clicking/selecting a state surfaces its detail)
- [x] **Fund Utilization Trend** (line chart)
- [x] **Alert Breakdown by Type**
- [x] **High-Risk Contractors** (ranked list)
- [x] **High-Risk Districts** (ranked list)
- [x] **Project Status Funnel**
- [x] **Choropleth map — this is the most important piece to get right:**
  - Hovering over any state on the map must show that state's data — don't just shade the state, surface the actual numbers.
  - On hover, a **small floating tooltip window** appears near the cursor/state, showing the **state's name** and its key details (suggested: total allocated amount, number of MPs, utilization %, and/or risk level — whichever subset is available from real or fake data per §2's data rule).
  - This hover tooltip is the main interaction for this map — clicking can still drive the State Drill-Down panel, but hover must work as its own lightweight preview independent of clicking.

---

## 4. Unified Sign-In / Sign-Up Flow

- [x] **Theme:** the sign-in page must match the same design language as the Projects page, MP Allocation page, etc. (same rule as §1 — no separately-styled auth page).
- [x] **One common sign-in page** for everyone — Contractor, DM, or any other role. The person enters email + password; the system determines their role from those credentials and routes them to the correct portal (Contractor Portal or DM Portal) after login. No role selector needed at sign-in time.
- [x] **Sign-up entry point:** on the same sign-in page, include a **"Sign Up"** button with a short line of text (e.g. *"New here? Create an account."*) — standard pattern, but must be present.
- [x] **Sign-up role selection:** clicking Sign Up reveals two buttons to choose which kind of account to create — **"Sign up as Contractor"** / **"Sign up as District Magistrate"** — and the form fields below change depending on which is selected:
  - **Contractor sign-up fields:** Company Name, Registration Number, GST Number, PAN Number, Phone, Email, Password (per the `contractors` table in `trd.md` §5.3).
  - **DM sign-up fields:** Full Name, District (dropdown — should list all districts, consistent with `changes.md` §4's "all districts" filter requirement), Email, Password (per the `users` table in `trd.md` §5.1).
- [x] Existing sample logins (`changes.md` §9.1, §9.2) should still work through this unified page — this is a UI/flow consolidation, not a change to the underlying accounts.

---

## 5. New / Updated Sample Projects

### 5.1 Move the Osmania University Project Pin

- [x] The Osmania University project (`changes.md` §9.3) currently pins to a generic campus location. Move it specifically to the **College of Engineering building**, since that's where the hackathon is being hosted (and where the live Jan-Pramaan QR demo will physically happen).
- [x] Updated coordinates: **17.4110° N, 78.5290° E** (Osmania University main campus, Amberpet/Tarnaka, Hyderabad — the University College of Engineering sits within this campus). Adjust slightly if a more precise building-level pin is available once on-site.
- [x] All other fields for this project (title, cost, MP, contractor assignment, etc.) stay as already defined in `changes.md` §9.3.

### 5.2 New Project — "Grand Meadows"

Added purely for live testing purposes, per the location shared: `https://maps.app.goo.gl/199wPpSvg8cSvidB7`, which resolves to **17.343425° N, 78.402552° E** — in the Attapur/Rajendranagar area of Hyderabad, within the **Chevella** Lok Sabha constituency (listed as "CHELVELLA" in `data.md`, MP: Konda Vishweshwar Reddy, allocated ₹23.37 Cr — a real figure from the MP allocation table).

| Field | Value |
|---|---|
| Title | Development of Community Open Space and Walking Track at Grand Meadows, Attapur, Hyderabad |
| Status | Completed (opens detail panel; available for Jan-Pramaan QR testing) |
| Sanctioned Cost | ₹18,75,000 (fake) |
| MP | Konda Vishweshwar Reddy (real — from `data.md`) |
| Constituency | Chelvella (real — matches `data.md`'s spelling) |
| Work ID | GM-2025-041 (fake) |
| Sanction Date | 2 Sep 2025 (fake) |
| Latitude / Longitude | 17.343425, 78.402552 (real, from the provided Maps link) |
| Contractor Assigned | Deccan Builders & Co. (ties to the unverified sample contractor from `changes.md` §9.1 — deliberately using the *unverified* one here, so this project can double as a demo of what an unverified-contractor project looks like) |
| Payment Timeline | 1 installment — 15 Feb 2026, ₹18.75 L, Payment Success (fake) |

This project should behave exactly like the other completed sample projects (detail panel with satellite map, contractor name shown, etc. per `changes.md` §4).

---

## 6. Cartel & Collusion Surveillance Page — Build to Match Reference

A reference screenshot was provided (titled "Cartel & Collusion Surveillance") — this is now the concrete target layout, replacing the more general description in `prd.md` §4.6 and `changes.md`/`changes-2.md`. Structure, top to bottom:

- [x] **Header:** Page title **"Cartel & Collusion Surveillance"** (bold, but per the site-wide title-weight reduction in `changes.md` §1, don't over-bold it) with a subtitle underneath in lighter weight: *"Network graph mapping indirect infrastructure connections to expose bid rigging and shadow cartels."* Top-right of the header: a **"Jump to node..."** search input and an **"All Network Nodes"** filter dropdown.
- [x] **Collusion Layers row:** a labeled row ("Collusion Layers:") of toggle-able filter chips, each with a small colored dot: **IP Clusters**, **Shared Directors**, **Address Overlaps**, **PDF Metadata**, **Bank Channels**. These act as filters on which relationship/edge types are visible in the graph below.
- [x] **Main graph panel (left, wider column):**
  - Header row inside the panel: entity/link count (e.g. "14 Entities · 13 Inter-Links") on the left, and a legend on the right — **Vendor** (blue circle), **Director** (green square), **Asset** (orange triangle).
  - The graph itself: nodes as circles/squares/triangles per the legend, connected by labeled edges (e.g. "Common Managing Director," "Shared IP Address," "Matching Tender PDF Fingerprint," "Identical Registered Address," "Shared Signatory Director," "Same Bank Account Credentials"). Suspicious/flagged links render in red; a selected node gets a dashed highlight ring.
  - Footer bar inside the panel: helper text **"Click any node to inspect collusion footprint"** on the left, and a small algorithm label **"Louvain Community Detection"** on the right (this is a labeling/flavor detail only — no real clustering algorithm needs to run, consistent with the TRD's fixed-scenario approach; it's just copy that makes the demo read as more sophisticated).
- [x] **Right sidebar, top panel — "Cartel Clusters Detected":** an alert-styled panel (light red/warning background) listing each detected cluster by name, its member entities, and what they share. See §6.1 for the two clusters to use.
- [x] **Right sidebar, bottom panel — "Inspected Node":** appears/updates when a node is clicked. Shows:
  - A small role tag (e.g. "vendor") top-right.
  - The entity's name (large, bold) and a short ID (e.g. "#v1").
  - A **Trust Score** stat (e.g. "28 / 100") and **GSTIN**, in a bordered stat box.
  - **Linked Entities** list — each linked node's name/role and its own short ID.
  - Three action buttons: **"View Timestamps,"** **"Vendor Profile ↗,"** and **"Inspect Dossier →"** (the last one should link through to that vendor's entry in the Parliamentary Works & Audit Dossiers module, per `prd.md` §4.7 — ties the collusion graph into the existing audit-dossier feature rather than being an island).

### 6.1 Sample Data for This Page

The reference image shows two clusters (14 entities, 13 links total). Recommended sample scenario — deliberately reusing existing sample contractors so this page ties into the rest of the demo instead of introducing disconnected names:

**Cluster A — "Hyderabad Ring"** (ties to the Contractor Portal sample accounts from `changes.md` §9.1):
- **Sri Balaji Infra Projects** (real sample contractor — the *verified* one)
- **Deccan Builders & Co.** (real sample contractor — the *unverified* one, also assigned to the new Grand Meadows project per §5.2)
- **Charminar Civil Works** (new fake shell company, added just for this cluster)
- Shared signals: a common Managing Director, a shared registered address, and a matching tender PDF fingerprint (metadata match) between two of the three.

**Cluster B — "Chevella Ring"** (loosely ties to the Grand Meadows project's constituency for narrative consistency):
- **Musi Valley Constructions** (new fake company)
- **Ranga Reddy Roadways** (new fake company)
- Shared signals: same bank account credentials, same registered phone number, and a shared signatory director.

Trust scores, GSTINs, IPs, and other node-level details can follow the same style as the reference image (fake but formatted realistically — e.g. a GSTIN-shaped string, an IP-shaped string).

---

## 7. New Page — Contractors

- [x] A new top-level page listing **all contractors** (both the two sample accounts from `changes.md` §9.1 and any others in the system).
- [x] Each contractor shown as a card in a list/grid.
- [x] Clicking a contractor's card opens their detail view (can reuse the same public contractor-profile structure already scoped in `prd.md` §4.1) — showing a **Verified** or **Unverified** badge prominently, plus their project history, and (where applicable) Trust Score.

---

## 8. Header Navigation — Final Set

The header/top navigation should show exactly these five items, in this order:

1. **Projects**
2. **MP Allocation**
3. **Contractors** (new — §7)
4. **Cartel** (the Cartel & Collusion Surveillance page — §6)
5. **JAN PRAMAAN** (styled per `changes.md` §6 — larger, bold, all caps)

---

## 9. Open Items / Things to Confirm Before Build

1. **National Overview Dashboard's place in navigation:** it's not in the 5-item list in §8, which implies it's reached via the logo/site name (as the homepage), not a nav tab. Confirm this is correct — if a dedicated "Dashboard" or "Home" nav item is wanted instead, the header list needs a 6th item.
2. **Choropleth tooltip content:** §3 suggests total allocated amount, MP count, utilization %, and risk level as candidate fields for the hover tooltip — confirm the final subset, since showing too many fields in a small floating window will hurt readability.
3. **Collusion page sample data scope:** §6.1 proposes a 2-cluster, ~7-entity scenario reusing existing contractor names. This is a step up from the single 3-node scenario originally scoped in `prd.md` §4.6 — confirm this expanded version is worth the extra build time before the demo, versus keeping the simpler original scenario but with the new page layout.
4. **Contractor/DM sign-up data persistence:** confirm whether accounts created through the new sign-up flow during the demo need to actually persist (real signups), or whether the sign-up flow just needs to be demonstrable without needing to survive a page refresh.

**Resolved before build:** (1) dashboard stays homepage-only, no 6th nav item; (2) tooltip shows all four fields (allocated amount, MP count, utilization %, risk level); (3) built the expanded 2-cluster/~7-entity scenario; (4) sign-up is demo-only, no persistence.
