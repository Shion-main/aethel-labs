export interface CTA { label: string; href: string; variant: "primary" | "ghost"; }
export interface Service { title: string; body: string; tag?: string; }
export interface Project { name: string; kind: string; body: string; live?: boolean; image?: string; }
export interface Step { n: number; title: string; body: string; }
export interface Package { name: string; what: string; price: string; unit?: string; features: string[]; featured?: boolean; }

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
      { title: "Brand Identity", tag: "Identity", body: "A logo, a palette, a voice — the whole identity, built to be remembered. The foundation everything else stands on." },
      { title: "Websites & Landing Pages", tag: "Build", body: "Fast, modern sites that look the way your business deserves to look. Built on the same stack the big names run on — shipped in days, not months." },
      { title: "The Content Engine", tag: "Monthly", body: "A subscription that keeps your brand alive online. On-brand content, produced and delivered every month, so your feed never goes quiet between posts." },
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
    { name: "Landing Page", what: "A single, high-craft page that converts.", price: "₱___", unit: "",
      features: ["One page, fully bespoke", "Copy + design + build", "Shipped in days"] },
    { name: "Brand Identity", what: "Logo, palette, type, and a usage guide.", price: "₱___", unit: "", featured: true,
      features: ["Full visual identity", "Logo + marks + palette", "Usage guidelines"] },
    { name: "Content Engine", what: "A month of on-brand content, every month.", price: "₱___", unit: "/mo",
      features: ["On-brand monthly content", "Produced + delivered", "Cancel anytime"] },
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
    socials: [{ label: "Instagram", href: "#" }],
  },
  footer: {
    tagline: "Design worth the name.",
    copyright: "© 2026 Aethel Labs · Available worldwide",
  },
} as const;
