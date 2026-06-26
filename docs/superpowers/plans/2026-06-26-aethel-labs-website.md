# Aethel Labs Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page, horizontally-scrolling cinematic studio website for Aethel Labs with a scroll-scrubbed logo build animation, a per-section mood-background arc, and a Resend-backed contact form.

**Architecture:** Next.js (App Router) renders one page composed of 10 data-driven section components inside a pinned horizontal track. A pure mood-interpolation library drives CSS custom properties on a fixed background layer as scroll progresses. GSAP + ScrollTrigger handle pinning, horizontal translation, and scroll-scrubbed animation; Lenis adds momentum. Behavior that is logic (interpolation, content shape, form validation, the contact API) is built test-first with Vitest; behavior that is purely visual (GSAP timelines) is built with explicit manual verification steps. The hero's logo build is isolated behind a `mode` prop so it can later be swapped for a 3D version without touching anything else.

**Tech Stack:** Next.js 15 (App Router) · React 19 · TypeScript · CSS Modules + global CSS custom properties · GSAP + ScrollTrigger + `@gsap/react` · Lenis · Resend · Vitest + React Testing Library · Deployed on Vercel.

---

## Conventions used in every task

- **Package manager:** `npm`.
- **Styling:** CSS Modules (`*.module.css`) for component styles; a single `app/globals.css` holds the design tokens as CSS custom properties. No Tailwind — the mood system animates custom properties directly, which suits bespoke CSS.
- **Why not TDD the animations:** GSAP scroll timelines have no meaningful unit-test surface; their correctness is visual. Those tasks ship a **manual verification step** (run the dev server, perform a scroll, observe a stated outcome) instead of a unit test. All non-visual logic is TDD.
- **Commit messages:** Conventional Commits (`feat:`, `test:`, `chore:`, `docs:`, `style:`).
- **Brand tokens:** Ember `#C75D3A`, Ink `#0A1A2F` / `#0E1A2E`, Ivory `#F6F2EC`→`#ECE5DA`.
- **Brand source art:** `Aethel labs assets/` (PNG + SVG). SVGs are copied into `public/brand/` during Task 1.6.

---

## File Structure (created across the plan)

```
package.json, tsconfig.json, next.config.ts, vitest.config.ts, vitest.setup.ts, .env.local.example
app/
  layout.tsx              // fonts, <html>, metadata, JSON-LD
  page.tsx                // composes Nav + HorizontalTrack(sections) + MoodBackground
  globals.css             // CSS custom-property design tokens + base resets
  api/contact/route.ts    // POST handler → Resend
lib/
  content.ts              // all copy, projects[], packages[] (typed)
  moods.ts                // SectionId, Palette, moods map, sectionOrder
  interpolate.ts          // pure color/palette math (TDD)
  contact.ts              // ContactInput type + validate() (TDD)
  gsap.ts                 // registers ScrollTrigger; shared config
components/
  scroll/
    SmoothScroll.tsx       // Lenis provider, drives ScrollTrigger
    HorizontalTrack.tsx    // pin + scroll→x translate
    MoodBackground.tsx     // fixed glow layer; sets CSS vars from progress
  brand/
    Mark.tsx               // static assembled SVG mark
    LogoBuild.tsx          // scroll-scrubbed assembly (mode: '2d' | '3d')
    Nav.tsx                // fixed minimal nav; scroll-to-section links
  layout/
    Section.tsx            // shared section shell (id, theme, width)
  sections/
    Hero.tsx Pitch.tsx Services.tsx Frame.tsx Work.tsx
    Process.tsx Packages.tsx About.tsx Contact.tsx Footer.tsx
  ui/
    ContactForm.tsx        // client form posting to /api/contact
public/brand/              // svgs + og image
test/                      // Vitest specs mirror lib/ and api/
```

---

# PHASE 1 — Scaffold + Content (a deployable vertical static site)

Goal of phase: every section renders with real copy in a plain vertical layout. No horizontal scroll, no GSAP yet. Deployable.

---

### Task 1.1: Initialize the Next.js + TypeScript project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

- [ ] **Step 1: Scaffold the app non-interactively**

Run in the repo root (it already contains `.git`, `.gitignore`, `docs/`, `Aethel labs assets/`):

```bash
npx create-next-app@latest . --typescript --app --no-tailwind --eslint --src-dir=false --import-alias "@/*" --use-npm --no-turbopack
```

If the CLI refuses because the directory is non-empty, accept its prompt to proceed, or scaffold in a temp dir and copy `app/`, `package.json`, `tsconfig.json`, `next.config.ts`, `next-env.d.ts` over. Do **not** overwrite the existing `.gitignore`, `docs/`, or `Aethel labs assets/`.

- [ ] **Step 2: Verify dev server boots**

Run: `npm run dev`
Expected: server starts on `http://localhost:3000` and the default page renders. Stop it with Ctrl-C.

- [ ] **Step 3: Replace the boilerplate page with a placeholder**

Replace `app/page.tsx` with:

```tsx
export default function Home() {
  return <main>Aethel Labs — coming together.</main>;
}
```

- [ ] **Step 4: Verify build passes**

Run: `npm run build`
Expected: build completes with no type errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app router + typescript project"
```

---

### Task 1.2: Add the testing toolchain (Vitest + RTL)

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Install dev dependencies**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["test/**/*.test.{ts,tsx}"],
  },
  resolve: { alias: { "@": resolve(__dirname, ".") } },
});
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Add test scripts to `package.json`**

Add to the `"scripts"` object:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Add a smoke test to prove the harness works**

Create `test/smoke.test.ts`:

```ts
import { describe, it, expect } from "vitest";

describe("test harness", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: Run the smoke test**

Run: `npm test`
Expected: 1 passing test.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: add vitest + react testing library"
```

---

### Task 1.3: Design tokens in `globals.css`

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace `app/globals.css` with tokens + resets**

```css
:root {
  /* Brand */
  --ember: #c75d3a;
  --ember-soft: #e8a98f;
  --ink: #0a1a2f;
  --ink-deep: #070d16;
  --ivory: #f6f2ec;
  --ivory-deep: #ece5da;

  /* Live mood variables (animated by MoodBackground in Phase 2). Seeded to hero. */
  --bg-core: #c75d3a;
  --bg-edge: #0a1a2f;
  --surface-text: #ffffff;
  --surface-accent: #c75d3a;

  --maxw: 1200px;
  --font-sans: var(--font-inter, system-ui, sans-serif);
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font-sans);
  color: var(--surface-text);
  background: var(--ink-deep);
  -webkit-font-smoothing: antialiased;
}
a { color: inherit; text-decoration: none; }
img, svg { display: block; max-width: 100%; }
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build passes.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add brand design tokens and base resets"
```

---

### Task 1.4: The mood palette map (`lib/moods.ts`)

**Files:**
- Create: `lib/moods.ts`
- Test: `test/moods.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { moods, sectionOrder, ACCENT } from "@/lib/moods";

describe("moods", () => {
  it("defines a palette for every section in order", () => {
    expect(sectionOrder).toHaveLength(10);
    for (const id of sectionOrder) {
      const p = moods[id];
      expect(p, id).toBeDefined();
      for (const key of ["core", "edge", "text", "accent"] as const) {
        expect(p[key], `${id}.${key}`).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    }
  });

  it("starts at hero and ends at footer", () => {
    expect(sectionOrder[0]).toBe("hero");
    expect(sectionOrder.at(-1)).toBe("footer");
  });

  it("exposes the ember accent constant", () => {
    expect(ACCENT).toBe("#c75d3a");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- moods`
Expected: FAIL — cannot find module `@/lib/moods`.

- [ ] **Step 3: Implement `lib/moods.ts`**

```ts
export type SectionId =
  | "hero" | "pitch" | "services" | "frame" | "work"
  | "process" | "packages" | "about" | "contact" | "footer";

export interface Palette {
  /** warm/bright core of the radial glow */
  core: string;
  /** outer/edge color the glow fades into */
  edge: string;
  /** default text color over this surface */
  text: string;
  /** accent color for this surface */
  accent: string;
}

export const ACCENT = "#c75d3a";
const INK = "#0a1a2f";
const WHITE = "#ffffff";

export const sectionOrder: SectionId[] = [
  "hero", "pitch", "services", "frame", "work",
  "process", "packages", "about", "contact", "footer",
];

export const moods: Record<SectionId, Palette> = {
  hero:     { core: "#c75d3a", edge: INK,       text: WHITE,   accent: ACCENT },
  pitch:    { core: "#161617", edge: "#0b0b0c", text: "#f2f2f2", accent: ACCENT },
  services: { core: "#102a45", edge: INK,       text: WHITE,   accent: "#e8a98f" },
  frame:    { core: "#c75d3a", edge: "#0a1a2f", text: WHITE,   accent: ACCENT },
  work:     { core: "#f6f2ec", edge: "#ece5da", text: INK,     accent: ACCENT },
  process:  { core: "#0e2236", edge: INK,       text: WHITE,   accent: "#e8a98f" },
  packages: { core: "#faf7f1", edge: "#efe8dd", text: INK,     accent: ACCENT },
  about:    { core: "#5a3526", edge: INK,       text: WHITE,   accent: ACCENT },
  contact:  { core: "#c75d3a", edge: "#0a1a2f", text: WHITE,   accent: ACCENT },
  footer:   { core: "#070d16", edge: "#070d16", text: "#cdd5de", accent: ACCENT },
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- moods`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/moods.ts test/moods.test.ts
git commit -m "feat: define per-section mood palette map"
```

---

### Task 1.5: Typed site content (`lib/content.ts`)

**Files:**
- Create: `lib/content.ts`
- Test: `test/content.test.ts`

Content is seeded from `aethel-labs-website-copy.md`. Placeholders (pricing, extra work samples, socials) are explicit per spec §12.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { content } from "@/lib/content";

describe("content", () => {
  it("has hero headline and two CTAs", () => {
    expect(content.hero.headline.length).toBeGreaterThan(0);
    expect(content.hero.ctas).toHaveLength(2);
  });

  it("has exactly three services", () => {
    expect(content.services.items).toHaveLength(3);
  });

  it("has at least the two live projects", () => {
    const names = content.work.map((w) => w.name);
    expect(names).toContain("Umbra Coffee");
    expect(names).toContain("Korte");
  });

  it("has four process steps", () => {
    expect(content.process).toHaveLength(4);
  });

  it("has three packages each with a price field", () => {
    expect(content.packages).toHaveLength(3);
    for (const p of content.packages) expect(p).toHaveProperty("price");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- content`
Expected: FAIL — cannot find module `@/lib/content`.

- [ ] **Step 3: Implement `lib/content.ts`**

```ts
export interface CTA { label: string; href: string; variant: "primary" | "ghost"; }
export interface Service { title: string; body: string; tag?: string; }
export interface Project { name: string; kind: string; body: string; live?: boolean; image?: string; }
export interface Step { n: number; title: string; body: string; }
export interface Package { name: string; what: string; price: string; }

export const content = {
  nav: {
    links: [
      { label: "Work", href: "#work" },
      { label: "Services", href: "#services" },
      { label: "Approach", href: "#frame" },
      { label: "Contact", href: "#contact" },
    ],
    cta: { label: "Start a project", href: "#contact", variant: "primary" } as CTA,
  },
  hero: {
    eyebrow: "Aethel Labs — Brand & Web Studio",
    headline: "Designing brands.\nBuilding what they live on.",
    sub: "Aethel Labs is a digital studio — brand identity, websites, and the content that keeps them alive. Considered design, modern build.",
    ctas: [
      { label: "See the work", href: "#work", variant: "primary" },
      { label: "Start a project", href: "#contact", variant: "ghost" },
    ] as CTA[],
  },
  pitch:
    "Most businesses get half: a designer who can't build, or a developer with no eye. Aethel is both — design and build under one roof, from the first idea to the thing that ships.",
  services: {
    eyebrow: "What we do",
    heading: "Three ways in.",
    items: [
      { title: "Brand Identity", body: "A logo, a palette, a voice — the whole identity, built to be remembered. The foundation everything else stands on." },
      { title: "Websites & Landing Pages", body: "Fast, modern sites that look the way your business deserves to look. Built on the same stack the big names run on — shipped in days, not months." },
      { title: "The Content Engine", tag: "monthly", body: "A subscription that keeps your brand alive online. On-brand content, produced and delivered every month, so your feed never goes quiet between posts." },
    ] as Service[],
  },
  frame: {
    eyebrow: "The approach",
    heading: "Built within a frame.",
    body:
      "Every mark we make starts inside a frame — the structure an idea takes shape in. It's the same way we work: a clear shape first, then the craft inside it. End to end, under one roof. The idea and the execution, inseparable.",
  },
  work: [
    { name: "Umbra Coffee", kind: "Brand & Web", live: true, body: "A cinematic identity and landing page for a specialty cafe. Espresso-warm, editorial, built to make a small room feel like a destination." },
    { name: "Korte", kind: "Product, Brand & Build", body: "A pickleball community platform built from zero — the product, the brand, and every line of code. Proof that Aethel ships real things, not just pretty pages." },
    // PLACEHOLDER work samples (spec §12) — replace with real case studies as built.
    { name: "BrewKnot", kind: "Brand", body: "Minimalist coffee identity. (Placeholder sample.)" },
    { name: "Kinetix", kind: "Brand", body: "A recovery clinic identity. (Placeholder sample.)" },
    { name: "Apex", kind: "Brand", body: "An athletic gym identity. (Placeholder sample.)" },
  ] as Project[],
  process: [
    { n: 1, title: "Talk", body: "We figure out the business, the customer, and what “good” looks like for you." },
    { n: 2, title: "Shape", body: "Direction first: the brand, the look, the structure. We agree before we build." },
    { n: 3, title: "Build", body: "Design and ship. You see real work fast, not endless mockups." },
    { n: 4, title: "Sustain", body: "Optional: we keep it alive — content, updates, the things that go stale if no one tends them." },
  ] as Step[],
  packages: [
    // PLACEHOLDER prices (spec §12) — confirm against market before publishing.
    { name: "Landing Page", what: "A single, high-craft page that converts", price: "From ₱___" },
    { name: "Brand Identity", what: "Logo, palette, type, and a usage guide", price: "From ₱___" },
    { name: "Content Engine", what: "A month of on-brand content, every month", price: "₱___ /mo" },
  ] as Package[],
  about: {
    eyebrow: "The studio",
    heading: "A studio, not a template.",
    body:
      "Aethel Labs exists because too many brands look good but don't work, and too many sites work but look like everyone else's. We do both — design and build — held to a single standard. The name comes from the Old English æþel — noble, of worth. Design worth the name.",
  },
  contact: {
    heading: "Have something worth building?",
    body: "Tell me about it. A new brand, a site that's overdue, a feed that's gone quiet — start anywhere.",
    email: "joshuasabuero.main@gmail.com",
    // PLACEHOLDER socials (spec §12)
    socials: [{ label: "Instagram", href: "#" }],
  },
  footer: {
    tagline: "Design worth the name.",
    copyright: "© 2026 Aethel Labs · Available worldwide",
  },
} as const;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- content`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/content.ts test/content.test.ts
git commit -m "feat: add typed site content seeded from copy doc"
```

---

### Task 1.6: Bring brand SVGs into `public/` and build the static `Mark`

**Files:**
- Create: `public/brand/logo-full-white.svg`, `public/brand/logo-full-ink.svg`, `public/brand/mark-white.svg`
- Create: `components/brand/Mark.tsx`, `components/brand/Mark.module.css`
- Test: `test/mark.test.tsx`

- [ ] **Step 1: Copy SVG assets**

```bash
mkdir -p public/brand
cp "Aethel labs assets/SVG/Primary Logo Full white.svg" public/brand/logo-full-white.svg
cp "Aethel labs assets/SVG/Primary Logo Full ink blue.svg" public/brand/logo-full-ink.svg
cp "Aethel labs assets/SVG/Favicon white.svg" public/brand/mark-white.svg
cp "Aethel labs assets/SVG/Favicon gradient dark.svg" public/brand/mark-gradient.svg
```

- [ ] **Step 2: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Mark } from "@/components/brand/Mark";

describe("Mark", () => {
  it("renders an accessible logo image", () => {
    render(<Mark />);
    expect(screen.getByRole("img", { name: /aethel labs/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- mark`
Expected: FAIL — cannot find module `@/components/brand/Mark`.

- [ ] **Step 4: Implement `components/brand/Mark.tsx`**

```tsx
import Image from "next/image";
import styles from "./Mark.module.css";

interface MarkProps {
  variant?: "full" | "glyph";
  className?: string;
}

export function Mark({ variant = "full", className }: MarkProps) {
  const src = variant === "full" ? "/brand/logo-full-white.svg" : "/brand/mark-white.svg";
  return (
    <Image
      src={src}
      alt="Aethel Labs"
      width={variant === "full" ? 220 : 40}
      height={variant === "full" ? 84 : 40}
      priority
      className={`${styles.mark} ${className ?? ""}`}
    />
  );
}
```

- [ ] **Step 5: Create `components/brand/Mark.module.css`**

```css
.mark { height: auto; width: auto; }
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- mark`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add public/brand components/brand/Mark.tsx components/brand/Mark.module.css test/mark.test.tsx
git commit -m "feat: add brand svg assets and static Mark component"
```

---

### Task 1.7: The shared `Section` shell

**Files:**
- Create: `components/layout/Section.tsx`, `components/layout/Section.module.css`
- Test: `test/section.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Section } from "@/components/layout/Section";

describe("Section", () => {
  it("renders with the section id as an anchor target", () => {
    render(<Section id="work"><p>inner</p></Section>);
    const el = document.getElementById("work");
    expect(el).toBeInTheDocument();
    expect(el?.tagName.toLowerCase()).toBe("section");
    expect(screen.getByText("inner")).toBeInTheDocument();
  });

  it("applies the light theme class when theme='light'", () => {
    render(<Section id="packages" theme="light"><span>x</span></Section>);
    expect(document.getElementById("packages")?.className).toMatch(/light/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- section`
Expected: FAIL — cannot find module.

- [ ] **Step 3: Implement `components/layout/Section.tsx`**

```tsx
import type { ReactNode } from "react";
import type { SectionId } from "@/lib/moods";
import styles from "./Section.module.css";

interface SectionProps {
  id: SectionId;
  children: ReactNode;
  /** 'light' sections (work, packages) flip text to ink on ivory. */
  theme?: "dark" | "light";
  /** horizontal panel width in viewport widths once horizontal mode is on (Phase 2). */
  vw?: number;
}

export function Section({ id, children, theme = "dark" }: SectionProps) {
  return (
    <section
      id={id}
      data-section={id}
      className={`${styles.section} ${theme === "light" ? styles.light : ""}`}
    >
      <div className={styles.inner}>{children}</div>
    </section>
  );
}
```

- [ ] **Step 4: Create `components/layout/Section.module.css`**

```css
.section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 6vh 8vw;
  color: var(--surface-text);
}
.light { color: var(--ink); }
.inner { width: 100%; max-width: var(--maxw); margin: 0 auto; }
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- section`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add components/layout test/section.test.tsx
git commit -m "feat: add shared Section shell component"
```

---

### Task 1.8: The ten section components (data-driven, static)

Each section is a thin presentational component reading `content`. They share `Section`. Build them in one task; each is small.

**Files:**
- Create: `components/sections/Hero.tsx`, `Pitch.tsx`, `Services.tsx`, `Frame.tsx`, `Work.tsx`, `Process.tsx`, `Packages.tsx`, `About.tsx`, `Contact.tsx`, `Footer.tsx`
- Create: `components/sections/sections.module.css` (shared section styling)
- Test: `test/sections.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { Packages } from "@/components/sections/Packages";
import { Contact } from "@/components/sections/Contact";

describe("sections render real content", () => {
  it("Hero shows the headline", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { name: /building what they live on/i })).toBeInTheDocument();
  });
  it("Services lists three offerings", () => {
    render(<Services />);
    expect(screen.getByText("Brand Identity")).toBeInTheDocument();
    expect(screen.getByText("The Content Engine")).toBeInTheDocument();
  });
  it("Work lists projects", () => {
    render(<Work />);
    expect(screen.getByText("Umbra Coffee")).toBeInTheDocument();
    expect(screen.getByText("Korte")).toBeInTheDocument();
  });
  it("Packages shows price fields", () => {
    render(<Packages />);
    expect(screen.getAllByText(/From|\/mo/).length).toBeGreaterThan(0);
  });
  it("Contact exposes the heading", () => {
    render(<Contact />);
    expect(screen.getByRole("heading", { name: /worth building/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- sections`
Expected: FAIL — cannot find the section modules.

- [ ] **Step 3: Create shared `components/sections/sections.module.css`**

```css
.eyebrow { font-size: 12px; letter-spacing: 3px; text-transform: uppercase; opacity: 0.7; margin-bottom: 18px; }
.headline { font-size: clamp(34px, 6vw, 72px); line-height: 1.08; letter-spacing: -0.02em; white-space: pre-line; font-weight: 700; }
.sub { font-size: clamp(16px, 2vw, 20px); max-width: 46ch; margin-top: 20px; opacity: 0.9; line-height: 1.5; }
.ctas { display: flex; gap: 14px; margin-top: 32px; flex-wrap: wrap; }
.btn { padding: 12px 22px; border-radius: 999px; font-size: 14px; font-weight: 600; cursor: pointer; }
.primary { background: var(--surface-accent); color: #fff; }
.ghost { border: 1px solid currentColor; }
.grid3 { display: grid; gap: 22px; grid-template-columns: repeat(3, 1fr); margin-top: 40px; }
.card { padding: 26px; border: 1px solid color-mix(in srgb, currentColor 18%, transparent); border-radius: 14px; }
.cardTitle { font-size: 22px; font-weight: 700; margin-bottom: 10px; }
.cardBody { opacity: 0.85; line-height: 1.5; }
.workGrid { display: grid; gap: 26px; grid-template-columns: repeat(2, 1fr); margin-top: 40px; }
.table { width: 100%; border-collapse: collapse; margin-top: 32px; }
.table td, .table th { text-align: left; padding: 16px 12px; border-bottom: 1px solid color-mix(in srgb, currentColor 16%, transparent); }
.steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 40px; }
.footer { display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; width: 100%; }
@media (max-width: 820px) {
  .grid3, .workGrid, .steps { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Implement the ten components**

`components/sections/Hero.tsx`:

```tsx
import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { LogoBuild } from "@/components/brand/LogoBuild";
import s from "./sections.module.css";

export function Hero() {
  const { eyebrow, headline, sub, ctas } = content.hero;
  return (
    <Section id="hero">
      <div>
        <p className={s.eyebrow}>{eyebrow}</p>
        <h1 className={s.headline}>{headline}</h1>
        <p className={s.sub}>{sub}</p>
        <div className={s.ctas}>
          {ctas.map((c) => (
            <a key={c.label} href={c.href} className={`${s.btn} ${c.variant === "primary" ? s.primary : s.ghost}`}>{c.label}</a>
          ))}
        </div>
      </div>
      <LogoBuild mode="2d" />
    </Section>
  );
}
```

`components/sections/Pitch.tsx`:

```tsx
import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import s from "./sections.module.css";

export function Pitch() {
  return (
    <Section id="pitch">
      <h2 className={s.headline} style={{ maxWidth: "20ch" }}>{content.pitch}</h2>
    </Section>
  );
}
```

`components/sections/Services.tsx`:

```tsx
import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import s from "./sections.module.css";

export function Services() {
  const { eyebrow, heading, items } = content.services;
  return (
    <Section id="services">
      <div>
        <p className={s.eyebrow}>{eyebrow}</p>
        <h2 className={s.headline}>{heading}</h2>
        <div className={s.grid3}>
          {items.map((it) => (
            <article key={it.title} className={s.card}>
              <h3 className={s.cardTitle}>{it.title}{it.tag ? ` · ${it.tag}` : ""}</h3>
              <p className={s.cardBody}>{it.body}</p>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
```

`components/sections/Frame.tsx`:

```tsx
import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { Mark } from "@/components/brand/Mark";
import s from "./sections.module.css";

export function Frame() {
  const { eyebrow, heading, body } = content.frame;
  return (
    <Section id="frame">
      <div>
        <p className={s.eyebrow}>{eyebrow}</p>
        <h2 className={s.headline}>{heading}</h2>
        <p className={s.sub}>{body}</p>
      </div>
      <Mark variant="glyph" />
    </Section>
  );
}
```

`components/sections/Work.tsx`:

```tsx
import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import s from "./sections.module.css";

export function Work() {
  return (
    <Section id="work" theme="light">
      <div>
        <p className={s.eyebrow}>Selected work</p>
        <h2 className={s.headline}>A few things worth showing.</h2>
        <div className={s.workGrid}>
          {content.work.map((w) => (
            <article key={w.name} className={s.card}>
              <h3 className={s.cardTitle}>{w.name} — <em>{w.kind}</em></h3>
              <p className={s.cardBody}>{w.body}</p>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
```

`components/sections/Process.tsx`:

```tsx
import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import s from "./sections.module.css";

export function Process() {
  return (
    <Section id="process">
      <div>
        <p className={s.eyebrow}>How it goes</p>
        <h2 className={s.headline}>Four steps, no mystery.</h2>
        <div className={s.steps}>
          {content.process.map((step) => (
            <div key={step.n} className={s.card}>
              <div className={s.cardTitle}>{String(step.n).padStart(2, "0")} · {step.title}</div>
              <p className={s.cardBody}>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
```

`components/sections/Packages.tsx`:

```tsx
import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import s from "./sections.module.css";

export function Packages() {
  return (
    <Section id="packages" theme="light">
      <div>
        <p className={s.eyebrow}>Packages</p>
        <h2 className={s.headline}>Clear pricing. No surprises.</h2>
        <table className={s.table}>
          <thead><tr><th>Package</th><th>What it is</th><th>From</th></tr></thead>
          <tbody>
            {content.packages.map((p) => (
              <tr key={p.name}><td><strong>{p.name}</strong></td><td>{p.what}</td><td>{p.price}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
```

`components/sections/About.tsx`:

```tsx
import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import s from "./sections.module.css";

export function About() {
  const { eyebrow, heading, body } = content.about;
  return (
    <Section id="about">
      <div>
        <p className={s.eyebrow}>{eyebrow}</p>
        <h2 className={s.headline}>{heading}</h2>
        <p className={s.sub}>{body}</p>
      </div>
    </Section>
  );
}
```

`components/sections/Contact.tsx`:

```tsx
import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { ContactForm } from "@/components/ui/ContactForm";
import s from "./sections.module.css";

export function Contact() {
  const { heading, body } = content.contact;
  return (
    <Section id="contact">
      <div>
        <h2 className={s.headline}>{heading}</h2>
        <p className={s.sub}>{body}</p>
        <ContactForm />
      </div>
    </Section>
  );
}
```

`components/sections/Footer.tsx`:

```tsx
import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { Mark } from "@/components/brand/Mark";
import s from "./sections.module.css";

export function Footer() {
  return (
    <Section id="footer">
      <div className={s.footer}>
        <div>
          <Mark variant="glyph" />
          <p className={s.cardBody} style={{ marginTop: 12 }}>{content.footer.tagline}</p>
        </div>
        <p className={s.cardBody}>{content.footer.copyright}</p>
      </div>
    </Section>
  );
}
```

> **Note:** `Hero` imports `LogoBuild` and `Contact` imports `ContactForm`. Create minimal stubs now so the build passes; they are fleshed out in Tasks 3.x and 4.x.

Create `components/brand/LogoBuild.tsx` (stub):

```tsx
import { Mark } from "@/components/brand/Mark";

export function LogoBuild({ mode = "2d" }: { mode?: "2d" | "3d" }) {
  // Phase 3 replaces this with the scroll-scrubbed assembly. Stub renders the final mark.
  return <div data-logobuild={mode}><Mark variant="glyph" /></div>;
}
```

Create `components/ui/ContactForm.tsx` (stub):

```tsx
export function ContactForm() {
  // Phase 4 replaces this with the real form. Stub keeps the build green.
  return <p style={{ marginTop: 24, opacity: 0.7 }}>Contact form coming in Phase 4.</p>;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- sections`
Expected: PASS (5 tests).

- [ ] **Step 6: Commit**

```bash
git add components/sections components/brand/LogoBuild.tsx components/ui/ContactForm.tsx test/sections.test.tsx
git commit -m "feat: add ten data-driven section components (static)"
```

---

### Task 1.9: Compose the page + fonts + metadata

**Files:**
- Modify: `app/layout.tsx`, `app/page.tsx`

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
import { Hero } from "@/components/sections/Hero";
import { Pitch } from "@/components/sections/Pitch";
import { Services } from "@/components/sections/Services";
import { Frame } from "@/components/sections/Frame";
import { Work } from "@/components/sections/Work";
import { Process } from "@/components/sections/Process";
import { Packages } from "@/components/sections/Packages";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Hero /><Pitch /><Services /><Frame /><Work />
      <Process /><Packages /><About /><Contact /><Footer />
    </main>
  );
}
```

- [ ] **Step 2: Replace `app/layout.tsx` with fonts + metadata**

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Aethel Labs — Brand & Web Studio",
  description: "A digital studio for brand identity, websites, and the content that keeps them alive. Design worth the name.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, open `http://localhost:3000`.
Expected: all 10 sections stack vertically, each ~full height, real copy visible, light sections (Work, Packages) show ink text. Stop the server.

- [ ] **Step 4: Verify build + tests**

Run: `npm run build && npm test`
Expected: build passes, all tests green.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/page.tsx
git commit -m "feat: compose full vertical page with fonts and metadata"
```

**PHASE 1 COMPLETE — deployable static site.** Optionally deploy to Vercel now for a live preview.

---

# PHASE 2 — Horizontal engine + mood background

Goal: the page scrolls horizontally via pin+translate; the background glow interpolates between section moods as you scroll.

---

### Task 2.1: Install motion libraries + GSAP setup

**Files:**
- Create: `lib/gsap.ts`

- [ ] **Step 1: Install**

```bash
npm install gsap @gsap/react lenis
```

- [ ] **Step 2: Create `lib/gsap.ts`**

```ts
"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json lib/gsap.ts
git commit -m "chore: add gsap, scrolltrigger, lenis and gsap setup module"
```

---

### Task 2.2: Pure palette interpolation (`lib/interpolate.ts`)

This is the math behind the moving background. Fully TDD.

**Files:**
- Create: `lib/interpolate.ts`
- Test: `test/interpolate.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { lerp, lerpColor, paletteAt } from "@/lib/interpolate";
import { moods, sectionOrder } from "@/lib/moods";

describe("interpolate", () => {
  it("lerp blends two numbers", () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(0, 10, 0)).toBe(0);
    expect(lerp(0, 10, 1)).toBe(10);
  });

  it("lerpColor returns endpoints exactly at 0 and 1", () => {
    expect(lerpColor("#000000", "#ffffff", 0)).toBe("#000000");
    expect(lerpColor("#000000", "#ffffff", 1)).toBe("#ffffff");
  });

  it("lerpColor blends to the midpoint", () => {
    expect(lerpColor("#000000", "#ffffff", 0.5)).toBe("#808080");
  });

  it("paletteAt(0) is the first section palette", () => {
    expect(paletteAt(0).core.toLowerCase()).toBe(moods[sectionOrder[0]].core.toLowerCase());
  });

  it("paletteAt(1) is the last section palette", () => {
    expect(paletteAt(1).core.toLowerCase()).toBe(moods[sectionOrder.at(-1)!].core.toLowerCase());
  });

  it("paletteAt midway between two stops blends their cores", () => {
    // progress exactly halfway between section 0 and section 1 of 10 stops => global progress 0.5/9
    const p = paletteAt(0.5 / (sectionOrder.length - 1));
    const a = moods[sectionOrder[0]].core;
    const b = moods[sectionOrder[1]].core;
    expect(p.core).toBe(lerpColor(a, b, 0.5));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- interpolate`
Expected: FAIL — cannot find module.

- [ ] **Step 3: Implement `lib/interpolate.ts`**

```ts
import { moods, sectionOrder, type Palette } from "@/lib/moods";

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function toHex(n: number): string {
  return Math.round(n).toString(16).padStart(2, "0");
}

export function lerpColor(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return `#${toHex(lerp(ar, br, t))}${toHex(lerp(ag, bg, t))}${toHex(lerp(ab, bb, t))}`;
}

function lerpPalette(a: Palette, b: Palette, t: number): Palette {
  return {
    core: lerpColor(a.core, b.core, t),
    edge: lerpColor(a.edge, b.edge, t),
    text: lerpColor(a.text, b.text, t),
    accent: lerpColor(a.accent, b.accent, t),
  };
}

/**
 * Map global scroll progress (0..1) to a blended palette across the 10 section stops.
 */
export function paletteAt(progress: number): Palette {
  const stops = sectionOrder.map((id) => moods[id]);
  const clamped = Math.min(1, Math.max(0, progress));
  const scaled = clamped * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(scaled));
  const local = scaled - i;
  if (clamped >= 1) return stops[stops.length - 1];
  return lerpPalette(stops[i], stops[i + 1], local);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- interpolate`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/interpolate.ts test/interpolate.test.ts
git commit -m "feat: add pure palette interpolation for mood background"
```

---

### Task 2.3: Smooth scroll provider (Lenis)

**Files:**
- Create: `components/scroll/SmoothScroll.tsx`

- [ ] **Step 1: Implement `components/scroll/SmoothScroll.tsx`**

```tsx
"use client";
import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // native scroll for reduced-motion users

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 2: Manual verification**

Temporarily wrap `main` in `app/page.tsx` with `<SmoothScroll>`. Run `npm run dev`, scroll.
Expected: scrolling feels smoothed/eased (momentum). Revert the temporary wrap (the real wiring happens in Task 2.5).

- [ ] **Step 3: Commit**

```bash
git add components/scroll/SmoothScroll.tsx
git commit -m "feat: add Lenis smooth-scroll provider"
```

---

### Task 2.4: Horizontal track (pin + scroll→x translate)

**Files:**
- Create: `components/scroll/HorizontalTrack.tsx`, `components/scroll/HorizontalTrack.module.css`

- [ ] **Step 1: Implement `components/scroll/HorizontalTrack.tsx`**

```tsx
"use client";
import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import styles from "./HorizontalTrack.module.css";

/**
 * Pins a viewport and translates the inner track horizontally as the user scrolls.
 * Exposes scroll progress (0..1) via the onProgress callback for the mood background.
 */
export function HorizontalTrack({
  children,
  onProgress,
}: {
  children: ReactNode;
  onProgress?: (p: number) => void;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || !track.current || !viewport.current) {
        onProgress?.(0);
        return; // vertical fallback handled by CSS (Task 4.x)
      }
      const distance = track.current.scrollWidth - window.innerWidth;
      gsap.to(track.current, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: viewport.current,
          start: "top top",
          end: () => `+=${distance}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => onProgress?.(self.progress),
        },
      });
    },
    { scope: viewport, dependencies: [] }
  );

  return (
    <div ref={viewport} className={styles.viewport}>
      <div ref={track} className={styles.track}>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `components/scroll/HorizontalTrack.module.css`**

```css
.viewport { height: 100vh; overflow: hidden; }
.track { display: flex; height: 100vh; will-change: transform; }
.track > section { flex: 0 0 100vw; min-height: 100vh; height: 100vh; }

/* Reduced-motion / no-JS fallback: stack vertically. */
@media (prefers-reduced-motion: reduce) {
  .viewport { height: auto; overflow: visible; }
  .track { display: block; height: auto; }
  .track > section { flex: none; width: 100%; height: auto; min-height: 100vh; }
}
```

- [ ] **Step 3: Commit**

```bash
git add components/scroll/HorizontalTrack.tsx components/scroll/HorizontalTrack.module.css
git commit -m "feat: add pinned horizontal scroll track"
```

---

### Task 2.5: Mood background + wire the page together

**Files:**
- Create: `components/scroll/MoodBackground.tsx`, `components/scroll/MoodBackground.module.css`
- Create: `components/scroll/Experience.tsx` (client shell holding shared progress state)
- Modify: `app/page.tsx`

- [ ] **Step 1: Implement `components/scroll/MoodBackground.tsx`**

```tsx
"use client";
import { useEffect, useRef } from "react";
import { paletteAt } from "@/lib/interpolate";
import styles from "./MoodBackground.module.css";

export function MoodBackground({ progress }: { progress: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const p = paletteAt(progress);
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--bg-core", p.core);
    el.style.setProperty("--bg-edge", p.edge);
    // drift the glow horizontally with progress for parallax depth
    el.style.setProperty("--glow-x", `${20 + progress * 60}%`);
    document.body.style.setProperty("--surface-text", p.text);
    document.body.style.setProperty("--surface-accent", p.accent);
  }, [progress]);

  return <div ref={ref} className={styles.bg} aria-hidden />;
}
```

- [ ] **Step 2: Create `components/scroll/MoodBackground.module.css`**

```css
.bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: radial-gradient(120% 130% at var(--glow-x, 20%) 50%,
              var(--bg-core, #c75d3a) 0%,
              color-mix(in srgb, var(--bg-core) 30%, var(--bg-edge)) 42%,
              var(--bg-edge, #0a1a2f) 82%);
  transition: background 120ms linear;
}
```

- [ ] **Step 3: Create `components/scroll/Experience.tsx`**

```tsx
"use client";
import { useState, type ReactNode } from "react";
import { SmoothScroll } from "./SmoothScroll";
import { HorizontalTrack } from "./HorizontalTrack";
import { MoodBackground } from "./MoodBackground";

export function Experience({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(0);
  return (
    <SmoothScroll>
      <MoodBackground progress={progress} />
      <HorizontalTrack onProgress={setProgress}>{children}</HorizontalTrack>
    </SmoothScroll>
  );
}
```

- [ ] **Step 4: Wire `app/page.tsx`**

```tsx
import { Experience } from "@/components/scroll/Experience";
import { Hero } from "@/components/sections/Hero";
import { Pitch } from "@/components/sections/Pitch";
import { Services } from "@/components/sections/Services";
import { Frame } from "@/components/sections/Frame";
import { Work } from "@/components/sections/Work";
import { Process } from "@/components/sections/Process";
import { Packages } from "@/components/sections/Packages";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <Experience>
      <Hero /><Pitch /><Services /><Frame /><Work />
      <Process /><Packages /><About /><Contact /><Footer />
    </Experience>
  );
}
```

- [ ] **Step 5: Manual verification (the core experience)**

Run: `npm run dev`, open `http://localhost:3000`.
Expected:
1. Scrolling moves the sections **horizontally** (left) while the viewport is pinned.
2. The **background glow color shifts** as you pass each section — ember at hero, near-black at pitch, ivory-bright behind work/packages, etc.
3. Light sections show ink-colored text.
Stop the server.

- [ ] **Step 6: Verify reduced-motion fallback**

In browser devtools, enable "prefers-reduced-motion: reduce" (Rendering tab) and reload.
Expected: sections stack vertically and scroll normally; no pin/horizontal. No console errors.

- [ ] **Step 7: Verify build + tests**

Run: `npm run build && npm test`
Expected: build passes, tests green.

- [ ] **Step 8: Commit**

```bash
git add components/scroll/MoodBackground.tsx components/scroll/MoodBackground.module.css components/scroll/Experience.tsx app/page.tsx
git commit -m "feat: wire horizontal experience with mood background"
```

**PHASE 2 COMPLETE — horizontal cinematic scroll with mood arc.**

---

# PHASE 3 — Signature motion (logo build + section entrances)

---

### Task 3.1: Extract the four logo parts as inline SVG components

**Files:**
- Create: `components/brand/parts.tsx` (the 4 part paths as React components)
- Test: `test/parts.test.tsx`

The four parts correspond to `Aethel labs assets/logo parts/Frame 62–65.png`, whose vector outlines exist in the primary mark paths. Recreate them as `<path>`s inside a shared `viewBox`.

- [ ] **Step 1: Derive the part paths**

Open `Aethel labs assets/SVG/Favicon white.svg` (the glyph-only mark) and read its two `<path>` elements and `viewBox`. The mark is composed of a small triangle path and the main frame path. For the build animation we need the four visual parts (top bar, diagonal blade, counter-triangle, main leg). Reproduce them by splitting the mark outline in a vector editor OR, for the first implementation, represent each part as the existing mark paths grouped and revealed progressively via clip — see Step 2 for the concrete component contract.

- [ ] **Step 2: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MarkParts, PART_IDS } from "@/components/brand/parts";

describe("MarkParts", () => {
  it("renders an svg containing one group per part id", () => {
    const { container } = render(<svg><MarkParts /></svg>);
    for (const id of PART_IDS) {
      expect(container.querySelector(`[data-part="${id}"]`)).not.toBeNull();
    }
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- parts`
Expected: FAIL — cannot find module.

- [ ] **Step 4: Implement `components/brand/parts.tsx`**

Use the glyph `viewBox="0 0 5122 5122"` from `Favicon white.svg`. Paste the mark's two real `<path d="...">` values from that file into `framePath` and `trianglePath` below (copy the exact `d` strings). Group them into the four named parts; parts that share a path use a `clipPath` band so each animates independently.

```tsx
export const PART_IDS = ["bar", "blade", "counter", "leg"] as const;
export type PartId = (typeof PART_IDS)[number];

// Paste the exact `d` values from public/brand/mark-white.svg (Favicon white.svg):
const trianglePath = "M2775.07 2746.5L2977.68 2401.5L3339 2605.95L2775.07 2746.5Z";
const framePath =
  "M3307 1266H565V1678H896.573L2234.5 2444L2437.64 2092L1720.57 1678H2775.07L1523 3846.64H1998.74L1999.07 3846.06L2802.3 3855.86L2234.5 3522L3307 1691.5L3818.5 1987.86H4557.3L3307 1266Z";

/**
 * The four build parts. `counter` is the small triangle; the other three are
 * horizontal bands of the frame path revealed via clip rectangles so each can
 * fly in independently. Bands (in viewBox units) top→bottom: bar 1266–1900,
 * blade 1900–2600, leg 2600–3860.
 */
export function MarkParts({ fill = "currentColor" }: { fill?: string }) {
  return (
    <g>
      <defs>
        <clipPath id="band-bar"><rect x="0" y="1200" width="5122" height="700" /></clipPath>
        <clipPath id="band-blade"><rect x="0" y="1900" width="5122" height="700" /></clipPath>
        <clipPath id="band-leg"><rect x="0" y="2600" width="5122" height="1300" /></clipPath>
      </defs>
      <g data-part="bar"><path d={framePath} fill={fill} clipPath="url(#band-bar)" /></g>
      <g data-part="blade"><path d={framePath} fill={fill} clipPath="url(#band-blade)" /></g>
      <g data-part="leg"><path d={framePath} fill={fill} clipPath="url(#band-leg)" /></g>
      <g data-part="counter"><path d={trianglePath} fill={fill} /></g>
    </g>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- parts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/brand/parts.tsx test/parts.test.tsx
git commit -m "feat: add four-part svg breakdown of the brand mark"
```

---

### Task 3.2: Scroll-scrubbed logo build (`LogoBuild`)

**Files:**
- Modify: `components/brand/LogoBuild.tsx`
- Create: `components/brand/LogoBuild.module.css`

- [ ] **Step 1: Replace the `LogoBuild` stub**

```tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MarkParts } from "./parts";
import styles from "./LogoBuild.module.css";

export function LogoBuild({ mode = "2d" }: { mode?: "2d" | "3d" }) {
  const root = useRef<HTMLDivElement>(null);
  // mode === "3d" is a future hook (R3F). For now both render the 2D build.
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const parts = root.current?.querySelectorAll<SVGGElement>("[data-part]");
      if (!parts) return;
      if (reduce) {
        gsap.set(parts, { opacity: 1, x: 0, y: 0, rotate: 0 });
        return;
      }
      const tl = gsap.timeline({
        scrollTrigger: { trigger: "#hero", start: "left right", end: "left left", scrub: 1, horizontal: true },
      });
      gsap.set(parts, { opacity: 0 });
      tl.from('[data-part="bar"]',     { x: -400, opacity: 0, duration: 1 })
        .from('[data-part="blade"]',   { x: 400, y: -200, opacity: 0, duration: 1 }, "<0.2")
        .from('[data-part="leg"]',     { y: 400, opacity: 0, duration: 1 }, "<0.2")
        .from('[data-part="counter"]', { scale: 0, transformOrigin: "center", opacity: 0, duration: 0.8 }, "<0.3")
        .to(parts, { opacity: 1, duration: 0.2 }, 0);
    },
    { scope: root, dependencies: [] }
  );

  return (
    <div ref={root} className={styles.wrap} data-logobuild={mode}>
      <svg viewBox="0 0 5122 5122" className={styles.svg} role="img" aria-label="Aethel Labs mark">
        <MarkParts />
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Create `components/brand/LogoBuild.module.css`**

```css
.wrap { position: absolute; right: 6vw; top: 50%; transform: translateY(-50%); width: min(38vw, 460px); color: color-mix(in srgb, #fff 16%, transparent); pointer-events: none; }
.svg { width: 100%; height: auto; }
@media (max-width: 820px) { .wrap { position: static; transform: none; width: 60vw; margin: 32px auto 0; } }
```

- [ ] **Step 3: Manual verification**

Run: `npm run dev`. Scroll through the hero slowly.
Expected: the mark's parts (bar, blade, leg, counter) fly/scale in and assemble as you scroll into the hero, and disassemble when you scroll back. Reversible. Stop the server.

- [ ] **Step 4: Verify reduced-motion**

Enable reduced-motion in devtools, reload.
Expected: the full mark is simply shown (no fly-in), no errors.

- [ ] **Step 5: Commit**

```bash
git add components/brand/LogoBuild.tsx components/brand/LogoBuild.module.css
git commit -m "feat: scroll-scrubbed logo build animation in hero"
```

---

### Task 3.3: Section entrance animations

**Files:**
- Create: `components/layout/Reveal.tsx`
- Modify: each section to wrap headline/cards in `<Reveal>` (Hero, Services, Work, Process, Packages, About, Contact)

- [ ] **Step 1: Implement `components/layout/Reveal.tsx`**

```tsx
"use client";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Fades/rises its children in when scrolled into view (horizontal-aware). */
export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || !ref.current) return;
      gsap.from(ref.current, {
        opacity: 0, y: 40, duration: 0.9, delay,
        scrollTrigger: { trigger: ref.current, start: "left 80%", horizontal: true, toggleActions: "play none none reverse" },
      });
    },
    { scope: ref, dependencies: [] }
  );
  return <div ref={ref}>{children}</div>;
}
```

- [ ] **Step 2: Wrap content in each section**

In `Services.tsx`, `Work.tsx`, `Process.tsx`, `Packages.tsx`, `About.tsx`, `Contact.tsx`, wrap the inner `<div>` content with `<Reveal>…</Reveal>` (import from `@/components/layout/Reveal`). Example for `About.tsx`:

```tsx
import { Reveal } from "@/components/layout/Reveal";
// ...
return (
  <Section id="about">
    <Reveal>
      <div>
        <p className={s.eyebrow}>{eyebrow}</p>
        <h2 className={s.headline}>{heading}</h2>
        <p className={s.sub}>{body}</p>
      </div>
    </Reveal>
  </Section>
);
```

- [ ] **Step 3: Manual verification**

Run: `npm run dev`. Scroll horizontally.
Expected: each section's content rises/fades in as it enters the viewport; reverses on scroll-back. Stop the server.

- [ ] **Step 4: Verify build + tests + reduced-motion**

Run: `npm run build && npm test`. Then check reduced-motion shows content statically.
Expected: build passes, tests green, no animation under reduced-motion.

- [ ] **Step 5: Commit**

```bash
git add components/layout/Reveal.tsx components/sections
git commit -m "feat: add scroll-triggered section entrance reveals"
```

---

### Task 3.4: Fixed nav with scroll-to-section

**Files:**
- Create: `components/brand/Nav.tsx`, `components/brand/Nav.module.css`
- Modify: `components/scroll/Experience.tsx` (render `<Nav />`)

- [ ] **Step 1: Implement `components/brand/Nav.tsx`**

```tsx
"use client";
import { content } from "@/lib/content";
import { Mark } from "./Mark";
import { ScrollTrigger } from "@/lib/gsap";
import styles from "./Nav.module.css";

export function Nav() {
  function go(e: React.MouseEvent, href: string) {
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    const st = ScrollTrigger.getAll().find((t) => t.pin);
    if (st) {
      // horizontal: map the section's index to scroll position along the pinned range
      const sections = Array.from(document.querySelectorAll("[data-section]"));
      const idx = sections.indexOf(target as Element);
      const ratio = idx / (sections.length - 1);
      const y = st.start + (st.end - st.start) * ratio;
      window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }
  return (
    <nav className={styles.nav}>
      <a href="#hero" onClick={(e) => go(e, "#hero")} aria-label="Aethel Labs home"><Mark variant="glyph" /></a>
      <div className={styles.links}>
        {content.nav.links.map((l) => (
          <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)}>{l.label}</a>
        ))}
        <a href="#contact" onClick={(e) => go(e, "#contact")} className={styles.cta}>{content.nav.cta.label}</a>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create `components/brand/Nav.module.css`**

```css
.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; padding: 18px 5vw; mix-blend-mode: difference; }
.links { display: flex; gap: 22px; align-items: center; font-size: 14px; color: #fff; }
.cta { border: 1px solid #fff; padding: 8px 16px; border-radius: 999px; }
@media (max-width: 640px) { .links a:not(.cta) { display: none; } }
```

- [ ] **Step 3: Render `<Nav />` in `Experience.tsx`**

Add `import { Nav } from "@/components/brand/Nav";` and render `<Nav />` just inside `<SmoothScroll>` before `<MoodBackground />`.

- [ ] **Step 4: Manual verification**

Run: `npm run dev`. Click each nav link.
Expected: the page smoothly scrolls so the corresponding section comes into view horizontally. Logo returns to hero. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add components/brand/Nav.tsx components/brand/Nav.module.css components/scroll/Experience.tsx
git commit -m "feat: add fixed nav with horizontal scroll-to-section"
```

**PHASE 3 COMPLETE — signature motion in place.**

---

# PHASE 4 — Ship-ready (contact form, fallback, SEO, perf, deploy)

---

### Task 4.1: Contact input validation (`lib/contact.ts`)

**Files:**
- Create: `lib/contact.ts`
- Test: `test/contact.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { validateContact } from "@/lib/contact";

describe("validateContact", () => {
  it("accepts a well-formed submission", () => {
    const r = validateContact({ name: "Jo", email: "jo@x.com", message: "Hello there", company: "" });
    expect(r.ok).toBe(true);
  });
  it("rejects a missing name", () => {
    const r = validateContact({ name: "", email: "jo@x.com", message: "Hello there", company: "" });
    expect(r.ok).toBe(false);
  });
  it("rejects a bad email", () => {
    const r = validateContact({ name: "Jo", email: "nope", message: "Hello there", company: "" });
    expect(r.ok).toBe(false);
  });
  it("rejects a too-short message", () => {
    const r = validateContact({ name: "Jo", email: "jo@x.com", message: "hi", company: "" });
    expect(r.ok).toBe(false);
  });
  it("treats a filled honeypot (company) as spam", () => {
    const r = validateContact({ name: "Jo", email: "jo@x.com", message: "Hello there", company: "bot" });
    expect(r.ok).toBe(false);
    expect(r.spam).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- contact`
Expected: FAIL — cannot find module.

- [ ] **Step 3: Implement `lib/contact.ts`**

```ts
export interface ContactInput {
  name: string;
  email: string;
  message: string;
  /** honeypot — must be empty for a human */
  company?: string;
}

export type ValidationResult =
  | { ok: true; data: { name: string; email: string; message: string } }
  | { ok: false; error: string; spam?: boolean };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(input: ContactInput): ValidationResult {
  if (input.company && input.company.trim() !== "") return { ok: false, error: "Rejected.", spam: true };
  const name = input.name?.trim() ?? "";
  const email = input.email?.trim() ?? "";
  const message = input.message?.trim() ?? "";
  if (name.length < 1) return { ok: false, error: "Please add your name." };
  if (!EMAIL.test(email)) return { ok: false, error: "Please add a valid email." };
  if (message.length < 5) return { ok: false, error: "Tell me a little more." };
  return { ok: true, data: { name, email, message } };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- contact`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/contact.ts test/contact.test.ts
git commit -m "feat: add contact form validation with honeypot"
```

---

### Task 4.2: Contact API route (Resend)

**Files:**
- Create: `app/api/contact/route.ts`, `.env.local.example`
- Test: `test/contact-route.test.ts`

- [ ] **Step 1: Install Resend**

```bash
npm install resend
```

- [ ] **Step 2: Create `.env.local.example`**

```bash
# Resend transactional email (Phase 4)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
CONTACT_TO_EMAIL=joshuasabuero.main@gmail.com
CONTACT_FROM_EMAIL=Aethel Labs <onboarding@resend.dev>
```

- [ ] **Step 3: Write the failing test (mock Resend)**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const sendMock = vi.fn();
vi.mock("resend", () => ({
  Resend: vi.fn(() => ({ emails: { send: sendMock } })),
}));

import { POST } from "@/app/api/contact/route";

function req(body: unknown) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => { sendMock.mockReset(); sendMock.mockResolvedValue({ data: { id: "x" }, error: null }); process.env.RESEND_API_KEY = "re_test"; });

  it("sends an email for a valid submission", async () => {
    const res = await POST(req({ name: "Jo", email: "jo@x.com", message: "Hello there" }));
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledOnce();
  });

  it("rejects an invalid submission without sending", async () => {
    const res = await POST(req({ name: "", email: "bad", message: "hi" }));
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("silently accepts but drops spam (honeypot filled)", async () => {
    const res = await POST(req({ name: "Jo", email: "jo@x.com", message: "Hello there", company: "bot" }));
    expect(res.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npm test -- contact-route`
Expected: FAIL — cannot find route module.

- [ ] **Step 5: Implement `app/api/contact/route.ts`**

```ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { validateContact } from "@/lib/contact";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = validateContact((body ?? {}) as never);
  if (!result.ok) {
    if (result.spam) return NextResponse.json({ ok: true }, { status: 200 }); // silently drop spam
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Email not configured." }, { status: 500 });

  const resend = new Resend(apiKey);
  const { name, email, message } = result.data;
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? "Aethel Labs <onboarding@resend.dev>",
    to: process.env.CONTACT_TO_EMAIL ?? "joshuasabuero.main@gmail.com",
    replyTo: email,
    subject: `New project inquiry — ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  if (error) return NextResponse.json({ error: "Could not send. Try email instead." }, { status: 502 });
  return NextResponse.json({ ok: true }, { status: 200 });
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- contact-route`
Expected: PASS (3 tests).

- [ ] **Step 7: Commit**

```bash
git add app/api/contact/route.ts .env.local.example package.json package-lock.json test/contact-route.test.ts
git commit -m "feat: add resend-backed contact api route"
```

---

### Task 4.3: Real contact form UI

**Files:**
- Modify: `components/ui/ContactForm.tsx`
- Create: `components/ui/ContactForm.module.css`
- Test: `test/contact-form.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/components/ui/ContactForm";

describe("ContactForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 })));
  });

  it("submits and shows a success state", async () => {
    render(<ContactForm />);
    await userEvent.type(screen.getByLabelText(/name/i), "Jo");
    await userEvent.type(screen.getByLabelText(/email/i), "jo@x.com");
    await userEvent.type(screen.getByLabelText(/project/i), "I need a brand and a site.");
    await userEvent.click(screen.getByRole("button", { name: /send|start/i }));
    expect(await screen.findByText(/thank|got it|in touch/i)).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith("/api/contact", expect.objectContaining({ method: "POST" }));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- contact-form`
Expected: FAIL — stub still renders the placeholder text.

- [ ] **Step 3: Implement `components/ui/ContactForm.tsx`**

```tsx
"use client";
import { useState } from "react";
import styles from "./ContactForm.module.css";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      message: String(form.get("message") ?? ""),
      company: String(form.get("company") ?? ""),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Network error. Email me directly.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return <p className={styles.success} role="status">Got it — I&apos;ll be in touch shortly.</p>;
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label className={styles.field}><span>Name</span><input name="name" required /></label>
      <label className={styles.field}><span>Email</span><input name="email" type="email" required /></label>
      <label className={styles.field}><span>Your project</span><textarea name="message" rows={4} required /></label>
      <input name="company" className={styles.honey} tabIndex={-1} autoComplete="off" aria-hidden />
      <button className={styles.submit} disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Start a project"}
      </button>
      {status === "error" && <p className={styles.error} role="alert">{error}</p>}
    </form>
  );
}
```

- [ ] **Step 4: Create `components/ui/ContactForm.module.css`**

```css
.form { display: grid; gap: 16px; max-width: 460px; margin-top: 28px; }
.field { display: grid; gap: 6px; font-size: 13px; }
.field input, .field textarea { padding: 12px 14px; border-radius: 10px; border: 1px solid color-mix(in srgb, currentColor 30%, transparent); background: transparent; color: inherit; font: inherit; }
.honey { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
.submit { padding: 13px 22px; border-radius: 999px; background: var(--surface-accent); color: #fff; border: none; font-weight: 600; cursor: pointer; justify-self: start; }
.success { margin-top: 28px; font-size: 18px; }
.error { color: #ffb4a0; font-size: 14px; }
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- contact-form`
Expected: PASS.

- [ ] **Step 6: Manual verification**

Add a real `RESEND_API_KEY` to `.env.local` (copy from `.env.local.example`). Run `npm run dev`, fill the form on the Contact section, submit.
Expected: success message; an email arrives at the configured address. Stop the server.

- [ ] **Step 7: Commit**

```bash
git add components/ui/ContactForm.tsx components/ui/ContactForm.module.css test/contact-form.test.tsx
git commit -m "feat: real contact form posting to api with honeypot and states"
```

---

### Task 4.4: Mobile / responsive verification pass

**Files:**
- Modify: `components/scroll/HorizontalTrack.tsx` (force vertical under a width/pointer check), `app/globals.css` if needed

- [ ] **Step 1: Add a coarse/narrow guard to `HorizontalTrack`**

In the `useGSAP` callback, replace the reduced-motion guard with a combined guard:

```tsx
const isNarrow = window.matchMedia("(max-width: 820px)").matches;
const isCoarse = window.matchMedia("(pointer: coarse)").matches;
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduce || isNarrow || isCoarse || !track.current || !viewport.current) {
  onProgress?.(0);
  return;
}
```

And extend the CSS fallback in `HorizontalTrack.module.css` to the same breakpoint:

```css
@media (max-width: 820px), (pointer: coarse) {
  .viewport { height: auto; overflow: visible; }
  .track { display: block; height: auto; }
  .track > section { flex: none; width: 100%; height: auto; min-height: 100vh; }
}
```

- [ ] **Step 2: Drive the mood arc on vertical scroll in fallback mode**

Create `components/scroll/VerticalMood.tsx`:

```tsx
"use client";
import { useEffect } from "react";

/** In fallback (vertical) mode, report progress from window scroll so the mood arc still plays. */
export function VerticalMood({ onProgress }: { onProgress: (p: number) => void }) {
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      onProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onProgress]);
  return null;
}
```

Render it in `Experience.tsx` (it is harmless in horizontal mode because the pinned scroll also moves `scrollY`, but to avoid double-driving, only mount it when horizontal is disabled — gate with the same media query via a `useState`+effect, or simply accept window-scroll as the single source in fallback). Simplest correct wiring: in `Experience.tsx`, compute `const fallback = typeof window !== 'undefined' && (matchMedia('(max-width:820px)').matches || matchMedia('(pointer:coarse)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches)` inside an effect into state, and render `<VerticalMood onProgress={setProgress}/>` only when `fallback` is true.

- [ ] **Step 3: Manual verification (responsive)**

Run `npm run dev`. In devtools device toolbar, choose a phone (e.g. iPhone 14).
Expected: sections stack vertically; scrolling down still morphs the background through the mood arc; the logo build shows assembled; nav collapses; the form is usable. Then test desktop width — horizontal restored. Stop the server.

- [ ] **Step 4: Verify build + tests**

Run: `npm run build && npm test`
Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add components/scroll
git commit -m "feat: vertical mobile fallback retains mood arc"
```

---

### Task 4.5: SEO — OG image + JSON-LD

**Files:**
- Create: `app/opengraph-image.tsx` (or place a static `public/brand/og.png`)
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add Open Graph + JSON-LD to `app/layout.tsx`**

Extend `metadata` and inject JSON-LD:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://aethel-labs.example"), // replace with real domain (spec §12)
  title: "Aethel Labs — Brand & Web Studio",
  description: "A digital studio for brand identity, websites, and the content that keeps them alive. Design worth the name.",
  openGraph: {
    title: "Aethel Labs — Brand & Web Studio",
    description: "Design and build under one roof. Design worth the name.",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Aethel Labs",
  description: "Brand identity, websites, and the content that keeps them alive.",
  email: "joshuasabuero.main@gmail.com",
  areaServed: "Worldwide",
  serviceType: ["Brand Identity", "Web Design", "Content Engine"],
};
```

In the `<body>`, add before `{children}`:

```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
```

- [ ] **Step 2: Create a generated OG image `app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "radial-gradient(120% 130% at 20% 50%, #c75d3a 0%, #1d2b3f 42%, #0a1a2f 82%)", color: "#fff", fontSize: 64, fontWeight: 700 }}>
        <div style={{ fontSize: 24, letterSpacing: 4, opacity: 0.8 }}>AETHEL LABS</div>
        <div style={{ marginTop: 20, lineHeight: 1.1 }}>Designing brands. Building what they live on.</div>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 3: Manual verification**

Run `npm run build && npm run start`. Visit `http://localhost:3000/opengraph-image`.
Expected: a 1200×630 ember→ink card renders. View page source: JSON-LD `<script>` present. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/opengraph-image.tsx
git commit -m "feat: add og image and professionalservice json-ld"
```

---

### Task 4.6: Performance + accessibility pass

**Files:**
- Modify: as needed (image usage, focus states in `globals.css`)

- [ ] **Step 1: Add visible focus styles to `app/globals.css`**

```css
:focus-visible { outline: 2px solid var(--surface-accent); outline-offset: 3px; border-radius: 4px; }
```

- [ ] **Step 2: Confirm no layout-shift offenders**

Ensure every `next/image` use has explicit width/height (Mark already does). Project images (when added) must use `next/image` with dimensions and `loading="lazy"`.

- [ ] **Step 3: Lighthouse check**

Run `npm run build && npm run start`. In Chrome devtools → Lighthouse, run Performance + Accessibility on desktop.
Expected: Accessibility ≥ 95; no critical contrast failures (ember is used on large text/decoration only); Performance good (single page, vector mark). Note any flagged issue and fix obvious ones (alt text, contrast, label association).

- [ ] **Step 4: Keyboard pass**

Tab through the page.
Expected: nav links, form fields, and button are reachable with a visible focus ring; Enter activates nav links and submits the form.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "style: focus-visible states and a11y/perf pass"
```

---

### Task 4.7: Deploy to Vercel

- [ ] **Step 1: Push the branch and open a PR (or push to main per your workflow)**

```bash
git push -u origin main
```

- [ ] **Step 2: Import the repo in Vercel**

In the Vercel dashboard, import the GitHub repo. Framework preset auto-detects Next.js.

- [ ] **Step 3: Set environment variables in Vercel**

Add `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` (Production + Preview). Update `metadataBase` in `app/layout.tsx` to the real domain and commit.

- [ ] **Step 4: Verify the deployment**

Open the Vercel preview URL. Walk the full horizontal experience, the mood arc, the logo build, and submit the contact form (confirm the email arrives).
Expected: parity with local; form delivers mail.

- [ ] **Step 5: Commit any domain/config fixes**

```bash
git add -A
git commit -m "chore: production domain + deploy config"
git push
```

**PHASE 4 COMPLETE — live, functional, accessible site.**

---

## Self-Review Notes (author check against spec)

- **Spec §2 (pinned-translate horizontal):** Task 2.4. ✓
- **Spec §3 (Next/GSAP/Lenis/Resend stack):** Tasks 1.1, 2.1, 4.2. ✓
- **Spec §4 (logo build-scrub + `mode` hook):** Tasks 3.1–3.2; `LogoBuild` keeps `mode: '2d'|'3d'`. ✓
- **Spec §5 (mood background + interpolation + tokens):** Tasks 1.3, 1.4, 2.2, 2.5. ✓
- **Spec §5 mood arc (10 sections):** `lib/moods.ts` Task 1.4. ✓
- **Spec §6 (component architecture/file layout):** matches the File Structure section. ✓
- **Spec §7 (responsive/mobile fallback):** Task 4.4. ✓
- **Spec §8 (a11y + reduced-motion + perf):** reduced-motion guards in 2.3/2.4/3.2/3.3; Task 4.6. ✓
- **Spec §9 (contact form → Resend):** Tasks 4.1–4.3. ✓
- **Spec §10 (SEO/OG/JSON-LD):** Task 4.5. ✓
- **Spec §11 (4 phases):** plan is organized into exactly those phases. ✓
- **Spec §12 (placeholders):** content.ts marks pricing/work/socials as placeholders; `.env.local.example` + `metadataBase` flagged for real values. ✓
- **Spec §13 (3D + shader upgrade hooks):** `LogoBuild mode` prop and isolated `MoodBackground` glow layer preserve both hooks. ✓

**Known follow-ups (not blockers):** real pricing numbers, real case studies + project images, social links, production domain, Resend API key provisioning.
```
