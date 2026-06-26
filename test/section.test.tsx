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
