# Changes-5.md
## ePehredaar — Change Requests (Round 5)

**Companion documents:** `prd.md`, `trd.md`, `data.md`, `changes.md` through `changes-4.md`
**Context:** two carry-overs from Round 4 still aren't resolved (the portals, the DM-only leak), one item is being dropped from scope (the loader), and one location needs correcting.

---

## 1. Correct the College of Engineering Building Location

- [ ] The coordinates used in `changes-3.md` §5.1 (17.4110° N, 78.5290° E — an approximate, campus-wide guess) are superseded by the exact pin from the link provided this round: `https://maps.app.goo.gl/1LxLD1UPKzcG2mpf9`, which resolves to **College of Engineering, Osmania University** at:

  **17.4068029° N, 78.5185352° E**

- [ ] Update the Osmania University sample project's latitude/longitude to this exact value. This is the pin that should show up on both the Projects tab detail panel's satellite map and the Jan-Pramaan geofence check during the live demo.

---

## 2. Contractor & DM Portals Still Not Appearing — Diagnose, Don't Just Re-Build

Round 4 (§6) asked for both portals to be built; they're still not visible. Since it's unclear whether this is a "never built," a routing problem, or an auth problem, treat this as a diagnostic pass rather than assuming a full rebuild is needed:

- [ ] **Confirm the pages actually exist.** Check whether `/contractor/*` and `/dm/*` routes (per `trd.md` §3) have real implementations behind them, or whether they're still placeholder/empty pages.
- [ ] **Confirm the sign-in flow actually routes there.** After a successful login with a Contractor or DM sample account (`changes.md` §9.1, §9.2), check what actually happens — does it redirect to the correct portal route, redirect nowhere, redirect to the wrong place, or error out?
- [ ] **Confirm there isn't an auth-check bug blocking legitimate access.** If the portal pages exist and routing fires correctly but the page still doesn't render, check whether the role-check middleware is incorrectly rejecting a valid, correctly-authenticated session (e.g., role string mismatch, session not populated with role, etc.).
- [ ] **Once the actual cause is identified, fix that specific thing** — don't rebuild both portals from scratch unless the diagnosis actually shows they were never implemented. Test end-to-end with both sample accounts (Contractor-verified, Contractor-unverified, DM) after the fix, confirming each lands on its correct portal view per `prd.md` §4.2 (Contractor) and §4.4 (DM).

---

## 3. Drop the Global Loader — Out of Scope for Now

- [ ] The animated loader requested in `changes-4.md` §8 (ePehredaar name + "Decoding Fraud. Defending Infrastructure." tagline) is **no longer being pursued.** It hasn't worked after multiple attempts and isn't worth further time right now.
- [ ] Remove it from the build entirely — the site should just load directly without a splash/loader screen. This also means the earlier Jan-Pramaan-specific loader (`changes.md` §6) should be reconsidered/dropped for the same reason unless it's working independently of the global one — confirm its status separately if it's a different implementation.

---

## 4. DM-Only View Is Still Leaking on Project Detail Pages

This was flagged as the priority fix in `changes-4.md` §3 and is **still not resolved.**

- [ ] The "DM only view" box is still showing at the bottom of the project detail panel for **all** projects, visible to the public.
- [ ] This needs to be removed from the public/shared detail panel component entirely — not hidden with CSS, not conditionally styled, actually removed from what renders for a non-DM session. Re-confirm after the fix by viewing a project's detail panel while logged out (or as a Contractor) and checking that no DM-only content appears anywhere in that view, on every project, not just a subset.
- [ ] If DM-only detail (alert history, internal notes) is still needed somewhere, it belongs exclusively inside the DM Portal's own project view (`prd.md` §4.4.4) — which depends on the DM Portal actually being reachable per §2 above.
