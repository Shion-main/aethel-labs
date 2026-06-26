# Aethel Labs — Website Design Spec

**Date:** 2026-06-26
**Status:** Approved (design), pending implementation plan
**Author:** Aethel Labs (with Claude)

A single-page, horizontally-scrolling cinematic studio site for Aethel Labs (brand & web studio). Every scroll moves the world sideways; the brand mark builds from its parts as you scroll; the background atmosphere morphs section-by-section through a deliberate light/dark mood arc.

---

## 1. Goals & Non-Goals

**Goals**
- A non-generic, cinematic one-page site that demonstrates the studio's craft by *being* a piece of craft.
- Pure **horizontal scroll** as the core navigation feel (Apple/Samsung style), reliable across devices.
- A **scroll-scrubbed logo build animation** as the signature moment — the 4 logo parts assemble into the mark, then the wordmark resolves.
- A **scroll-driven mood background** ("the video that moves") that interpolates between per-section palettes.
- Ship a working, deployable site early and layer cinematics on top — never a big-bang.
- Fully accessible (reduced-motion) and responsive (sane mobile fallback).

**Non-Goals (this milestone)**
- No literal background video file (the moving background is rendered, not footage).
- No full 3D / WebGL world. Hero is built **Tier 1 (2D)** with a clean hook to upgrade to a 3D mark later.
- No CMS — copy lives in a typed config file.
- No blog, client portal, or e-commerce.

---

## 2. Core Scroll Mechanic

Horizontal movement is achieved with the **pinned-translate technique** (not wheel-hijacking):

- The page has real vertical scroll height (~1000vh, tuned per content). Content is **pinned** to the viewport.
- Scroll progress (wheel / trackpad / touch) maps to **horizontal `x` translation** of a track element. Forward scroll → world slides left; sections pass by sideways.
- Implemented with **GSAP + ScrollTrigger** (pin + scrub). **Lenis** adds momentum smoothing.
- This is device-robust (works with trackpads, mice, touch) and is the standard approach for award-style horizontal sites.

**Scrubbing:** sub-animations (logo build, section entrances, mood transitions) are tied to scroll progress via ScrollTrigger so they advance/reverse as the user scrolls — "every scroll matters."

---

## 3. Tech Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Familiar (same as Korte), native API route for the form, image optimization, easy Vercel deploys |
| Hosting | **Vercel** | Preview URLs, zero-config, matches the stack |
| Motion | **GSAP + ScrollTrigger** | Industry standard for pin/scrub/horizontal; now fully free |
| Smooth scroll | **Lenis** | Buttery momentum, integrates with ScrollTrigger |
| Contact email | **Resend** (via Next API route) | Confirmed; simple transactional email |
| Brand art | **Inline SVG** (from existing assets) | Razor-sharp, animatable, light, themeable |

Rendering is mostly static/prerendered; the only server code is the contact endpoint.

---

## 4. The Logo Build-Scrub (signature moment)

- The 4 logo parts (`Frame 62–65`) are reproduced as **separate inline SVG vector pieces**, derived from the primary logo SVG + the parts art.
- In the **Hero**, a GSAP timeline scrubbed by scroll: each part flies/rotates/clips in from off-stage → they lock into the assembled "7/Æ" mark → the **ÆTHEL LABS wordmark** draws/fades in. Reversible with scroll.
- Encapsulated as **`<LogoBuild mode="2d">`**.
- **3D upgrade hook:** a future `mode="3d"` (React Three Fiber, extruded mark) swaps in at the Frame section with **no changes to surrounding code**.

---

## 5. Mood-Background System ("the video that moves")

A **fixed full-viewport background layer** behind the horizontal track:

- A **radial ember→ink glow** that **parallax-drifts** (slower than foreground = depth) as you scroll.
- Per-section palettes (the approved 10-mood arc) stored in `lib/moods.ts`. As scroll progress crosses section boundaries, GSAP **interpolates** the palette via CSS custom properties (`--bg-core`, `--bg-edge`, `--ink`, `--text`).
- A subtle **grain/noise + slow light-drift overlay** (CSS/canvas) for a filmic, alive quality.
- **Shader upgrade hook:** the glow layer can later be replaced by a WebGL shader without touching sections.

### Approved Mood Arc

| # | Section | Mood | Palette intent |
|---|---------|------|----------------|
| 01 | Hero | Ink & Ember — dawn | Ember core glow on deep ink; logo builds here |
| 02 | The Pitch | Obsidian | Near-black, one spotlit line, single ember underline |
| 03 | Services | Deep Ink | Dark ink, three lit panels with ember edges |
| 04 | The Frame | Ember peak | Warm climax; assembled mark glows (future 3D moment) |
| 05 | Selected Work | Ivory gallery | Bright cut; projects as framed pieces; per-project color worlds |
| 06 | Process | Cool Ink | Dark; four steps draw along a horizontal line |
| 07 | Packages | Ivory | Light for clean, trustworthy, legible pricing |
| 08 | About | Warm Ink | Intimate; ember undertone; the æþel story |
| 09 | Contact | Ember glow | Warm invitation; one button |
| 10 | Footer | Deep Ink | Quiet, resolved close |

Rhythm: warm → dark → ink → ember peak → bright → ink → bright → warm → ember peak → dark. Brand beats glow ember; information sections go bright for readability; dark beats create drama between them.

### Brand Tokens

- **Ember** `#C75D3A`
- **Ink** `#0A1A2F` (deep navy-black; variant `#0E1A2E`)
- **Signature gradient:** radial ember → ink
- **Ivory** `#F6F2EC` → `#ECE5DA` (light sections)

---

## 6. Component Architecture

```
app/
  layout.tsx           // fonts, meta, JSON-LD
  page.tsx             // assembles the track
  api/contact/route.ts // form → Resend email
components/
  scroll/
    SmoothScroll.tsx    // Lenis provider
    HorizontalTrack.tsx // pin + scroll→x translate; registers sections
    MoodBackground.tsx  // fixed glow layer; interpolates palette by progress
  brand/
    LogoBuild.tsx       // scrubbed SVG assembly (mode: 2d | 3d-ready)
    Mark.tsx            // static assembled mark (nav/footer)
    Nav.tsx             // fixed minimal nav; links scroll-to-section
  sections/
    Hero.tsx  Pitch.tsx  Services.tsx  Frame.tsx  Work.tsx
    Process.tsx  Packages.tsx  About.tsx  Contact.tsx  Footer.tsx
lib/
  content.ts           // all copy, projects[], packages[] — single source of truth
  moods.ts             // per-section palette tokens
  gsap.ts              // GSAP/ScrollTrigger setup + helpers
public/brand/          // svgs, og image
```

**Isolation principle:** each section owns its layout and its own scroll-triggered entrance animation, reading nothing from siblings except shared scroll progress. Copy lives only in `lib/content.ts` (seeded from `aethel-labs-website-copy.md`).

---

## 7. Responsive / Mobile

- **Desktop / pointer + wide viewport:** full horizontal cinematic experience.
- **Mobile / narrow / touch:** same sections and same mood arc, laid out **vertically**; mood transitions trigger on vertical scroll; motion simplified to fades; the logo-build still scrubs. Keeps the brand journey, drops the sideways gimmick where it would hurt UX.
- One responsive layout switched by a breakpoint + pointer/coarse check. Content designed to work on both axes from the start.

---

## 8. Accessibility & Performance

- **`prefers-reduced-motion`:** disables pin/scrub → clean static sections with gentle fades.
- Keyboard navigable (nav links jump to sections), visible focus states, semantic HTML, alt text on all imagery.
- Contrast: ember reserved for large/decorative/accent use; body text stays white-on-ink or ink-on-ivory at AA.
- Performance: inline vector mark (tiny), `next/image` for project shots, lazy-load off-screen panels, preload hero. Targets: fast LCP, zero layout shift, smooth 60fps scroll.

---

## 9. Contact Form

- "Start a project" opens a small form: name, email, project need.
- Submits to **`app/api/contact/route.ts`** → **Resend** → emails `joshuasabuero.main@gmail.com`.
- Honeypot field + basic server-side validation. Graceful success/error states.

---

## 10. SEO

- Meta title/description from existing copy (`Aethel Labs — Brand & Web Studio`).
- Custom **OG image** built from brand assets.
- **`ProfessionalService`** JSON-LD (name, description, services, contact).
- Single-page semantic heading structure.

---

## 11. Build Phases (each independently shippable)

1. **Scaffold + content** — Next app; all 10 sections as a plain *vertical* static page with real copy, projects, pricing. Layout/content correct first.
2. **Horizontal engine** — Lenis + ScrollTrigger pin/translate + mood-background interpolation.
3. **Signature motion** — logo build-scrub in Hero + per-section entrance animations.
4. **Ship-ready** — contact form, reduced-motion + mobile fallback, SEO/OG, performance pass, deploy.

A deployable site exists after Phase 1; each phase adds cinematics without rework.

---

## 12. Open Items (placeholders to fill)

- **Pricing numbers** (Landing Page / Brand Identity / Content Engine) — currently bracketed in copy.
- **Additional work samples** (BrewKnot, Kinetix, Apex) and real project images — placeholders until provided.
- **Social links** (Instagram `@aethel.labs`, others).
- **Domain** for deployment.
- **Resend API key** (env var `RESEND_API_KEY`) to be provisioned before Phase 4.

---

## 13. Future Upgrade Hooks (designed-in, not built now)

- `<LogoBuild mode="3d">` — React Three Fiber extruded mark at the Frame section.
- WebGL shader replacing the `MoodBackground` glow layer.
- Per-project "color worlds" expansion in the Work section.
