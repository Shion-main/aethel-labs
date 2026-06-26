# Aethel Labs — Codebase Map

> Token-efficient reference. Read this before exploring source. Keep current when code changes.
> Last updated: 2026-06-27.

## 1. What this is

A single-page, **horizontally-scrolling cinematic studio website** for Aethel Labs (a brand & web studio). Every scroll moves the world sideways; the brand mark builds from scattered glass shards; the background atmosphere morphs section-by-section; certain section hand-offs are bespoke (e.g. a solid panel peels away to reveal the next section pinned behind it).

- **Register:** brand (design IS the product). See `PRODUCT.md`.
- **Spec:** `docs/superpowers/specs/2026-06-26-aethel-labs-website-design.md`
- **Plan:** `docs/superpowers/plans/2026-06-26-aethel-labs-website.md`
- **Copy source:** `aethel-labs-website-copy.md`
- **Brand assets (source):** `Aethel labs assets/` (SVGs, favicons, primary logos, `logo parts/Frame 62–65.png`).

## 2. Stack & commands

- **Next.js 16 (App Router, Turbopack) + React 19 + TypeScript.** CSS Modules + global CSS custom properties (no Tailwind).
- **Motion:** GSAP + ScrollTrigger + `@gsap/react` (`useGSAP`), Lenis (smooth scroll).
- **Tests:** Vitest + React Testing Library (jsdom). `npm test` (25 tests). jsdom stubs for `matchMedia` + `IntersectionObserver` in `vitest.setup.ts`.
- **Email (planned, Phase 4):** Resend.
- **Dev:** `npm run dev -- -p 3005` (runs on :3005). **Don't run `npm run build` while dev server is up** (both touch `.next`). Verify with `npx tsc --noEmit` + `npm test`.
- Branch: `feat/website-build`.

## 3. How the experience works (core mental model)

The page is **10 section panels in a flex row** inside a pinned viewport. Vertical scroll is mapped to **horizontal translate** of the track (the world slides left). A shared **scroll progress (0..1)** value drives everything else.

- `app/page.tsx` → `<Experience>` wraps the 10 sections.
- `Experience` holds `progress` state and provides it via **`ProgressContext`**; renders `MoodBackground`, `HorizontalTrack` (with the sections as children), and `SideNav`.
- `HorizontalTrack` pins the viewport and tweens the track's `x` from 0 to `-(scrollWidth - innerWidth)` via ScrollTrigger `scrub`, calling `onProgress(self.progress)` each frame.
- **Panel geometry:** each section is `flex: 0 0 100vw`. Section `i` (0-indexed) on-screen left = `i*100vw − progress*900vw` (10 panels → track travel = 9*100vw = 900vw). Section `i` is centered at `progress = i/9`.
- **Reduced-motion / mobile (≤820px or coarse pointer):** `HorizontalTrack` skips the pin; CSS falls back to a **vertical stack**, and `progress` stays 0 (so progress-driven effects are inert/static).

## 4. File map

```
app/
  layout.tsx            Root layout: Inter font (var --font-inter), metadata.
  page.tsx              Composes <Experience> with the 10 sections in order.
  globals.css           Design tokens (brand + live mood vars), base resets, :focus-visible.
lib/
  moods.ts              SectionId type, Palette type, `moods` map (10 sections), `sectionOrder`, ACCENT.
  interpolate.ts        Pure color math: lerp, lerpColor, paletteAt(progress) → blended Palette. (tested)
  content.ts            All site copy/projects/packages as typed `content` (single source of truth). (tested)
  gsap.ts               Registers ScrollTrigger + useGSAP; exports { gsap, ScrollTrigger, useGSAP }.
components/
  scroll/
    Experience.tsx      Client shell: progress state + ProgressContext provider; renders bg/track/nav.
    ProgressContext.tsx createContext(0) + useProgress() — live scroll progress to descendants.
    SmoothScroll.tsx    Lenis provider, drives ScrollTrigger.update; disabled under reduced-motion.
    HorizontalTrack.tsx Pin + scroll→x translate; reports progress; CSS vertical fallback.
    HorizontalTrack.module.css   .viewport/.track/.track>section sizing + reduced-motion/≤820px fallback.
    MoodBackground.tsx  Fixed glow layer. Per-FRAME: --bg-core/--bg-edge/--glow-x on its own el (cheap).
                        Per-SECTION (discrete, on active-index change): --surface-text/--surface-accent on <body>.
    MoodBackground.module.css    .bg radial-gradient from the live vars.
  brand/
    Mark.tsx            Static logo (next/image): variant "full" | "glyph".
    parts.tsx           MarkParts: 4 <g data-part="bar|blade|leg|counter"> for the build (clip-band approx).
    LogoBuild.tsx       (legacy) progress-scrubbed assembly of MarkParts. NOTE: hero now uses HeroScene; LogoBuild is unused.
    LogoBuild.module.css
  nav/
    SideNav.tsx         Floating glass vertical sidebar: inline favicon glyph (currentColor=accent),
                        vertical active-section label, nav dots (scroll-to-section), reads useProgress().
    SideNav.module.css  Glass capsule, mood-adaptive (var --surface-text/--surface-accent), vertical label, dots.
  layout/
    Section.tsx         Shared <section id> shell: theme dark|light, position:relative, right gutter for sidebar.
    Section.module.css  .section/.light/.inner; color transition 400ms (smooths discrete mood snap).
    Reveal.tsx          IntersectionObserver fade/rise-in; reduced-motion safe; 1.6s fallback so content never ships blank.
  sections/
    Hero.tsx            Uses <HeroScene> wrapping the headline/sub/CTAs.
    HeroScene.tsx       THE HERO. 4 logo-part PNGs as frosted-glass shards (CSS mask), scattered in the
                        margins at rest → fly in & assemble on scroll → cross-fade to crisp full logo;
                        then the hero zooms out on exit. Only 2 front shards use backdrop-filter (perf).
    HeroScene.module.css         .scene/.pane1-2/.stage/.shard/.resolved/.mid layout + z-layers.
    Pitch.tsx           "Ethos". Uses <EthosPanel> (solid) wrapping <ZoomIn><Reveal> statement.
    EthosPanel.tsx      Solid #0b0b0d panel; pinned (counters track slide) + clip-path peels LEFT→RIGHT
                        across [1/9, 2/9] to uncover Services behind it. Reduced-motion: stays solid.
    Services.tsx        "What We Do". Wrapped in <PinBehind index=2> so it sits still behind Ethos and is
                        revealed as Ethos peels away (NOT solid).
    PinBehind.tsx       Counter-translates children to hold a section still at the viewport across [start,end]
                        (the "already there behind the panel" effect). Inert when progress 0 (fallback).
    ZoomIn.tsx          Scales children 0.8→1 as a panel reaches its center (entrance zoom).
    Frame.tsx Work.tsx Process.tsx Packages.tsx About.tsx Contact.tsx Footer.tsx   data-driven static sections.
    sections.module.css Shared section styles: eyebrow, headline, .statement, .btn(+:active), cards, grids,
                        table, steps, .heroText, pitch bg helpers, :global(#pitch z3)/(#services z2) for the reveal.
  ui/
    ContactForm.tsx     STUB ("coming in Phase 4"). Real form (Resend) not built yet.
public/brand/           logo-full-white/ink.svg, mark-white/gradient.svg, parts/part-bar|blade|leg|counter.png, (og later)
test/                   Vitest specs mirroring lib/ + components (moods, interpolate, content, mark, section, sections, parts, sidenav, smoke).
```

## 5. Key systems (detail)

- **Progress plumbing:** `Experience` `useState(progress)` → `ProgressContext`. Only context consumers (LogoBuild/HeroScene, SideNav, PinBehind, ZoomIn, EthosPanel, MoodBackground) re-render per frame; the 10 sections are stable `children` and don't.
- **Mood arc (per `lib/moods.ts`):** hero=Ink&Ember, pitch=Obsidian, services=Deep Ink, frame=Ember peak, work=Ivory, process=Cool Ink, packages=Ivory, about=Warm Ink, contact=Ember, footer=Deep Ink. `paletteAt()` blends between stops by progress.
- **Hero (HeroScene):** shards rest in the right/top/bottom margins (clear of the left headline), fly to a centre assembly (`left:52%`) by `BUILD_END=0.038`, cross-fade to `logo-full-white.svg`; whole scene `scale`+`opacity` zoom-out on exit toward the pitch. Shard shapes come from the part PNGs used as CSS `mask`.
- **Ethos→Services "blocking panel" reveal:** Ethos (Pitch) is the only SOLID section; it's pinned + clip-path peeled LEFT→RIGHT (`EthosPanel`), while Services is pinned behind it (`PinBehind index=2`) and `#pitch` has higher z-index than `#services`. Window = `[1/9, 2/9]`.
- **Performance rules in force (Emil audit):** only animate transform/opacity/clip-path; surface CSS vars updated **per-section not per-frame** (avoid whole-document recalc); backdrop-filter limited to 2 hero shards; buttons have `:active` scale; reveals never gate visibility (fallback timeout).

## 6. Brand tokens (`globals.css` + `lib/moods.ts`)

- Ember `#c75d3a`, Ember-soft `#e8a98f`, Ink `#0a1a2f`, Ink-deep `#070d16`, Ivory `#f6f2ec`→`#ece5da`.
- Live mood vars: `--bg-core`, `--bg-edge`, `--glow-x` (on MoodBackground el); `--surface-text`, `--surface-accent` (on body, per section). `--font-sans` = Inter.

## 7. Status & open threads (2026-06-27)

- **Done:** Phase 1 (static), Phase 2 (horizontal + mood), Phase 3 (logo build, reveals, glass sidebar). Hero glass-shard scene + favicon sidebar glyph. Ethos→Services blocking-panel reveal (left-to-right). Emil perf/polish pass.
- **Not built yet (Phase 4):** real ContactForm + `app/api/contact/route.ts` (Resend), mobile/responsive QA, SEO/OG image + JSON-LD, deploy to Vercel. Pricing numbers / extra work samples (BrewKnot/Kinetix/Apex) / socials / domain are placeholders.
- **Higgsfield MCP:** connected, but **on hold** per Emil audit (don't put AI video on the LCP hero; if used, off-site teaser or reference-only). User balance was 10 credits (free); a 5s Kling clip ≈ 7.5 cr.
- **Possible follow-ups:** soften the Ethos peel seam; extend the "blocking panel" reveal to later boundaries if desired; centralize hardcoded Work/Packages/Process headings into `content.ts`; give Footer a real `<footer>` landmark; remove unused `LogoBuild`.

## 8. Tooling / skills available

- Installed skills (in `.agents/skills/` & `.claude/skills/`, gitignored): GSAP official set (`gsap-core/scrolltrigger/timeline/react/plugins/performance/utils/frameworks`), `emil-design-eng` + `review-animations` (motion taste), `frontend-design`, `skill-creator`, `impeccable`.
- `.claude/` and `.agents/` are agent tooling, gitignored (kept local).
