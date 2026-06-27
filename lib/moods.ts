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

// Brand surface arc — warm paper base + dark ink bands, ember the one accent.
// Dark panels (hero, frame, about, footer + the bespoke Ethos pitch panel) sit on
// ink with an ember glow; light panels (services, work, process, packages, contact)
// sit on warm paper. As the world slides, the radial glow morphs paper <-> ink.
export const ACCENT = "#c75d3a"; // ember-500
const EMBER = "#c75d3a";
const INK = "#0a1a2f"; // ink-950
const INK_800 = "#172638";
const INK_DEEP = "#070d16";
const PAPER = "#faf8f5";
const PAPER_DEEP = "#f3efea";
const PAPER_SUNK = "#ece5da";
const TEXT_DARK = "#faf8f5"; // warm paper text on ink
const TEXT_LIGHT = "#0a1a2f"; // ink text on paper

export const sectionOrder: SectionId[] = [
  "hero", "pitch", "services", "frame", "work",
  "process", "packages", "about", "contact", "footer",
];

export const moods: Record<SectionId, Palette> = {
  // DARK — ink ground, ember glow
  hero:     { core: EMBER,     edge: INK,       text: TEXT_DARK,  accent: ACCENT },
  // Ethos blocking panel renders its own solid surface; keep this dark + neutral.
  pitch:    { core: "#161617", edge: "#0b0b0c", text: "#f2f2f2",  accent: ACCENT },
  // LIGHT — warm paper
  services: { core: PAPER,     edge: PAPER_DEEP, text: TEXT_LIGHT, accent: ACCENT },
  // DARK — ember peak (the frame / approach)
  frame:    { core: EMBER,     edge: INK,       text: TEXT_DARK,  accent: ACCENT },
  // LIGHT
  work:     { core: PAPER,     edge: PAPER_DEEP, text: TEXT_LIGHT, accent: ACCENT },
  process:  { core: PAPER_DEEP, edge: PAPER_SUNK, text: TEXT_LIGHT, accent: ACCENT },
  packages: { core: PAPER,     edge: PAPER_DEEP, text: TEXT_LIGHT, accent: ACCENT },
  // DARK — flat ink
  about:    { core: INK_800,   edge: INK,       text: TEXT_DARK,  accent: ACCENT },
  // LIGHT
  contact:  { core: PAPER,     edge: PAPER_DEEP, text: TEXT_LIGHT, accent: ACCENT },
  // DARK — deep ink close
  footer:   { core: INK,       edge: INK_DEEP,  text: "#cdd5dd",  accent: ACCENT },
};
