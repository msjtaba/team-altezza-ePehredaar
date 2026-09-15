# design.md — Brand & Design System
## MPLADS AI Watchdog — Prototype

Informed by `/taste`, `/impeccable:impeccable`, and `/design-motion-principles`. This is the single source of design truth — colors, type, spacing, components, and motion are all specified here so five very different surfaces (public site, mobile verification, contractor portal, DM dashboard, ministry dashboard) still read as one product.

> **v2 amendment (this version):** the user explicitly directed a livelier, more interactive, "worldly" editorial direction with named fonts (Anton / Playfair Display / Nunito) for the public-facing site. Per taste-skill's own rule — *"the brief wins, honor pinned fonts/palettes even when they conflict with a general-purpose warning"* — this supersedes the original restrained system **for Persuade-mode surfaces only** (public site, Jan-Pramaan mobile web). **Operate-mode surfaces (Contractor/DM/Ministry dashboards) intentionally keep the original restrained system from v1** — a fraud-triage cockpit should not compete visually with the content it's triaging. This scoping is a craft judgment call, not an instruction — say so if you want the lively direction everywhere instead. Sections below are updated in place; superseded v1 values are struck through where useful for traceability.

> **v3 amendment (changes-1.md round):** two scoping corrections, both driven by the product rename to **ePehredaar** and the round-1 change request:
> 1. **Mode is now keyed on page *shape* (dashboard vs. story), not on auth state.** The original §7 table implicitly equated "authenticated" with Operate and "public" with Persuade. That broke once the brief added a **public, unauthenticated National Overview Dashboard** as the new `/` landing page (changes-1.md §2) — a dashboard is a dashboard regardless of who's allowed to log in. Corrected rule: **any KPI-strip/chart/table-dense oversight surface is Operate-mode** (Inter, IBM Plex Mono, navy/slate, restrained motion) **even when it's public**, and **Persuade-mode is scoped strictly to citizen-facing storytelling pages**: `/projects`, `/projects/[id]`, `/mp-allocations`, `/jan-pramaan*`, `/contractors/[id]`. `/` (National Overview) and `/ministry` are both Operate-mode. This is a scoping clarification of §7's table, not a reversal of the v2 Persuade brief — Persuade surfaces keep every rule in §1–§6 unchanged.
> 2. **Title weight, site-wide:** page/section titles (`h1`/`h2`-level headings using `font-bold`/`font-semibold`) step down one Tailwind weight — `font-bold` → `font-semibold`, `font-semibold` → `font-medium` — on every surface, Persuade and Operate alike. This is an amendment to §4 (Typography): the type **scale** (sizes in §4.2) is unchanged, only the weight token one step lighter, so hierarchy still reads clearly against body text but titles no longer compete as hard for attention. Anton (§4.1) is unaffected — it ships one weight (400) only. Applied incrementally, file-by-file, as each surface is touched, rather than as a single repo-wide sweep.

---

## 1. Design read (per taste-skill §0)

> **v2 — Persuade surfaces:** an editorial, "worldly," alive civic-trust brand — the public site should feel like a beautifully art-directed documentary or a national magazine's investigative feature, not a SaaS dashboard. Confident, warm, human — still honest, never carnival or AI-generic. Explicit brief: Anton for display type, Playfair Display + Nunito for body/editorial text.
>
> **Operate surfaces (unchanged from v1):** ~~a public-sector / regulated / trust-first oversight platform... Inter, restrained motion, strict semantic-color discipline for risk~~ — this reasoning still governs the Contractor/DM/Ministry dashboards. See §1.1.

Two dial sets now apply, one per mode (§7 defines exactly which routes get which):

| Dial | Persuade (v2) | Operate (v1, unchanged) | Why the split |
|---|---|---|---|
| `DESIGN_VARIANCE` | **8** | 4 | The public site is the "so what" moment — asymmetric editorial layout, real imagery, and a confident point of view earn attention. The dashboards stay predictable because triage work punishes surprise. |
| `MOTION_INTENSITY` | **6** | 3 | Public pages are occasional-use (§6) — motion here builds delight without fatigue. DM/Ministry screens are hit dozens of times a day and stay near-static. |
| `VISUAL_DENSITY` | **3** | 5 | The public site is a gallery-paced story; the dashboards are still a cockpit. |

**Serif is now justified and in use** — Playfair Display, for editorial/heritage/civic-institutional register (taste-skill §4.1's explicit exception: "the aesthetic family is genuinely editorial... and you can articulate why this specific serif fits this specific brand"). The brand is explicitly reaching for "worldly magazine feature about public accountability," which is exactly the editorial case the serif-discipline rule carves out.

### 1.1 Operate surfaces — v1 read still applies

> Reading this as: a public-sector / regulated / trust-first oversight platform for District Magistrates, Ministry staff, and contractors, with an institutional-but-modern language, leaning toward Tailwind utilities + shadcn/ui + Inter, restrained motion, and strict semantic-color discipline for risk.

No serif, no Anton, no expanded palette on `/contractor/*`, `/dm/*`, `/ministry` — those routes keep every rule from v1 §1 as originally written. The rest of this document marks Persuade-only changes clearly; anything not marked as amended still applies to Operate surfaces unchanged.

---

## 2. Brand identity

**Product name:** MPLADS AI Watchdog *(prototype framing: every "AI" surface is illustrative — see [brain.md](brain.md) §4)*

**Positioning line:** *"See where the money went — and prove it, on the ground."*

**Personality:** vigilant, precise, unshowy. Think an auditor's desk, not a startup's landing page — calm authority, not urgency theater. The product should feel like it has nothing to hide and nothing to oversell.

**Voice & tone:**
- Plain language over bureaucratic language. "Payment frozen" not "disbursement suspended pending remediation."
- Numbers speak for themselves — no editorializing copy around a risk score ("shockingly high," "alarming"). State the fact, let the color-coding carry the weight.
- Never invent precision. A number is either real (from `data.md`), or explicitly sample/illustrative — see the Copy Self-Audit rule in §9.
- Citizen-facing copy (Jan-Pramaan) is the simplest register in the product — one-thumb, low-literacy-friendly, short imperative sentences ("Scan the code," "Take a photo," "Confirm or dispute").

---

## 3. Color system

**Operate surfaces keep the v1 rule exactly: one brand accent (Watchtower Navy), one locked semantic-risk triad, nothing else.** See §3.1–3.2 below, unchanged. **Persuade surfaces get an expanded, deliberately multi-hue editorial palette (§3.0)** — this is a conscious departure from "max 1 accent," justified because the brief explicitly calls for "lively / worldly / beautiful," and taste-skill's own override clause allows it when the brief asks for it by name. The semantic-risk triad (§3.3) is **never** touched by this — it stays identical on both surface types, because risk meaning must never shift depending on which page you're on.

### 3.0 Persuade brand palette — "Civic Editorial" (v2, public site only)

Three hues instead of one, each doing a distinct job — not decorative variety for its own sake:

| Token | Hex | Role |
|---|---|---|
| `ink-950` | `#14142B` | Primary text on paper, hero background |
| `ink-800` | `#1E1E3F` | Secondary dark surface, footer bg |
| `paper` | `#FBF8F2` | Warm ivory page background — replaces pure white on Persuade surfaces |
| `paper-2` | `#F3EDE0` | Card/section tint on paper |
| **`indigo-700`** | `#26317A` | **Structural accent** — nav, hero gradient base, section dividers. The "institution" note carried forward from Watchtower Navy, deepened and warmed slightly. |
| `indigo-500` | `#3D4AA8` | Links, secondary buttons, hover states |
| **`marigold-600`** | `#E08A2E` | **Primary interactive accent** — CTAs, active states, the one color that means "act here." Named for the marigold garland — a specific, articulable civic/ceremonial reference, not a generic warm-brand reach. |
| `marigold-400` | `#F0A73C` | Hover/highlight state of marigold-600 |
| `marigold-100` | `#FCEACB` | Tinted backgrounds behind marigold content |
| **`teal-700`** | `#0F6B62` | **Secondary interactive accent** — alternates with marigold on the audience cards and data highlights, keeping the page from reading single-note. Peacock-teal, same "specific cultural reference, not generic" logic as marigold. |
| `teal-100` | `#D8F0EC` | Tinted backgrounds behind teal content |

Usage discipline, so three accents don't collapse into noise: **marigold = primary action, teal = secondary/alternating accent, indigo = structure.** A single component never mixes marigold and teal as competing accents; a section picks one accent and holds it, the way v1 held navy everywhere. Never introduce a fourth hue on a Persuade surface.

### 3.1 Operate brand — "Watchtower Navy" (v1, unchanged)

Used on `/contractor/*`, `/dm/*`, `/ministry` only: navigation, primary buttons, links, focus rings, active states, the India-map "utilization" gradient, chart series that aren't risk-coded. Still the *only* accent color on these routes (taste-skill §4.2 — max 1 accent, Color Consistency Lock, unchanged from v1).

| Token | Hex | Use |
|---|---|---|
| `navy-950` | `#0A1930` | Dashboard sidebar bg (dark), highest-contrast text on light |
| `navy-900` | `#10233F` | Header/nav bg, primary button hover |
| `navy-700` | `#1E3A5F` | **Primary brand color** — buttons, links, active nav, focus rings |
| `navy-500` | `#3E5C82` | Secondary interactive elements, chart series 2 |
| `navy-300` | `#8CA3BE` | Disabled/placeholder on light, chart gridlines |
| `navy-100` | `#E3EAF2` | Tinted backgrounds, selected-row highlight |
| `navy-50` | `#F4F7FA` | Page background tint (dashboards only, see §7) |

### 3.2 Neutrals — Slate (Operate surfaces) / Ink-Paper (Persuade surfaces)

Operate surfaces keep the standard Tailwind Slate scale unchanged (`slate-50 #F8FAFC` → `slate-900 #0F172A`, body text `slate-700` on light / `slate-300` on dark) — no warm grays on dashboards, per v1's one-palette rule.

Persuade surfaces use the warm `ink`/`paper` pair from §3.0 instead of Slate — this is the one deliberate exception to "one neutral family per project," scoped strictly to which *mode* a page is in, not mixed within a single surface.

### 3.3 Semantic risk triad — locked, three tiers only

This is used **only** for risk/status meaning — never decoratively, never as a substitute brand color. It maps identically across the DM heatmap, Alerts Inbox badges, audit dossier cards, collusion graph node fill, and the Ministry risk rankings (per brain.md §3 rule 2).

| Tier | Fill | Text-on-fill | Tint bg | Meaning |
|---|---|---|---|---|
| **Healthy** | `#15803D` (green-700) | white | `#DCFCE7` (green-100) | Risk score < 40%, clean audit, verified consensus |
| **Watch** | `#B45309` (amber-700) | white | `#FEF3C7` (amber-100) | Risk score 40–70%, pending review, awaiting verification |
| **Flagged** | `#B91C1C` (red-700) | white | `#FEE2E2` (red-100) | Risk score ≥ 70%, negative consensus reached, frozen payment |

All three pass WCAG AA (4.5:1) as white-on-fill for badge text, and as fill-on-tint for icon/border use. **Never** invent a fourth tier ("critical," "severe") — the PRD's three-tier model (healthy/watch/flagged) is load-bearing across every module.

### 3.4 Public Trust Score

Rendered as a **star rating**, not a color or a raw number (PRD §4.1 explicit requirement — avoids implying false precision on illustrative data). Stars use `navy-700` filled / `slate-300` empty — deliberately *not* the risk triad, since a contractor's public trust score is a different concept from a live project's risk flag.

### 3.5 What's explicitly banned

Per taste-skill §4.2: no AI-purple/violet gradients, no default beige/brass/oxblood "premium-consumer" palette (this product is not premium-consumer), no warm-and-cool-gray mixing, no per-section theme flipping (§9 Theme Lock).

---

## 4. Typography

### 4.1 Typeface system — two sets, by mode

**Persuade surfaces (v2 — public site, explicit user brief):**

| Role | Font | Why |
|---|---|---|
| **Display / headlines / titles / nav wordmark** | **Anton** | Explicit brief. A tall, condensed, poster-grade display face — reads as bold civic statement, not corporate SaaS. One weight only (400) is all Anton ships; scale it with size, not weight. |
| **Editorial accents / pull-quotes / section eyebrows / large stats** | **Playfair Display** | Explicit brief. High-contrast serif, italic for pull-quotes and the mission line — this is the "documented exception" case in taste-skill's serif-discipline rule (§1): genuinely editorial register, articulable fit. |
| **Body copy / UI text / buttons / nav links** | **Nunito** | Explicit brief. Rounded, warm, highly legible sans — carries the "lively/beautiful" feel into paragraph-length text without sacrificing readability. |

**Operate surfaces (v1, unchanged):**

| Role | Font | Why |
|---|---|---|
| **UI / body / headings** | **Inter** | Still the justified public-sector/accessibility-first override — unchanged, because dashboards weren't part of the v2 brief. |
| **Technical / tabular / mono** | **IBM Plex Mono** | Case IDs, GPS coordinates, timestamps, hashes, work IDs — unchanged. |

**Never mix the two systems on one surface.** Anton/Playfair/Nunito stay on the public site; Inter/Plex Mono stay on the dashboards. A contractor moving from the public site into their authenticated portal is a deliberate register shift — like walking from a magazine feature into a working cockpit — not an inconsistency.

### 4.2 Scale

**Persuade (v2):**

| Token | Size / leading | Font | Use |
|---|---|---|---|
| Display | `text-6xl md:text-8xl` / `leading-[0.95] tracking-tight` | Anton | Hero headline — Anton's condensed form carries large sizes without the wrap risk a wider face would have |
| H1 | `text-4xl md:text-5xl` / `leading-tight` | Anton | Section headlines |
| Editorial accent | `text-2xl md:text-3xl italic` / `leading-snug` | Playfair Display | Pull-quotes, mission statement, hero sub-line |
| H2 | `text-xl font-semibold` | Nunito | Card group titles |
| Body | `text-base text-ink-950/80 leading-relaxed` | Nunito | Default paragraph text — public pages run larger than dashboard text by design (§1's lower density dial) |
| Small/meta | `text-sm` | Nunito | Captions, footer, timestamps |
| Large stat | `text-4xl md:text-5xl` / `tabular-nums` | Playfair Display | Stat-strip numbers (543 MPs, ₹ Cr total) — serif numerals read as "credible publication," distinct from a dashboard's mono figures |

**Operate (v1, unchanged):** Inter scale as originally specified — Display `text-4xl md:text-5xl`, H1 `text-3xl`, H2 `text-xl`, H3 `text-base font-semibold`, Body `text-sm text-slate-700`, Small `text-xs text-slate-500`, numeric always `font-mono tabular-nums`.

The old blanket rule "no `text-6xl`/`text-7xl` anywhere" is now Operate-only — Persuade's raised `DESIGN_VARIANCE`/`MOTION_INTENSITY` dials (§1) explicitly earn a large hero per taste-skill §4.7's hero font-scale discipline: headline is short (≤6 words), so the larger scale is justified, not an error.

---

## 5. Layout, spacing, shape

- **Grid:** `max-w-[1400px] mx-auto` for dashboard shells (DM/Ministry need the width for data density); `max-w-5xl mx-auto` for public/read-focused pages (project detail, contractor profile).
- **Breakpoints:** standard Tailwind (`sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`). Jan-Pramaan mobile-web flow is designed mobile-first, not as a shrunk desktop view — it's the primary surface for that module, not a fallback.
- **Corner radius — locked scale (Shape Consistency Lock):**
  - Buttons & inputs: `rounded-md` (6px)
  - Cards & panels: `rounded-lg` (8px)
  - Status badges & pills (risk tier, KYC badge, project stage chip): `rounded-full`
  - No other radius values anywhere in the product.
- **Elevation:** cards use a 1px `border-slate-200` by default, not shadow. Shadow (`shadow-sm`, tinted to `slate-900/5`) is reserved for genuinely floating elements — modals, dropdowns, the DM photo-gallery lightbox. Never a shadow on a static in-flow card (taste-skill §4.4).
- **Viewport stability:** any full-height section (Jan-Pramaan mobile capture flow, Ministry landing hero) uses `min-h-[100dvh]`, never `h-screen`, to avoid iOS Safari chrome jumping.

---

## 6. Motion (per `/design-motion-principles`)

**v2 split — designer weighting now differs by mode:**

- **Persuade surfaces (public site):** primarily **Jakub Krehel** (production polish, delight, "is this subtle and polished enough to ship") with **Jhey Tompkins** newly in play for specific moments (hover physics on the audience cards, the hero's floating constellation motif) — matching the "worldly/lively/interactive" brief. **Emil's restraint still gates *frequency*, not presence** — see §6.1, occasional-use surfaces earn more motion than frequent-use ones even within Persuade.
- **Operate surfaces (unchanged):** primarily **Emil Kowalski** (restraint, speed) — this reasoning is untouched from v1, because the DM/Ministry dashboards weren't part of the v2 brief. **Jhey Tompkins remains unweighted on Operate surfaces** — no playful/experimental motion on the dashboards; it would still undercut the trust-first tone there.

### 6.1 The frequency gate, applied per surface

| Surface | Typical frequency | Motion budget |
|---|---|---|
| DM Alerts Inbox, Approvals log, Ministry dashboard | 100s of views/day, keyboard-navigated | **No animation, or instant (<100ms) transitions only.** Table sorts, tab switches, filter changes = instant. |
| Contractor portal (bids, milestones) | Daily | Subtle, fast (≤200ms) — a milestone step completing can ease in once, not loop. |
| Public project listing/detail | Occasional (a citizen checking once) | Subtle entrance on scroll is acceptable (`whileInView`, per taste-skill §5.C) — but never required for comprehension. |
| Jan-Pramaan mobile capture flow | Rare per citizen, high-stakes single moment | The one place a slightly more expressive, reassuring motion is earned — a confirmed checkmark animation on successful submission communicates "this worked" to a non-technical user on a spotty connection. Keep it under 400ms and make it a single clear signal, not a flourish. |

### 6.2 Duration guidelines

**Operate (unchanged):** under 300ms, 180ms ideal. No spring physics or cinematic easing on dashboard chrome — instant clarity beats delight when someone's job is triaging fraud alerts.

**Persuade (v2):** 200–500ms with gentle spring/ease-out on hover and entrance transitions — hero constellation drift, card hover-lift, scroll-reveal stagger. Still never cinematic/physics-heavy (that's a `MOTION_INTENSITY 9-10` register this product never reaches) — think "confident editorial site," not "agency showreel."

### 6.3 Rules that apply everywhere, no exceptions

- **`prefers-reduced-motion` is mandatory** on every animated element in the product — no exceptions, per design-motion-principles' accessibility mandate.
- **No infinite loops** anywhere except the single justified case: a subtle pulse on an "Awaiting Citizen Verification" status chip, because it's communicating an active/pending state, not decoration. One pulse animation, reused everywhere that state appears — never invented per-component.
- **Motion must be motivated.** Before adding any transition, name what it communicates (hierarchy, state-change feedback, sequence) — "it looked nice" is not a valid reason in this product.
- **No marquees, no scroll-hijacking, no GSAP pin/scrub patterns anywhere.** Those tools exist in the taste-skill's toolbox for agency/landing work; this product's dial values (§1) rule them out entirely.

---

## 7. Persuade vs. Operate (per `/impeccable`'s mode framework)

Applying Impeccable's mode-by-surface model, not mode-by-product:

| Surface | Mode | What that means concretely |
|---|---|---|
| Public project listing, project detail, contractor public profile, Ministry landing (unauthenticated view of the concept) | **Persuade** | Earn trust and action ("verify this project," "check this contractor") — slightly more visual breathing room, real imagery for project photos, but still inside the locked palette/type/motion system. Never a marketing-style hero with a vague CTA — every CTA here does one specific job ("View Timeline," "Verify This Project"). |
| Jan-Pramaan mobile-web flow | **Persuade** (task-focused) | Success = the citizen completes one clear task in under a minute. Every screen is one decision. |
| Contractor authenticated portal, DM Dashboard, Ministry authenticated dashboard | **Operate** | Scanability and consistency outrank expression. Brand lives in precise details — the navy accent on active nav, the locked risk-color system, the mono numerals — not in decorative flourish. |

No surface is ever **Read** (docs/help) or **Experience** (portfolio/gallery) mode in this product — noted for completeness, not because it needs building.

---

## 8. Component patterns (cross-cutting)

- **Status/stage chip:** pill, risk-triad or stage-colored, `text-xs font-medium`, used identically for project stage (Sanctioned→...→Payment Released) and risk tier — but with visually distinct color families (stage = navy/slate neutral progression; risk = the semantic triad in §3.3) so the two concepts are never visually confused on the same card.
- **Risk badge:** always pairs a color-coded pill with the numeric `risk_score` in mono tabular figures (e.g. `🔴 78%`) — never color alone (accessibility: don't rely on hue only).
- **KYC badge:** binary Verified/Unverified — Verified uses `Healthy` green, Unverified uses neutral `slate-400`, **not** amber/red (unverified isn't a risk flag, it's a status).
- **Justification-note field:** every DM decision surface (Alerts Inbox actions, Audit Log) uses the same required-textarea pattern — label above, error below, per taste-skill §4.6.
- **Consensus meter:** a simple horizontal split bar (thumbs-up navy / thumbs-down slate) plus the raw count text ("5 submitted — 👍 4 👎 1") — never a full gauge/dial chart, which would overstate precision on what's fundamentally a small sample count.
- **Sankey (Fund Tracker):** nodes colored by entity type (Ministry/State/District/Contractor) using the navy scale (§3.1) by depth, never risk colors — a fund flow isn't inherently risky, only `parked_funds` aging past threshold gets a Watch/Flagged treatment as a separate badge alongside the diagram.
- **Collusion graph:** nodes sized/colored by connection count using the risk triad (more connections = more flagged); this is the one place risk color legitimately drives a data-viz encoding rather than just a badge.

---

## 9. Copy & content discipline

Per taste-skill §4.9's Copy Self-Audit — applied strictly here because this product's credibility depends on it:

- No AI-cute copy, no forced metaphors, no "elegant nothing" phrases. Every string should survive being read by a skeptical DM.
- Fake-precise numbers are fine *only* because they're structurally documented as illustrative in brain.md §4 — but nothing beyond what's specified there gets invented at the copy layer. Don't let UI copy imply certainty the data model doesn't have (e.g., never phrase a sample alert as "confirmed fraud" — always "flagged for review").
- One copy register per surface: DM/Ministry dashboards are terse and technical; Jan-Pramaan mobile is the plainest language in the product; public pages sit in between.

---

## 10. Accessibility baseline (non-negotiable, public-sector context)

- WCAG AA minimum everywhere: 4.5:1 body text, 3:1 large text/UI components.
- Every risk/status signal pairs color with text or an icon — never color-only.
- Button/CTA contrast audited per taste-skill §4.5 (no white-on-white, no unbordered ghost buttons over photos).
- Camera-capture flow (Jan-Pramaan) and all forms are keyboard- and screen-reader-navigable even though the primary Jan-Pramaan path is touch/camera.
- `prefers-reduced-motion` and `prefers-color-scheme` both respected (see §6.3 and §11).

---

## 11. Light/dark mode

**Default: light mode, page-level lock (taste-skill §4.11).** Public trust/government context reads better in light mode by default; dashboards get an optional dark theme for the DM/Ministry "operations room" context, but it's a full page-level toggle, not per-section — if dark, every section on that view is dark (`navy-950`/`slate-900` backgrounds, `slate-200` body text), never a mixed light card inside a dark dashboard.

---

## 12. Implementation notes (ties to trd.md's stack choice)

- Design system foundation: **Tailwind v4 utilities + shadcn/ui**, per taste-skill §2.A's "Modern SaaS where you own the components" — the right fit given five distinct role-based UIs need to share one component set without vendoring a heavy enterprise DS (Fluent/Carbon) this product doesn't otherwise need.
- Fonts loaded via `next/font/google` for both systems — **Anton, Playfair Display, Nunito** for Persuade surfaces; **Inter, IBM Plex Mono** for Operate surfaces (§4.1) — never a runtime Google Fonts `<link>`, even though the user's brief supplied `<link>`-tag snippets; `next/font` achieves the same fonts with self-hosting, zero layout shift, and no external request, which is a strict upgrade on the pasted snippet, not a deviation from the brief.
- Icons: one family only, `@phosphor-icons/react` (taste-skill §3.C priority list) — `strokeWidth 1.5` standardized. No hand-rolled SVG icons *except* the hero's constellation motif and nav wordmark, both simple geometric marks per taste-skill §4.8's exception clause. No hand-rolled SVG icons; the collusion-graph nodes and Sankey are the only hand-built visual/data components in the product, both explicitly justified in trd.md.
- All color tokens above should be defined once as Tailwind theme extensions / CSS variables, never hard-coded per component — this is what makes the Color Consistency Lock (Operate) and the marigold/teal usage discipline (§3.0, Persuade) enforceable in code review, not just in this document.
- Persuade-surface interactivity (hover-lift cards, scroll-reveal, constellation drift) is built with CSS transitions/keyframes plus a small IntersectionObserver-based `Reveal` client component — not a new animation library dependency — keeping bundle weight down while still delivering real motion per §6.
