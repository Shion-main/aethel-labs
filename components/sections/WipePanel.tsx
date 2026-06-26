"use client";
import { useEffect, useState } from "react";
import { useProgress } from "@/components/scroll/ProgressContext";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * A solid section backdrop that "develops" in with a left→right wipe
 * (clip-path inset) as scroll progresses through [start, end]. Sits behind the
 * section content and fills the whole panel, so the section reads as being
 * uncovered left-to-right rather than hard-sliding in. Reduced-motion: solid.
 */
export function WipePanel({ start, end, color }: { start: number; end: number; color: string }) {
  const progress = useProgress();
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const t = reduce ? 1 : clamp01((progress - start) / (end - start));
  const rightInset = (1 - t) * 100; // 100% → 0% : reveals from the left edge rightward

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        background: color,
        clipPath: `inset(0 ${rightInset}% 0 0)`,
        willChange: "clip-path",
      }}
    />
  );
}
