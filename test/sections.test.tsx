import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { Packages } from "@/components/sections/Packages";
import { Contact } from "@/components/sections/Contact";

describe("sections render real content", () => {
  it("Hero shows the headline", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { name: /building what they live on/i })).toBeInTheDocument();
  });
  it("Services lists three offerings", () => {
    render(<Services />);
    expect(screen.getByText("Brand Identity")).toBeInTheDocument();
    // Title renders as "The Content Engine · monthly"; match the substring.
    expect(screen.getByText(/The Content Engine/)).toBeInTheDocument();
  });
  it("Work lists projects", () => {
    render(<Work />);
    // Titles render as "Name — <em>Kind</em>"; the name is split from the kind, so match the substring.
    expect(screen.getByText(/Umbra Coffee/)).toBeInTheDocument();
    expect(screen.getByText(/Korte/)).toBeInTheDocument();
  });
  it("Packages shows price fields", () => {
    render(<Packages />);
    expect(screen.getAllByText(/From|\/mo/).length).toBeGreaterThan(0);
  });
  it("Contact exposes the heading", () => {
    render(<Contact />);
    expect(screen.getByRole("heading", { name: /worth building/i })).toBeInTheDocument();
  });
});
