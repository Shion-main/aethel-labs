"use client";
import { type ReactNode } from "react";
import { useProgress } from "@/components/scroll/ProgressContext";

/**
 * Holds its children STILL at the viewport (countering the track's leftward
 * slide) across the scroll window [start, end], so the section sits "already
 * there" behind the opaque panel in front of it. The panel in front keeps
 * sliding left and uncovers this one — like it was blocking the view.
 *
 * Outside the window the children ride the track normally (counter = 0), so the
 * section enters/exits like any other. The snap into the pinned position at
 * `start` happens while the front panel fully covers the viewport, so it's unseen.
 *
 * `index` = this section's panel index; `total` = total panels. In the
 * reduced-motion / vertical fallback `progress` stays 0 (< start) so this is inert.
 */
export function PinBehind({
  index,
  total,
  start,
  end,
  children,
}: {
  index: number;
  total: number;
  start: number;
  end: number;
  children: ReactNode;
}) {
  const progress = useProgress();
  const distanceVw = (total - 1) * 100; // track travel in vw
  const naturalLeftVw = index * 100 - progress * distanceVw; // this panel's on-screen left
  const counter = progress >= start && progress <= end ? -naturalLeftVw : 0;
  return (
    <div style={{ transform: `translateX(${counter}vw)`, willChange: "transform" }}>{children}</div>
  );
}
