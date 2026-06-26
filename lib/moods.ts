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
