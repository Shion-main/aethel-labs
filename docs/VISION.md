# Aethel Labs — Site Vision

> The north star for the website. Read before planning or building. We agree on *this*
> before any code. Last updated: 2026-06-28.

---

## The one sentence

**A site that builds itself as you scroll — so the act of designing *is* the proof that we
design and build.**

Most studios *claim* "design and build under one roof." Aethel's site demonstrates it: the
visitor watches raw construction become a finished brand, in real time, under their own scroll.
The medium is the message.

---

## The thesis (why this concept, not another)

Aethel does the rare full thing — brand **and** the thing it lives on, idea **and** execution,
under one roof. The site has to *be* that, not just say it. So the website performs its own
making: bare frames → solid shapes → brand color → a finished mark. By the end of the scroll,
scattered construction pieces have assembled into the Aethel frame-monogram. Watching that
happen is the pitch. Nobody can copy a claim they have to *earn* on screen.

This is ownable, memorable, and hard to fake. It's "design worth the name" made literal.

---

## The build-spine (the heart of it)

There is **one** thing that carries the "it builds" feeling: **the brand mark assembling**,
threaded through the entire scroll as a persistent, scroll-driven background.

Three stages, mapped to scroll progress:

1. **Frames** — bare wireframe outlines, construction lines, a skeleton. The "nothing yet."
2. **Shapes** — the frames fill into solid geometry, form, mass.
3. **Color** — the forms take on the brand (ember, ink, the gradient). The finished state.

…resolving, by the end, into the **complete frame-monogram**. The scattered components were the
logo all along.

This single spine carries the whole concept by itself. It is the only element allowed to be the
star.

---

## The discipline that makes it premium (non-negotiable)

> **"Everything builds" is a *feeling*, not a literal rule.**

If every element on every section animates in, we don't get "the site builds" — we get visual
noise, the over-animated look, and a reader stuck *waiting for content to arrive*. That fights
the site's actual job. The line between "expensive studio" and "tech demo" is restraint.

So:

- **Background = alive and building.** One spine, doing the work.
- **Foreground = composed and confident.** The real copy, work, packages, and contact read
  **instantly**. Only *restrained* entrance motion (a short rise/fade, content-first) — never
  blocking, never gating legibility.

That contrast *is* the craft: the background makes a promise; the stillness proves we can be
trusted with it. (This is also exactly what the Aethel design system already mandates:
*"Calm and deliberate. No bounce. No infinite decorative loops."*)

---

## Medium: code, not video (decided)

The build is **scroll-coupled**, so it must be built in **code** — SVG + GSAP ScrollTrigger —
**not video**. Reasoning:

| Concern | Why video loses | Why code wins |
|---|---|---|
| Scroll-scrubbing | Decoding frames per scroll tick; Safari/iOS throttle it → jank | ScrollTrigger `scrub` ties progress→frame perfectly |
| Crispness | Raster, blurs on retina, artifacts on flat brand color | Vector, razor-sharp at any size |
| Theme | Locked to render | Driven by color tokens; adapts per section |
| Accessibility | All-or-nothing | Graceful static fallback for reduced-motion |
| LCP / weight | Heavy hero element (our own audit flagged this) | Lightweight; the build *is* the content |
| Editing | Re-render in After Effects per tweak | Change a token or path |

**Toolkit (all already in the repo):** `gsap-scrolltrigger` (the spine), `gsap-timeline`
(sequencing the three stages), `gsap-plugins` → **DrawSVG** (the "frames being drawn" stage) and
**MorphSVG** (shapes morphing), `gsap-react` (integration), `gsap-performance` (60fps).
Lottie is the only alternative we'd revisit — *and only if* we later decide the build should be
hand-drawn/painterly rather than geometric.

---

## Guardrails (from Aethel's own design system)

- Animate **transform / opacity / clip-path / SVG paths** only. No layout thrashing.
- **Motion never gates content.** Reveals have a fallback so content never ships blank.
- **Reduced-motion / mobile:** the spine degrades to a clean static state; the page is fully
  legible with zero motion.
- Calm easing, durations ~140–480ms, **no bounce, no infinite loops.**
- Keep heavy effects (backdrop-filter, etc.) rare and off the LCP path.

---

## The feeling we're aiming for

First 3 seconds: **"this studio is the real thing."** Quietly confident, architectural,
warm-but-serious. The word they walk away with: **considered.** (Not "flashy.")

---

## Resolved

1. **Scroll axis / layout → HORIZONTAL cinematic.** The world slides sideways (evolving the
   current build's engine), *not* the design system's vertical layout.
2. **Visual surface → WARM-PAPER base with DARK INK bands.** Adopt the design system's palette.
   Dark ink panels: hero, approach, about, footer. Warm paper panels: services, work, process,
   packages, contact. As the world slides, paper ↔ ink panels pass each other (dark/light rhythm
   on the horizontal axis). Retune the existing `MoodBackground` palette from "dark moody" to
   paper / ink / ember.

### How horizontal + the build-spine reconcile (the important bit)

They are **one motion, not two.** The horizontal travel and the mark's assembly ride the **same
scroll progress** (the codebase already has a single `progress` 0..1 driving everything). As the
world slides left, the mark builds frames → shapes → color; the **logo completes exactly as the
final panel arrives.** This is how we keep "one spine" — the sideways cinema *is* the build, not a
second competing gimmick.

### How "reads instantly" survives a sideways layout

Nobody reads sideways. Each panel is a **self-contained, vertically-composed editorial unit** —
land on a panel, read it top-to-bottom normally. Only the **transitions between** panels travel
horizontally. The contact form gets its own calm panel. Mobile / coarse-pointer keeps the
existing **vertical-stack fallback**. Cinema in the hand-offs; conventional reading within each
panel.

### More resolved

3. **Relationship to what's built → EVOLVE THE CURRENT ENGINE IN PLACE, reskinned.** Keep the
   horizontal track, single `progress`, `MoodBackground`, `SideNav`, and the shard-hero; retune
   palette to the design system, swap fonts, rebuild sections with the new component primitives,
   and grow the shard-hero into the full whole-page build-spine. Not a from-scratch rebuild.
4. **Span → WHOLE-PAGE BACKBONE.** The build is the spine of the entire scroll; the **logo
   completes at the final panel.** Hero starts the build (raw frames); every panel advances it;
   arrival = finished mark.

### The build, concretely — Direction A (resolved)

5. **What the visitor watches build → THE MARK'S OWN ANATOMY.** The scattered pieces *are* the
   logo's geometric parts (bar / blade / leg / counter — the existing `MarkParts`, plus a couple
   more if the mark needs them). Per part, mapped to scroll progress:
   - **Frames** — the part's outline **draws itself** (GSAP DrawSVG), a thin construction stroke.
   - **Shapes** — the outline **fills** to a solid form / mass.
   - **Color** — the form takes the **brand gradient / ember-ink**.
   - **Assemble** — on the final panel the parts **fly together and lock** into the complete mark.

   The parts are scattered in the panel margins (clear of the editorial foreground) and advance
   stage-by-stage as the world slides. Because a bare wireframe part is **abstract**, the visitor
   doesn't realize it's the logo until it assembles — the "oh, it was the mark all along" reveal
   comes for free, with no extra clutter. A *whisper* of Direction B (a faint grid behind a
   panel) may be layered later, but only once the spine is solid.

### Fonts (resolved)

6. **Fonts → `next/font`, self-hosted.** Hanken Grotesk + Geist Mono via `next/font/google`;
   Shippori Antique via `next/font/google` pinned to `subsets: ['latin']` (sidesteps the CJK
   subset-splitting the design system flagged), falling back to `next/font/local` with the
   vendored Fontsource `woff2` if needed. Same fonts as the design system, self-hosted, no CDN,
   better LCP. Matches the repo's existing Inter-via-`next/font` setup.

## Inspiration — canals-amsterdam.com (studied 2026-06-28)

The reference that drove the horizontal-scroll instinct. A horizontal, drag-to-navigate
**WebGL** experience: chaptered ("four-part") cinematic story, near-monochrome (black) ground
with a **single electric accent** (red), **enormous display type** composited over imagery,
**hard white wipe-cut** transitions, an editorial rotated-label sidebar.

**Adopt (translated to Aethel's brand):**
- Push **Shippori display type much bigger**; let headlines overlap panel imagery.
- **Hard wipe/cut transitions** between panels (the repo once had a `WipePanel.tsx`).
- **Single-accent restraint** (ember is our red) — already our rule.
- **Editorial sidebar** with vertical labels — the `SideNav` already leans this way.
- Light **parallax** (near/far layers at different scroll speeds) for depth — cheap, on-stack.

**Diverge (deliberately not canals):**
- **Warm-paper + dark bands**, not black + electric red. (Mood reconfirmed after seeing canals.)
- **Crisp SVG + GSAP**, not WebGL (see rendering decision below).

### Rendering decision — SVG + GSAP now; WebGL deferred

**Decided:** build in **crisp SVG + GSAP**. WebGL is **not** part of the core build. Reasons:
the build-spine is geometric (SVG is its natural medium; WebGL would only decorate the
atmosphere, not improve the mark assembly); WebGL's worth can only be judged against the real
site, not a mockup; SVG keeps text real/fast/theme-able/accessible (the "read and booked" job);
and because we keep real DOM/SVG, a WebGL layer stays cleanly additive later — deferring forfeits
nothing.

**Optional Phase 6 (only greenlit after the real site exists):** a **hybrid WebGL atmosphere
layer** rendered *behind* the readable foreground (richer build-spine backdrop / shader color /
fluid imagery), never the foreground. Prototype the hero first before committing.

### Phase 6 blueprint — the 14islands progressive-enhancement pattern

References the user surfaced (studied 2026-06-28): **14islands.com** (HTML-first, editorial, huge
type; the studio behind the approach) and **podium.global** (WebGL-first; a 57→82% preloader and a
blank render when WebGL doesn't init — the cautionary model). Article:
*Progressive Enhancement with WebGL and React* (14islands).

The pattern, which fits our stack (React 19 + Lenis already in place):
- **DOM/SVG site is the source of truth** — built first, works with no JS and no WebGL.
- **One shared, persistent `<canvas>` behind the DOM.** Components opt in (a `useCanvas()`-style
  hook); the canvas survives route changes.
- **"Proxy" DOM elements drive the WebGL scene** — the canvas reads DOM element rects and
  scroll, positions its 3D content to match, with easing for smoothness. Library lineage:
  `@14islands/r3f-scroll-rig` (react-three-fiber + smooth scroll).
- **Fallback ladder:** no-JS → readable content · no-WebGL → CSS/hover states · WebGL → full effects.
- **Guardrails (their words):** *"if load time and maximum device support is your highest
  priority, you shouldn't use WebGL at all"*; virtual scroll needed for smooth sync hurts a11y;
  watch image-load scroll-jank. So: enhancement only, never the foundation; measure before/after.

## All threads resolved — ready to plan

Every open question is now decided. The next artifact is an **implementation plan** (phased),
for sign-off **before any code** — per the "reframe from editing" directive.

---

## What we've signed off on

- The concept: **the site builds itself as you scroll**; the medium proves the thesis.
- **One spine** (the mark assembling: frames → shapes → color → finished logo) carries the build;
  the foreground stays **editorial, legible, content-first.**
- Built in **code (SVG + GSAP), not video.**
- **Horizontal** cinematic scroll — the sideways travel *is* the build (same progress value).
- **Warm-paper base + dark ink bands** (the design system palette); paper ↔ ink panels slide past.
- Restraint is the rule — calm, deliberate, no noise.
