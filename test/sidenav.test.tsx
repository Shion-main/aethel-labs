import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SideNav } from "@/components/nav/SideNav";

describe("SideNav", () => {
  it("renders a labelled nav with a button per section", () => {
    render(<SideNav />);
    expect(screen.getByRole("navigation", { name: /section navigation/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /work/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /pricing/i })).toBeInTheDocument();
  });
});
