# Changes-4.md
## ePehredaar — Change Requests (Round 4)

**Companion documents:** `prd.md`, `trd.md`, `data.md`, `changes.md` (Round 1), `changes-2.md` (Round 2), `changes-3.md` (Round 3)
**Context:** this round is mostly bug fixes and a couple of things Round 1/3 asked for but still aren't built, plus one real product-model correction (Jan-Pramaan's review flow).

---

## 1. Product Correction — Jan-Pramaan Photos Go to an ML Model, Not to the DM Directly

**This corrects `prd.md` §4.3.4 ("Jan-Pramaan — DM Review Inbox").** That section currently describes a DM-facing photo gallery ("Full photo gallery for each project — never shown publicly"). That's wrong and should be replaced with the following model:

- [x] **Citizen-submitted photos are never shown to the DM directly, and never as a browsable gallery.** Instead, each submitted photo is fed to the ML detection model (the one already assumed throughout `prd.md` — cost-anomaly, GPS/duplicate/timestamp checks, etc.).
- [x] **The model's output — not the raw photo — is what reaches the DM**, as alerts/flags in the existing **Alerts Inbox → Jan-Pramaan tab** (`prd.md` §4.4.2, Tab C: Pending Review / Negative Consensus Reached / Mock-Location Flagged). This tab already exists in the spec — it's the *only* Jan-Pramaan surface the DM should see. Delete the separate "DM Review Inbox" concept from §4.3.4 entirely; it's now redundant with Tab C.
- [x] **`trd.md`'s schema already fits this model correctly** — the `alerts` table already has a `jan_pramaan` category with ML-style types (`gps_mismatch`, `duplicate_image`, `negative_consensus`, `mock_location`, etc.). No schema change needed; this is a UI/flow correction, not a data-model change. (The `jan_pramaan_submissions.photo_url` field can stay — it's just no longer something the DM's UI ever renders directly.)
- [x] **Approval semantics:** when a DM takes an "Approve" action on a Jan-Pramaan alert for a project, that action **is** the authorization to release payment for that project — i.e., approving the alert should move that project/milestone's `payment_status` from `pending` to `released` (per the `milestones` table in `trd.md` §5.4). This is the actual trigger for "Smart Escrow"-style payment release in the prototype (still simulated, per `trd.md`'s existing non-goals — no real payment gateway — but the DM's approve action is what flips the status).
- [x] Everywhere else in the spec that assumed a DM-facing photo gallery (any UI mockup, any reference in earlier change rounds) should be understood as superseded by this — the DM only ever sees model output, never raw images.

---

## 2. National Overview Dashboard — Still Not Data-Bound

Round 3 (§2) asked for this and it isn't fixed yet.

- [x] **"Allocated Limit for Hon'ble MPs" KPI card is still not pulling the real total from `data.md`.** It must show the actual computed sum — **₹8,335.21 Crore** — from the 543-MP table. Confirm the binding is actually wired to `data.md`'s data, not a hardcoded string that happens to look right.
- [x] **Choropleth map shows no data at all** — no shading, no hover response. This needs to actually work:
  - Every state must render with *some* value driving its shading — pull from `data.md` where a state has real project/allocation data, and **fill any state without real data with fake data** rather than leaving it blank. A blank/undifferentiated map reads as broken, not as "no data available" — it must always look populated.
  - **Same rule for the hover tooltip:** every state's tooltip must show a name + details, real where available, fake elsewhere — never an empty or missing tooltip.
- [x] **Same fallback rule applies to every other dashboard element** (Fund Utilization Trend, Alert Breakdown, High-Risk Contractors/Districts, Project Status Funnel, etc., per `changes-3.md` §3): real data where `data.md` has it, fake data filling any gap, but **always visibly populated** — nothing on this dashboard should render empty.

---

## 3. Security/Leak — DM-Only Content Was Visible in the Public Project Detail Panel

- [x] When viewing a project's detail panel (the side drawer from `changes.md` §4), there is currently a **"DM only view"** section rendering at the bottom, visible to everyone — including the public, unauthenticated view.
- [x] This must not be visible outside an authenticated DM session. Remove it from the public-facing panel entirely; DM-only project detail (alert history, any internal notes) belongs inside the DM Portal's own project view (`prd.md` §4.4.4), not bundled into the public/shared detail panel component.
- [x] This is a real access-control bug, not just a display preference — treat it as the priority fix in this round, since it's leaking information that's explicitly supposed to be gated per `prd.md`'s role-based view rules (`prd.md` §5, "Role-based views").

---

## 4. Authorization — General Audit Needed

- [x] Beyond the specific leak in §3, there are other authorization gaps ("leaks here and there") that need a proper pass, not one-off patches. At minimum:
  - Confirm role-gated routes (`/contractor/*`, `/dm/*` per `trd.md` §3) actually reject access server-side for the wrong role or no session — not just hide UI elements client-side while still returning gated data underneath.
  - Confirm a Contractor session can't reach DM-only data (and vice versa) via any API route, not just via the page UI.
  - Re-check every place a role-specific panel/section is rendered (DM alert history, contractor internal fields, etc.) against who can actually see it.
- [x] Treat this as a checklist to run across the whole app once the two portals (§6) are actually built, since a proper build of both portals is the natural point to get this right rather than patching the current partial version.

---

## 5. Sign-In Page — Field Label and Missing Sign-Up Flow

- [x] **The second field on the sign-in page currently says "Password or OTP."** This is wrong — OTP login isn't implemented (per `trd.md`, auth is email/phone + password via NextAuth Credentials). The field should simply say **"Password."**
- [x] **There are only two authenticated portals** in this product: **Contractor** and **District Magistrate (DM).** No other role needs a sign-in/sign-up path right now — confirms the scope from `changes-3.md` §4 (no ministry/admin sign-up needed).
- [x] **The Sign-Up flow requested in `changes-3.md` §4 still isn't actually present** — the sign-in page needs the "Sign Up" button + text line, and the two-button role toggle (Contractor / DM) with the field sets already specified there. This is a re-ask, not a new spec — see `changes-3.md` §4 for the exact field lists.

---

## 6. Build Both Portals (Still Outstanding)

- [x] **Neither the Contractor Portal nor the DM Portal is built yet.** Both were requested back in `changes.md` (§5 and §7) and are still missing. Build both now, following `prd.md` exactly:
  - **Contractor Portal** — per `prd.md` §4.2: sign-up/login (now unified per §5 above), KYC verification-status display, bidding (gated on verified status), My Bids / My Projects with milestone tracker, Trust Score visibility, Grievance/Dispute panel.
  - **DM Portal** — per `prd.md` §4.4: Overview, Alerts Inbox (all four tabs — noting Tab C now works as described in §1 above, not as a photo gallery), Projects, Contractors, Approvals/Audit Log, Fund Tracker.
- [x] Both portals must use the unified sign-in flow from §5 and route correctly by role.
- [x] Use the existing sample accounts (`changes.md` §9.1 Contractor logins, §9.2 DM login) to verify both portals actually work end-to-end once built.

---

## 7. Contractors Page — Badge Color and Sample Data Fixes

- [x] **Unverified contractors currently don't have a red badge** — verified contractors correctly show green, but unverified ones need to be styled **red**, not left neutral/unstyled. This is a direct application of the color-coding rule already established in `changes.md` §1 (red = flagged/unverified, green = healthy/verified).
- [x] **Increase the completed-projects count for the highest-rated verified contractor** (Sri Balaji Infra Projects, Trust Score 82/100, per `changes.md` §9.1) — its current completed-project number is too low to read as convincing for a "top-rated" contractor. Bump it up to something that reads as an established, high-performing vendor (suggest 15–20 completed projects — pick a specific number when implementing, just needs to be meaningfully higher than whatever placeholder is showing now).

---

## 8. Global Loader — Redesign

- [x] The current URL-entry loading screen isn't right. Rebuild it with:
  - A **nice abstract visual graphic/animation** — on-brand motion, not a generic spinner.
  - **"ePehredaar"** as the name — bold, and sized fairly large.
  - Tagline beneath it: **"Decoding Fraud. Defending Infrastructure."** — sized smaller than the name, but still substantial (both name and tagline should read as "a little big," per the request — this isn't a small, understated splash screen).
  - This tagline is now final and replaces the placeholder options listed in `changes.md` §1 / §10.

---

## 9. Mobile Navigation — Add a Collapsible Menu

- [x] **Mobile currently has no way to navigate between pages at all.** Fix this with a collapsible (hamburger-style) menu.
- [x] **Placement:** the menu icon sits to the **left of the logo/site name** in the mobile header (i.e., leftmost element in the header — menu icon, then logo, then "ePehredaar" name, reading left to right).
- [x] Expanding it should surface the same navigation set as the desktop header (`changes-3.md` §8: Projects, MP Allocation, Contractors, Cartel, Jan Pramaan) plus sign-in/portal access.

---

## 10. Site Name Casing Fix

- [x] The app name is showing as **"EPEHREDAAR"** (all caps) in places — this is wrong. The correct casing, everywhere, is **"ePehredaar"** (lowercase *e*, capital *P*, lowercase the rest).
- [x] Check for a CSS `text-transform: uppercase` rule being applied to the site name/logo text (likely cause) and remove it, or otherwise ensure every literal usage of the name across the app — header, loader (§8), page titles, metadata/browser tab title — uses the exact string `ePehredaar`.

---

## 11. Jan-Pramaan — QR Code Is Physical, Not On-Site in the App

- [x] **Clarification/correction:** the Jan-Pramaan QR code is **not displayed anywhere on the website.** It's a physical sticker/print affixed at the live construction site itself — a citizen standing at the actual project location scans it with their phone camera, which is what triggers the geofence + project-lookup flow described in `changes.md` §6.
- [x] **Nothing needs to be built to "generate" or "display" a QR code in the app.** The only thing the app needs is the scan-and-lookup behavior on the mobile Jan-Pramaan page (scan → geofence check → pull matching project → enable capture) — the QR itself lives in the physical world, out of scope for the app UI.
- [x] **For the demo:** a sample QR code (pointing to the Osmania University project, per `changes.md` §9.3) will be printed/shown physically at the hackathon venue and scanned live using the mobile Jan-Pramaan page, exactly as a real citizen would at a real site.

## 12. Jan-Pramaan — Remove "Submit Again" Button

- [x] In the post-upload confirmation screen (`changes.md` §6, step 3–4: thank-you message → satellite map → action buttons), **remove the "Submit Again" button.**
- [x] Only the **"Return"** button should remain after a successful submission.
