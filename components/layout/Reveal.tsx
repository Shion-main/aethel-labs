"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

/** Fades/rises its children in the first time they scroll into view. Reduced-motion safe. */
export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") return; // visible by default
    const reveal = () => gsap.to(el, { opacity: 1, y: 0, duration: 0.9, delay, ease: "power2.out" });
    gsap.set(el, { opacity: 0, y: 40 });
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            reveal();
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    // Safety net: never let content stay hidden if the observer never fires
    // (inactive tab, headless render). Reveal regardless after a short wait.
    const fallback = window.setTimeout(reveal, 1600);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [delay]);
  return <div ref={ref}>{children}</div>;
}
