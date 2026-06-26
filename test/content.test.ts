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
