"use client";
import { useEffect, useState, type ReactNode } from "react";
import { useProgress } from "@/components/scroll/ProgressContext";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * The solid Ethos panel. It fully covers its section, then as scroll moves
 * through [start, end] it "peels away" from the LEFT edge rightward (clip-path
 * inset on the left) while drifting gently left — uncovering the Services
 * section pinned behind it from the LEFT first (content-first, no empty margin
 * leading the reveal). Reduced-motion / vertical fallback: stays solid.
 */
export function EthosPanel({
  start,
  end,
  children,
}: {
  start: number;
  end: number;
  children: ReactNode;
}) {
  const progress = useProgress();
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const t = reduce ? 0 : clamp01((progress - start) / (end - start));
  const leftInset = t * 100; // clip from the left → reveals Services left-to-right

  // Pin the panel still (counter the track's leftward slide) during the window,
  // so it dissolves in place rather than sliding off and uncovering from the right.
  // Ethos is panel index 1 of 10 → natural left = 100vw - progress*900vw.
  const within = progress >= start && progress <= end;
  const counterVw = within ? -(100 - progress * 900) : 0;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#0b0b0d",
        clipPath: `inset(0 0 0 ${leftInset}%)`,
        transform: `translateX(${counterVw}vw)`,
        zIndex: 1,
        willChange: "clip-path, transform",
        display: "flex",
        alignItems: "center",
        padding: "6vh max(8vw, 96px) 6vh 8vw",
      }}
    >
      <div style={{ width: "100%", maxWidth: "var(--maxw)", margin: "0 auto" }}>{children}</div>
    </div>
  );
}
