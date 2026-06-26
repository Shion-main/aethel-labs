# Session — 2026-06-27 — Build-out: full site, hero glass shards, Ethos→Services reveal, context system

Branch: `feat/website-build`. Dev server on :3005.

## Goals this session
Build the Aethel Labs site from an approved spec/plan, then iterate on the hero brand
animation and a bespoke section transition, harden motion quality, and stand up a
persistent project-memory system.

## What got built (in order)

**Phases 1–3 (subagent-driven from the plan):**
- Phase 1: Next.js 16 + React 19 + TS scaffold, Vitest, design tokens, `lib/moods.ts`,
  typed `lib/content.ts`, brand SVGs + `Mark`, shared `Section`, 10 data-driven sections,
  composed page + Inter + metadata. (commits `2a87da2`→`d9db33f`)
- Phase 2: GSAP/ScrollTrigger/Lenis, pure `lib/interpolate.ts` (tested), `SmoothScroll`,
  `HorizontalTrack` (pin+translate), `MoodBackground` + `Experience` wiring. (`0bfeac5`→`a13cd55`)
- Phase 3: 4-part mark breakdown, scroll-scrubbed `LogoBuild`, `Reveal` entrances,
  **floating glass vertical `SideNav`**. (`5a8c011`→`45d9e41`)

**Hero redesign (impeccable + direct browser iteration):**
- `b2b41a1` glass-shard `HeroScene` (4 part PNGs as CSS-mask frosted shards) + favicon
  sidebar glyph (mood-adaptive). `86f6d57` right gutter + tamed pitch sizing.
- `93d1c27` shards rest OUTSIDE the headline → sweep in & assemble; earlier+aligned crisp
  logo resolve; pitch background; hero zoom-out on exit.

**Ethos→Services "blocking panel" reveal:**
- `f6784f1` first (wrong) attempt: solid Services wipe.
- `7038435` correct mechanic: Services pinned behind (`PinBehind`), solid Ethos slides off
  to reveal it (z-index `#pitch`>`#services`).
- `3674607` fixed direction: `EthosPanel` is pinned + clip-path peels **left→right**, so
  Services reveals content-first (no empty margin leading). VERIFIED in browser.

**Emil-design-eng audit + fixes (`6832edf`):**
- Per-FRAME `<body>` CSS-var writes → **per-section discrete** (avoids whole-doc recalc).
- Hero backdrop-filters 6→2 (only front shards). Button `:active` scale. Sidebar label
  220ms custom curve. `Reveal` safety-net timeout (never ships blank).

**Context system (`2875bbd`):** `.context/` (MAP.md, README.md, sessions/), root `CLAUDE.md`
auto-load, `.agents/` gitignored.

## Key decisions
- **Higgsfield MCP connected but ON HOLD** — Emil audit concluded AI video on the LCP hero
  hurts purpose/cohesion/perf/brand-crispness and isn't iterable. If ever used: off-site
  teaser or reference-only (rebuild beats in GSAP). User had 10 credits (free); 5s Kling ≈7.5cr.
- Skills installed: GSAP official set, emil-design-eng, review-animations, frontend-design,
  skill-creator (in `.agents/`+`.claude/`, gitignored).
- Only **Ethos (Pitch)** is solid; **Services is not** (revealed behind).

## State at end
- 25 tests pass, tsc clean, dev server healthy on :3005. Phases 1–3 complete + hero/reveal polish.
- Latest commit: `2875bbd`.

## Open threads / next
- Phase 4 unbuilt: real ContactForm + `app/api/contact/route.ts` (Resend), mobile QA,
  SEO/OG + JSON-LD, deploy. Placeholders: pricing, BrewKnot/Kinetix/Apex samples, socials, domain.
- Tuning candidates: soften Ethos peel seam; maybe extend blocking-panel reveal to later
  boundaries; centralize hardcoded Work/Packages/Process headings into `content.ts`;
  Footer `<footer>` landmark; remove unused `LogoBuild`.
- Awaiting user verdict on the left-to-right Ethos reveal feel.
