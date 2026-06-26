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
    const p = paletteAt(0.5 / (sectionOrder.length - 1));
    const a = moods[sectionOrder[0]].core;
    const b = moods[sectionOrder[1]].core;
    expect(p.core).toBe(lerpColor(a, b, 0.5));
  });
});
