# Product Requirements Document (PRD)
## MPLADS AI Watchdog — Prototype

**Status:** Draft v1
**Document type:** PRD (functional/product scope only — no technology stack, visual/UI design, or database schema included; those are covered in separate documents)
**Companion document:** A separate `data.md` will hold all real/reference data (MP fund allocation figures, project examples, audit dossier records, etc.) referenced by this PRD. This PRD only describes *what* data is needed and *where* it is used, not the data itself.

---

## 1. Overview

MPLADS (Members of Parliament Local Area Development Scheme) allocates ₹5 Crore/year to every MP for local infrastructure. Funds pass through multiple hops — **Ministry → State Nodal Department → District Authorities → Implementing Agencies (contractors)** — and existing systems (e-SAKSHI, PFMS) only track administrative/financial workflow, not physical, on-the-ground reality.

This results in recurring failure modes:
- **Ghost assets** — billed but never built
- **Duplicate billing** for the same underlying project
- **Split-tendering ("smurfing")** to bypass approval thresholds
- **Parked/unspent funds** sitting idle in district accounts

The MPLADS AI Watchdog is proposed as an intelligent oversight layer sitting on top of the existing administrative workflow — one that actively cross-checks claims against physical/citizen-verified evidence, procurement patterns, and spending behavior, and surfaces risk to the people responsible for approving and disbursing funds.

### 1.1 Prototype framing

This PRD describes a **static/functional prototype**, not a production system. The underlying AI/ML detection engine (cost-anomaly models, duplicate-detection, graph/collusion analysis, image forensics) is **not being built**. Every alert, score, flag, or risk percentage the prototype displays is pre-defined sample output, presented as if generated live by such an engine. Real data is used wherever it has been supplied (MP fund allocation, a small set of real projects, audit dossier records); everywhere else, representative sample data is used and is called out as such.

---

## 2. Goals

1. Demonstrate, end-to-end, how an oversight layer would let citizens, contractors, District Magistrates (DMs), and Ministry-level stakeholders each interact with the same underlying fund/project data through a role-appropriate view.
2. Show how citizen-sourced physical verification ("Jan-Pramaan") can be woven into a project's lifecycle and payment gating, without needing the anti-fraud detection logic to actually run.
3. Show how procurement-fraud patterns (duplicate billing, split-tenders, collusion rings, cost anomalies) would be surfaced to a decision-maker, using one fully worked example of each.
4. Provide a believable national/ministry-level and district-level oversight view, built on real MP allocation figures wherever possible.
5. Clearly separate, throughout the product, what is derived from real data versus illustrative sample data, so the prototype is honest about its current state and can guide a future production build.

### 2.1 Non-goals for this prototype
- Building or training any real detection model (isolation forest, semantic/geo matching, graph algorithms, image forensics/pHash, mock-location detection).
- Live KYC/Aadhaar/PAN+GST verification flows.
- A functioning document/proof upload center for contractors.
- A standalone citizen mobile app.
- A live, explorable national collusion graph.
- Automated ("Smart Escrow") payment release.

---

## 3. User Roles / Personas

| Role | Description | Primary needs from the platform |
|---|---|---|
| **Citizen (public, unauthenticated)** | General public, including local residents near a project site | Transparency into how MPLADS funds are spent in their area; ability to physically verify a project is real |
| **Citizen (verifier)** | A citizen physically near a project site, using a mobile browser | Simple, low-friction way to confirm/dispute that a sanctioned project actually exists/was completed as claimed |
| **Contractor (implementing agency)** | Companies that bid on and execute MPLADS-funded works | Discover open tenders, bid, track project/payment status, understand and contest their Trust Score/flags |
| **District Magistrate (DM) / District Authority** | Approves/oversees projects and contractors within a district | Single place to see project health, alerts, contractor risk, fund flow, and audit history for their jurisdiction; ability to act on flags |
| **Ministry / National-level stakeholder** | Oversees MPLADS performance nationally | High-level, visual rollup of fund utilization, risk, and bottlenecks across states/districts, drill-down into hotspots |

---

## 4. Feature Requirements

### 4.1 Public Project & Bidding Page

**Purpose:** Give any member of the public visibility into open tenders and in-progress/completed projects without needing to log in.

**Requirements:**
- **Tender/Project Listing:** List all open tenders, showing project name, location, sanctioned amount, and bid deadline.
  - Filterable by State, District, MP, Project Category, and Status (Open / Bidding Closed / Awarded / In Progress / Completed).
- **Individual Project Page:** For any listed project, show description, sanctioned amount, MP name, sanction date, and location. Only fields present in the source project data should be shown — the platform must not fabricate project-level detail beyond what is provided.
- **Project Timeline / Status Tracker (public, read-only):** A visual progression through the stages **Sanctioned → Tendered → Awarded → In Progress → Marked Complete → Payment Released**, always reflecting the same stage shown in the contractor's own view of that project (single source of truth for status).
- **Contractor Public Profile:** For any contractor, show:
  - Name and a KYC verification badge (Verified / Unverified).
  - Count of projects completed / ongoing / delayed.
  - A simplified public Trust Score, shown as a star rating rather than an exact number (to avoid over-precision on what is, at this stage, illustrative data).
  - A list of all projects the contractor has bid on or won, across MPs and districts — so patterns of regional concentration are visible to any visitor.

### 4.2 Contractor Dashboard (Authenticated Portal)

**Purpose:** Give contractors a self-service portal to register, get verified, bid, and track their work.

**Requirements:**
- **Signup/Login:** Register via email/phone plus password or OTP; capture company name, registration number, and contact details. New accounts start in an `unverified` state — they can browse tenders but cannot place a bid.
- **KYC Verification:**
  - In the prototype, this is represented, not executed: a small set of example contractors are shown pre-assigned a Verified or Unverified badge.
  - For future reference, the intended flow is: verification triggers on first "Place Bid" attempt, uses Aadhaar eKYC with PAN+GST as fallback, is a one-time check reused for all future bids, and shows a clear "Verification required to bid" message on failure.
- **Bidding:** The "Place Bid" action is only available to contractors whose KYC status is verified. A bid submission captures a price quote, a timeline, and supporting documents.
- **Selection & Public Visibility:** Once a contractor is selected, the project's public card updates to show "Awarded to: [Contractor Name]." The public project page also lists every bidder along with their status (Selected / Not Selected / Under Review).
- **Verification Tiers (documented for future scope, not built in prototype):** Beyond basic KYC — GST registration and PAN card checks (which feed the collusion graph), and past-performance certification (which would raise Trust Score).
- **My Bids / My Projects:**
  - A list of the contractor's active bids, each tagged submitted / under review / won / lost.
  - A list of the contractor's ongoing projects, each with a milestone tracker: **Sanctioned → Started → In Process → Completed → Citizen-Verified → Paid**, and a payment status per milestone (conceptually tied to a future "Smart Escrow" capability — not functional in this prototype).
- **Document/Proof Upload Center:** Documented as a concept for a future build; not present in this prototype.
- **Trust Score Visibility:** The contractor can see their own Trust Score (illustrative/sample value in this prototype).
- **Grievance/Dispute Panel:** A channel for a contractor to contest an AI-generated flag or a frozen payment — they upload counter-evidence, and the dispute is routed to the relevant DM.

### 4.3 Jan-Pramaan (Citizen Verification)

**Purpose:** Let citizens physically confirm that a project exists and matches its claimed state, and let a District Magistrate act on that evidence. This is a **standalone product surface**, not a section nested inside the project detail page.

**4.3.1 Jan-Pramaan — Public Website (Desktop)**
- A verification status banner on each project: "Awaiting Citizen Verification" / "✅ Citizen-Verified" / "⚠️ Under Dispute."
- A consensus meter showing only the aggregate result — submission count plus thumbs-up/down split (e.g., "5 submitted — 👍 4 👎 1"). No photo gallery or individual review detail is ever shown publicly; that data is DM-only.
- Desktop is read-only — there is no capture/submission action here.

**4.3.2 Jan-Pramaan — Mobile Web**
- Shows the same status banner and consensus meter as desktop.
- Adds a **"Verify This Project"** action, enabled only when the citizen's device is within a 50-meter geofence of the project site.
- Verification flow: scan/confirm a QR code → capture a photo (camera capture only — no photo-library upload) → give a thumbs up/down → submit.

**4.3.3 Jan-Pramaan — Standalone App (Citizen-only)** *(documented for context; not built in this prototype)*
- **Home/Nearby Projects tab:** map or list of nearby projects awaiting verification, with distance, status, and time-since-sanction.
- **Scan tab:** native QR scanner that pulls up the matching project and re-checks the geofence before allowing capture.
- **Capture flow:** native camera, capture-only; captures live GPS silently and checks for mock-location apps; the server-received timestamp is treated as the source of truth (not the device clock); thumbs up/down plus an optional note; submissions made offline are cached with a "Saved — will submit when connected" state.
- **My Contributions tab:** the citizen's own submission history and its outcome, plus a reputation/"Trusted Verifier" badge over time.
- **Notifications tab:** alerts when a citizen's submission is counted toward consensus, and alerts about new nearby projects awaiting verification.
- **Offline Queue Indicator:** a persistent banner showing any submissions still waiting to sync.

**4.3.4 Jan-Pramaan — DM Review Inbox (private)**
- Full photo gallery for each project (never shown publicly).
- Per photo: device and server timestamps, GPS deviation from the sanctioned site, mock-location flag, thumbs up/down, an anonymized citizen ID, and a duplicate-image (pHash) check result.
- A side-by-side comparison view of contractor-submitted photos versus citizen-submitted photos.
- A satellite map overlay comparing the sanctioned site pin against the GPS pins of submitted photos.
- Available actions: **Approve / Reject / Request Physical Audit**, each requiring a written justification note.

**4.3.5 Rules governing Jan-Pramaan (apply across all surfaces)**
- The site QR code is only generated/made available **after** the contractor marks the project 100% Complete.
- Anti-spoofing intent (for future/full build, not necessarily active in this static prototype): capture-only upload prevents reuse of old or edited photos; live GPS plus mock-location detection at capture time prevents fake-GPS spoofing (device clock/EXIF metadata alone is not trusted); the server-received timestamp is cross-checked against the device-reported time.
- **Negative consensus rule:** a single thumbs-down never freezes a payment. Freezing (and a DM audit alert) only triggers once a minimum threshold of independent citizen submissions (e.g., 3–5) reports a negative result, weighted by photo authenticity and citizen reputation.

### 4.4 DM (District Magistrate) Dashboard

**Purpose:** Give a District Magistrate a single working view of every project, alert, and contractor in their jurisdiction, and the tools to act on flagged issues.

**Navigation:** Overview · Alerts Inbox · Projects · Contractors · Approvals/Audit Log · Fund Tracker

**4.4.1 Overview (landing page)**
- Top stat cards: total projects (active/completed), total funds (sanctioned/utilized/parked), open alerts count, pending approvals count. These should be calculated from real data wherever the underlying data supports it; otherwise sample values are used.
- A risk heatmap of projects, categorized by risk level (healthy / watch / flagged).
- A recent activity feed showing the last 10 events, read-only.
- A quick-jump call to action surfacing the count of high-priority alerts needing action, linking directly to the Alerts Inbox.

**4.4.2 Alerts Inbox** — tabbed by source; all alert content in this prototype is sample/hardcoded, since the detection engine itself is not built.

- **Tab A — Financial & Procurement Alerts:** covers Cost Anomaly (invoice far exceeds the district's expected baseline), Duplicate Project (a new submission closely matches an existing project both semantically and geographically), Split-Tender (multiple similarly-sized, similarly-worded submissions from the same contractor on the same day, seemingly structured to stay under an approval threshold), and Cartel/Collusion (multiple bidders sharing registered contact/identity metadata). Available actions: Approve with Justification / Initiate Audit.
- **Tab B — Image Forensics Alerts:** covers GPS Mismatch (submitted photo's location is implausibly far from the site), Duplicate Image (photo matches one already used elsewhere), and Timestamp Anomaly (photo is dated before the claimed completion date). Available actions: Approve / Reject / Request Physical Audit.
- **Tab C — Jan-Pramaan Verification Alerts:** sub-filterable by Pending Review / Negative Consensus Reached / Mock-Location Flagged; mirrors the structure of the DM Review Inbox described in 4.3.4. Available actions: Approve / Reject / Request Physical Audit.
- **Tab D — Fund/Timeline Alerts:** covers Parked Funds (sanctioned money unspent beyond a defined period) and Stalled Project (no milestone progress beyond the expected timeline). Available actions: Send Reminder / Escalate to State Authority.
- **Shared behavior across all tabs:** every alert carries a risk-percentage badge; alerts are priority-sorted so that frozen payments float to the top; alerts can be filtered by Project, Contractor, or Date; and every tab shares a common Approval History trail.

**4.4.3 Approvals/Audit Log**
- A table recording, per decision: Project, Alert Type, Decision (Approved / Rejected / Audit Triggered), Justification note, DM name, and Timestamp.
- Use real data where it exists; sample data elsewhere.
- Optionally, an aggregate-only public-facing summary can be shown (e.g., "42 alerts, 38 resolved, 4 under audit"), without exposing case-level detail.

**4.4.4 Projects Tab**
- All projects within the DM's jurisdiction, filterable by status and risk level.
- Clicking through leads to the same detail structure shown publicly, plus DM-only sections (the Jan-Pramaan photo gallery and the full alert history for that project).

**4.4.5 Contractors Tab**
- A list of vendors, sortable by Trust Score.
- Clicking through leads to the public contractor profile, plus DM-only flag history and the collusion graph (see 4.6) where relevant.

**4.4.6 Fund Tracker**
- A Sankey-style visualization of fund flow: Ministry → State → District → Contractor.
- An aging report table listing parked funds: amount, and how long they have been idle.
- Use real data where provided; sample data elsewhere.

### 4.5 Ministry / National Overview Dashboard (Main Landing Page)

**Purpose:** Give a national-level stakeholder a single-glance view of MPLADS health across states, and a way to drill into problem areas.

**Requirements, top to bottom of the page:**
- **Top-line KPI cards:** Total Funds Sanctioned nationally (with trend direction), Total Utilized (shown as a percentage), Total Parked/Unspent (called out distinctly when above a defined threshold), Active High-Risk Alerts (national count, clickable through to detail), and Projects Completed vs. Delayed (as a proportion).
- **National map:** states shaded by risk level or fund-utilization percentage; hovering or clicking a state opens a drill-down with that state's sanctioned amount, utilized amount, and alert count.
- **Two supporting charts:** a Fund Utilization Trend over the last 12 months (sanctioned/spent/parked), and an Alert Breakdown by Type (Cost Anomalies / Duplicates-Smurfing / Cartel Flags / Image Forensics / Jan-Pramaan Disputes).
- **Top risk rankings:** the 10 highest-risk districts, and the 10 highest-risk contractors (linking through to their profile).
- **Project status funnel:** counts of projects at each stage — Sanctioned → Tendered → Awarded → In Progress → Completed → Citizen-Verified → Payment Released — to make bottlenecks visible.
- **Recent national activity feed:** a low-emphasis, scrolling list of recent events.
- Wherever a metric here can be derived from real MP fund allocation data, it should be; anything not derivable (e.g., 12-month trend history, alert-breakdown counts) uses sample data.

### 4.6 Cartel/Collusion Graph (Static Demonstration)

**Purpose:** Demonstrate, with a single worked example, how the platform would visually surface a collusion ring among bidders on the same project.

**Requirements:**
- One hardcoded scenario, tied to a single real project from the MP fund allocation data, involving three sample contractors.
- Two labeled relationships between them, each representing a real-world red flag (e.g., two contractors sharing a registered phone number; two others sharing a PAN prefix or registered address).
- A graph view where each contractor is a node, sized/colored according to how connected (and therefore risky) it is.
- Clicking a node opens a side panel summarizing that contractor's connections (e.g., "linked to 2 other bidders on Project X").
- An accompanying alert card stating the high-level collusion risk in plain language.
- This graph is reached from the DM Dashboard's Alerts Inbox (Financial & Procurement tab) by clicking the relevant collusion alert.
- Explicitly not included: live scanning of IP/PAN data, any real graph-clustering algorithm, a national/explorable version of the graph, or a public-facing version.

### 4.7 Parliamentary Works & Audit Dossiers

**Purpose:** Provide a centralized, searchable index of individual work sanction orders and their audit status, for anyone assessing project-level financial risk.

**Requirements:**
- A grid/table view toggle for browsing dossiers.
- Top summary stat cards: total monitored works (and how many districts they span), total sanctioned value, count of critical anomalies (defined as risk score ≥ 70%), and count of verified/clean records.
- Search by case ID, work title, district, or contractor name.
- Filters by category, risk profile, and district, plus a sort by highest anomaly risk.
- A result count indicator (e.g., "Showing X of Y audit dossiers").
- Each dossier card/row should show: case ID, category tag, a color-coded risk percentage badge (red ≥70%, yellow ~40–70%, green <25%), project title, district, contractor name, MP name, billed amount versus sanctioned amount (shown as a progress indicator, where going over 100% implies overbilling), an alert tag where applicable, and a link through to a full dossier detail view.
- The dossier records themselves (case-level data) will be supplied in the companion data document. Wherever a real record isn't provided (e.g., to reach the stated total of 10 monitored works), a fake record following the same field structure is used to fill the gap, per the data approach in §6.

---

## 5. Cross-Cutting Functional Requirements

These apply across multiple modules above and are called out separately because they aren't owned by any single page:

- **Role-based views:** the same underlying project/contractor/fund data must be presentable through four distinct lenses — public/citizen, contractor, DM, and Ministry — each showing only the fields and actions appropriate to that role (e.g., Jan-Pramaan photo-level detail is DM-only; public views never see individual citizen review data).
- **Status/stage consistency:** a project's stage (Sanctioned → Tendered → Awarded → In Progress → Completed → Citizen-Verified → Payment Released) must be represented identically everywhere it appears — public tracker, contractor milestone view, DM project view, and the Ministry funnel — since it is a single underlying value, not independently maintained per view.
- **Risk categorization:** wherever a risk level, alert, or score is shown, it should map consistently to the same three-tier severity concept (healthy / watch / flagged) used platform-wide, regardless of which module is displaying it.
- **Approval/justification trail:** any DM action taken on an alert (approve, reject, escalate, request audit) must be logged with a justification note, DM identity, and timestamp, and that log must be consistently reflected in both the Approvals/Audit Log and the per-project/per-contractor history views.

---

## 6. Data Approach

This PRD intentionally does not enumerate the actual data values used by the prototype. Any real-looking figures, project names, or dossier records referenced in the original feature reference material were provided **for structural/reference purposes only** — to establish what fields a given page needs to display — not as data that must literally appear in the build.

The actual governing rule is simple: **wherever real data is explicitly provided for the build, it is used; wherever it isn't, fake/sample data fills the gap**, following the same field structure as whatever reference example exists. This applies uniformly across every module below — none of them are blocked on a specific dataset being "complete."

| Module | Data approach |
|---|---|
| Public Project Listing & Detail Pages | Real data used where provided; fake examples fill any remaining slots |
| MP Fund Allocation figures | Real data used where provided; fake figures elsewhere |
| Parliamentary Works & Audit Dossiers | Real records used where provided; fake records (matching the same field structure) fill any remaining slots, including reaching the stated total count |
| Contractor KYC badges | Fake — a small set of illustrative contractors |
| Contractor Trust Scores | Fake — static illustrative values |
| Jan-Pramaan consensus data | Fake — static illustrative counts |
| DM Alerts Inbox (all tabs) | Fake — hardcoded, since the detection engine isn't built |
| DM Overview stat cards | Mixed — calculated from real data where possible, fake elsewhere |
| Cartel/Collusion Graph | Fake — one hardcoded scenario, anchored to one real project where possible |
| Ministry/National Overview | Mixed — real allocation data mapped where possible, fake for trend/alert history |
| Fund Tracker (Sankey, aging report) | Mixed — real where provided, fake elsewhere |

Whatever real data is ultimately supplied will be maintained in a separate companion document (`data.md`) rather than in this PRD, so that the product scope and the underlying dataset can evolve independently.

---

## 7. Assumptions

- Every "AI-generated" alert, score, or flag in this prototype is illustrative and pre-defined; no live model inference occurs.
- Where a feature is documented as "concept only" or "not built in prototype" (e.g., live KYC, document upload center, standalone citizen app, Smart Escrow, national collusion explorer), it is included in this PRD purely so that the described product vision is complete and future scope is traceable — it is not expected to be interactive in this build.
- The prototype is intended to demonstrate the product concept and information architecture to stakeholders, rather than to operate as a live, multi-tenant, production system.

---

## 8. Open Items

1. **Real data to be finalized in `data.md`:** public project examples, MP fund allocation figures, and any real audit dossier records. Wherever these aren't supplied (e.g., to reach a stated total count), fake records fill the gap per §6 — this is expected behavior, not a blocker.

---

## 9. Out of Scope (Confirmed)

- Live AI/ML detection models of any kind (cost-anomaly, duplicate/semantic matching, graph-based collusion detection, image forensics).
- The Jan-Pramaan standalone citizen mobile app.
- The Contractor Document/Proof Upload Center.
- Live Aadhaar/KYC or PAN+GST verification flows.
- A national, fully interactive Cartel/Collusion Graph explorer.
- Automated ("Smart Escrow") payment release.
