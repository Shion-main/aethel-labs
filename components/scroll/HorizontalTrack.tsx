"use client";
import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import styles from "./HorizontalTrack.module.css";

/**
 * Pins a viewport and translates the inner track horizontally as the user scrolls.
 * Exposes scroll progress (0..1) via the onProgress callback for the mood background.
 */
export function HorizontalTrack({
  children,
  onProgress,
}: {
  children: ReactNode;
  onProgress?: (p: number) => void;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || !track.current || !viewport.current) {
        onProgress?.(0);
        return; // vertical fallback handled by CSS (Task 4.x)
      }
      const distance = track.current.scrollWidth - window.innerWidth;
      gsap.to(track.current, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: viewport.current,
          start: "top top",
          end: () => `+=${distance}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => onProgress?.(self.progress),
        },
      });
    },
    { scope: viewport, dependencies: [] }
  );

  return (
    <div ref={viewport} className={styles.viewport}>
      <div ref={track} className={styles.track}>
        {children}
      </div>
    </div>
  );
}
