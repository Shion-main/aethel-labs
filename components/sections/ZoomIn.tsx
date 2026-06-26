"use client";
import { type ReactNode } from "react";
import { useProgress } from "@/components/scroll/ProgressContext";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Scales its children up from small to full as the panel slides toward the
 * active centre — the "next section enlarges to cover" zoom. `center` is the
 * global scroll progress (0..1) at which this panel is centred.
 */
export function ZoomIn({ center, children }: { center: number; children: ReactNode }) {
  const progress = useProgress();
  const t = clamp01(progress / center);
  const scale = lerp(0.8, 1, t);
  const opacity = clamp01(t * 1.5);
  return (
    <div style={{ transform: `scale(${scale})`, opacity, transformOrigin: "center", willChange: "transform, opacity" }}>
      {children}
    </div>
  );
}
