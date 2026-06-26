import { Mark } from "@/components/brand/Mark";

export function LogoBuild({ mode = "2d" }: { mode?: "2d" | "3d" }) {
  // Phase 3 replaces this with the scroll-scrubbed assembly. Stub renders the final mark.
  return <div data-logobuild={mode}><Mark variant="glyph" /></div>;
}
