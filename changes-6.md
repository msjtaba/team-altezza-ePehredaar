# Changes-6.md
## ePehredaar — Change Requests (Round 6)

**Companion documents:** `prd.md`, `trd.md`, `data.md`, `changes.md` through `changes-5.md`
**Context:** the portals from Round 5 (§2) are confirmed working now — this round is purely a visual consistency pass, not a functional change.

---

## 1. Portal Theme Consistency

- [ ] **Content, elements, and functionality in both Contractor portal views and the DM portal are confirmed good** — no functional or content changes requested here. This is a styling-only fix.
- [ ] **The portals currently don't match the rest of the site's theme** — font and color are off from the established look used elsewhere (Projects, MP Allocation, Contractors, Cartel, Jan-Pramaan). Bring all three portal views (Contractor-verified view, Contractor-unverified view, DM view) in line with that same shared theme:
  - Same typography (font family, weight conventions — including the site-wide reduced title weight from `changes.md` §1).
  - Same color tokens (brand color, status color-coding from `changes.md` §1, card/background colors).
  - Same component styling as the rest of the site (cards, badges, buttons, spacing) — i.e., whatever shared design system the other pages are already pulling from (see `changes-2.md` §1 if the Untitled UI integration is what the rest of the site is using) should extend to these portals too, rather than the portals having their own separate styling.
- [ ] Treat this the same way as the earlier dashboard theme fix (`changes-3.md` §1) — a direct side-by-side comparison against an already-consistent page (e.g. the Projects tab) is the way to confirm this is actually done, not just improved.
