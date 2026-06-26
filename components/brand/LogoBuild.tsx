"use client";
import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useProgress } from "@/components/scroll/ProgressContext";
import { MarkParts } from "./parts";
import styles from "./LogoBuild.module.css";

// The hero panel occupies roughly the first 1/9 of global scroll progress.
// Finish the build a touch before it leaves the screen.
const BUILD_END = 0.08;

export function LogoBuild({ mode = "2d" }: { mode?: "2d" | "3d" }) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const progress = useProgress();

  // Build a paused timeline that assembles the four parts from off-stage.
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const parts = root.current?.querySelectorAll<SVGGElement>("[data-part]");
      if (!parts || parts.length === 0) return;
      if (reduce) {
        gsap.set(parts, { opacity: 1, x: 0, y: 0, scale: 1 });
        return;
      }
      const timeline = gsap.timeline({ paused: true });
      timeline
        .fromTo('[data-part="bar"]',     { x: -400, opacity: 0 }, { x: 0, opacity: 1, duration: 1 }, 0)
        .fromTo('[data-part="blade"]',   { x: 400, y: -200, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 1 }, 0.2)
        .fromTo('[data-part="leg"]',     { y: 400, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.4)
        .fromTo('[data-part="counter"]', { scale: 0, opacity: 0, transformOrigin: "center" }, { scale: 1, opacity: 1, duration: 0.8 }, 0.7);
      tl.current = timeline;
    },
    { scope: root, dependencies: [] }
  );

  // Scrub the timeline by mapping global progress into the hero sub-range.
  useEffect(() => {
    if (!tl.current) return;
    const local = Math.min(1, Math.max(0, progress / BUILD_END));
    tl.current.progress(local);
  }, [progress]);

  return (
    <div ref={root} className={styles.wrap} data-logobuild={mode}>
      <svg viewBox="0 0 5122 5122" className={styles.svg} role="img" aria-label="Aethel Labs mark">
        <MarkParts />
      </svg>
    </div>
  );
}
