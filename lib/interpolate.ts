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
