# Changes.md
## ePehredaar — Change Requests (Round 1)

**Companion documents:** `prd.md` (product scope), `trd.md` (architecture/stack/schema), `data.md` (real reference data)
**Note on naming:** the product is now named **ePehredaar**. This name should replace any placeholder/working title used across the site, the header/logo, the browser tab title, and the new loading screens described below.

This document captures a round of feedback on the current build, organized by area. Each item is written as a directive (what to remove / add / change) so it can be tracked and implemented directly. Items that require new sample/fake data are called out in §9 with concrete values so nothing blocks implementation.

---

## 1. Site-Wide / Global Changes

- [ ] **Remove the existing marketing/hero landing page** — the current entry page with introductory copy (the "the watch kept in the open, see where..." style tagline page) is removed entirely. It is replaced by the National Overview Dashboard as the first thing a visitor sees (see §2).
- [ ] **Global loading screen:** when the site URL is first loaded, show an animated splash/loader screen — good visual polish, motion, on-brand — displaying the **ePehredaar** name prominently, with a tagline beneath it. (Tagline copy to be finalized — suggest something like *"Every rupee, in the open."* or *"Watching public funds, publicly."* as placeholder options.)
- [ ] **Title weight:** reduce the font-weight of page/section titles slightly, site-wide — currently too heavy/bold; dial it back a notch while keeping titles clearly distinguishable from body text.
- [ ] **Consistent color-coding for statuses and KPIs:** everywhere a status, alert level, or KPI is shown (project status, risk level, completion ratios, alert badges, etc.), it should use a consistent color language across the whole app (e.g., green = healthy/complete/verified, yellow/amber = watch/in-progress, red = flagged/incomplete/high-risk) rather than ad hoc styling per page.

---

## 2. National Overview Dashboard (New Landing Page)

This becomes the **first page on entering the site**, replacing the old landing page.

- [ ] **Top section — quick-glance KPI boxes.** A row of at-a-glance summary cards, giving an immediate read on overall system state. Confirmed box:
  - **"Allocated Limit for Hon'ble MPs"** — shows a headline figure (e.g. total allocated across all MPs); the whole box is **clickable** and navigates to the MP Allocation page (see §3).
  - Remaining boxes: pull from the PRD's National/Ministry Overview spec (§4.5) — Total Funds Sanctioned, Total Utilized (%), Total Parked/Unspent, Active High-Risk Alerts, Projects Completed vs. Delayed. Pick whichever subset reads cleanly as a first-glance row (don't overload it — this is meant to be scannable in a few seconds).
- [ ] **Second section — dashboard visualizations.** Below the KPI row, bring in the chart/graph elements already scoped in the PRD's National Overview module (§4.5): national risk/utilization map, fund utilization trend line, alert breakdown (pie/bar), top-risk district/contractor rankings, project status funnel. Use whichever combination best matches "whatever is essential" from that PRD section — this section is the deeper dashboard view sitting beneath the quick-glance row.

---

## 3. MP Allocation Page

- [ ] Reached by clicking the "Allocated Limit for Hon'ble MPs" box on the National Overview Dashboard.
- [ ] **Visual polish pass:** currently plain — needs to look more visually appealing while staying within the site's existing theme/design language (color palette, typography, spacing conventions already used elsewhere).
- [ ] **Data must be presented as a list** (per the existing instruction in `data.md`) — searchable/browsable list of all MPs with State, Constituency, and Allocated Amount (₹ Crore). This requirement doesn't change — just the visual treatment of that list does.

---

## 4. Projects Tab

- [ ] **Reorder the page top-to-bottom as follows:**
  1. Quote/tagline — keep it, but shrink its size (currently too large/dominant for its position).
  2. KPI boxes (3–4 boxes) — see below.
  3. Filter controls — see below.
  4. Project list/cards — see below.

- [ ] **KPI boxes (3–4 total):**
  - **Completed vs. Incomplete ratio** — shown as a horizontal bar, red segment for incomplete and green segment for completed (matches the site-wide color-coding rule in §1).
    - **Dynamic behavior:** defaults to the **national** completed/incomplete ratio across all projects. Once a State is selected in the filters, this box updates to reflect that **state's** ratio instead.
  - 2–3 additional boxes, suggested (confirm/adjust before build):
    - Total number of projects (with a completed/in-progress/incomplete breakdown)
    - Total sanctioned value vs. total paid-out value for the current filter selection
    - Number of projects with an open alert/flag (ties into the alert system from the PRD)
  - These additional boxes should also respect the same state-selection dynamic where it makes sense (i.e., recalculate for the selected state, fall back to national when no state is selected).

- [ ] **Filters:**
  - **State dropdown:** list **all** states (currently incomplete/partial — needs the full state list).
  - **District dropdown:** same — list **all** districts, not a partial set.
  - **Remove the standalone "Select MP" dropdown.** Replace with a **dynamic MP dropdown**: it only appears (or populates) once a State is selected, and lists **only the MPs belonging to that state**. No state selected → no MP filter shown/available.

- [ ] **Project list ordering:** change the default sort/order so that **Asaduddin Owaisi's projects appear first**, followed by **D M Kathir Anand's projects**, then the rest. (This is a demo-ordering preference, not a permanent sort rule — flag if this should later become configurable rather than hardcoded.)

- [ ] **Remove the "One dataset, five reviews" section** (or whatever similarly-named summary/reviews block currently appears on this page) — cut entirely.

- [ ] **Project cards → click behavior:**
  - Cards remain clickable (already true for completed projects only, per `data.md`'s existing rule that incomplete projects don't open a detail view — that rule stays).
  - On click, instead of a full page navigation, open a **side hover panel** ("drawer") that slides in from the side with a **subtle entrance animation**.
  - This panel replaces/extends the existing detail-card concept and should be used for **every** completed project in the list, consistently.
  - **Panel contents:**
    - All existing detail-card fields (title, cost, MP, constituency, payment/installment timeline — per `data.md`).
    - **Contractor name** — if a contractor has been assigned to the project, show their name in this panel (currently missing).
    - **Satellite map** — embed the project's satellite imagery view (per the TRD's OpenLayers integration) directly inside this panel, so the user can see the project location without leaving the panel.

---

## 5. Contractor Portal (Not Yet Built — Build Now)

- [ ] Build out the Contractor Portal per the PRD (§4.2) and TRD (auth/role structure).
- [ ] Create **two sample contractor logins** for demo purposes — one KYC-**verified**, one **unverified** — so both states of the portal (able to bid vs. blocked from bidding) can be shown. See §9 for exact sample credentials/data to use.

---

## 6. Jan-Pramaan

- [ ] **Header/nav styling:** the "Jan Pramaan" entry in the site header/nav should be visually distinct from other nav items — **slightly larger**, **all caps**, and **bold**.
- [ ] **Make the page fully functional** (currently not functional/interactive).
- [ ] **Desktop/laptop behavior:** the QR-scan and click-to-capture features are **disabled** on desktop/laptop viewports. In their place, show a message such as *"Please use your mobile device to access this feature."*
- [ ] **Mobile behavior (responsive):** the full feature set — QR scan, camera capture — is available and functional on mobile viewports.
- [ ] **Jan-Pramaan-specific loading screen:** when navigating into the Jan-Pramaan page, show a dedicated loader (separate from the global site loader in §1) displaying **"Jan-Pramaan"** as the name, with a tagline describing what the feature does (e.g. *"See it. Verify it. Keep it honest."* — placeholder, refine as needed).
- [ ] **Entry state:** on opening Jan-Pramaan (mobile), **no project should be pre-loaded or shown**. The screen starts empty/neutral, prompting a QR scan.
- [ ] **QR scan flow:** scanning the demo QR code (see §9 for the sample project it should point to) automatically pulls in and displays that project's details, and **enables the click-to-capture (camera) feature** for that project.
- [ ] **Capture/upload flow:**
  1. User taps to capture a photo via the camera.
  2. On successful upload, show a confirmation message — e.g. *"Thank you for your cooperation — we'll verify this image with our model shortly."* (exact copy can be refined, but the tone/content should match this).
  3. After the confirmation, reveal a **satellite imagery map** at the bottom of the screen, showing the project's location (same satellite capability as used in the Projects tab detail panel, §4).
  4. Below the map, show action button(s): **"Submit Again"** and **"Return"** (or equivalent) so the user can either submit another photo or exit the flow.

---

## 7. DM (District Magistrate) Portal

- [ ] Create a **sample DM login** for demo purposes (see §9 for exact credentials/data).
- [ ] On logging in with this account, the DM should land on their dashboard view exactly as scoped in the PRD (§4.4) — Overview, Alerts Inbox (all tabs), Projects, Contractors, Approvals/Audit Log, Fund Tracker — so the full DM experience can be demonstrated end-to-end, not just described.

---

## 8. Contractor Collusion / Cartel Graph Page

- [ ] Build this page per the PRD's spec (§4.6) — the fixed 3-contractor demonstration scenario, node/edge graph, side panel on node click, and the plain-language alert card.
- [ ] Prioritize **high readability and clear insight** — this page should make the collusion pattern immediately understandable to a non-technical viewer (e.g. a judge), not just technically accurate. Favor clarity and transparency in the visual treatment over density of detail.

---

## 9. New Sample/Demo Data Required

The following fake/demo records are needed to support the changes above. These should also be reflected in `data.md` for consistency. All values below are placeholders — swap in different figures/names if preferred before the demo.

### 9.1 Contractor Accounts (for §5)

| Field | Contractor A (Verified) | Contractor B (Unverified) |
|---|---|---|
| Company Name | Sri Balaji Infra Projects | Deccan Builders & Co. |
| Login Email | contractor.verified@epehredaar.demo | contractor.unverified@epehredaar.demo |
| Password | Demo@123 | Demo@123 |
| KYC Status | Verified | Unverified |
| Trust Score | 82/100 (illustrative) | — (not yet applicable pre-verification) |

### 9.2 DM Account (for §7)

| Field | Value |
|---|---|
| Name | Dr. Ravi Kumar (District Magistrate, Hyderabad) |
| Login Email | dm.hyderabad@epehredaar.demo |
| Password | Demo@123 |
| District | Hyderabad |

### 9.3 Demo Project — Osmania University, Hyderabad (for §6, Jan-Pramaan QR demo)

This project needs to be added to the Projects tab (as a real listed project) **and** be the project the demo QR code points to.

| Field | Value |
|---|---|
| Title | Renovation and Construction of Additional Seminar Hall Block, Osmania University, Hyderabad |
| Sanctioned Cost | ₹38,50,000 |
| MP | Asaduddin Owaisi |
| Constituency | Hyderabad |
| Work ID | OU-2025-114 |
| Sanction Date | 10 Aug 2025 |
| Status | Completed (QR generated, **awaiting citizen verification** — i.e., zero Jan-Pramaan submissions so far, so the live demo scan is the first one) |
| Contractor Assigned | Sri Balaji Infra Projects (ties to the verified contractor account in §9.1) |

**Important:** because this project's status is "Completed," it should behave like any other completed project in the Projects tab (opens the side detail panel per §4) — the only special thing about it is that its QR code is the one used for the live Jan-Pramaan demo, and it should currently have no prior citizen submissions.

---

## 10. Open Items / Things to Confirm Before Build

1. **Tagline copy** for both the global ePehredaar loader and the Jan-Pramaan loader are placeholders in this document — confirm or replace final wording.
2. **Project ordering rule** (Owaisi's projects, then Kathir Anand's, then the rest) — confirm whether this is a one-off demo ordering or should be a configurable "pinned/featured" mechanism.
3. **Exact 3rd/4th KPI boxes** on the Projects tab are suggested, not confirmed — confirm the final set before implementation.
4. **Confirmation message copy** for the Jan-Pramaan upload success state is a placeholder — confirm final wording.
