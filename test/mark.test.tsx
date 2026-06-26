import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Mark } from "@/components/brand/Mark";

describe("Mark", () => {
  it("renders an accessible logo image", () => {
    render(<Mark />);
    expect(screen.getByRole("img", { name: /aethel labs/i })).toBeInTheDocument();
  });
});
