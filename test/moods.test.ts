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
