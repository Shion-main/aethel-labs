"use client";
import { useEffect, useRef } from "react";
import { paletteAt } from "@/lib/interpolate";
import { moods, sectionOrder } from "@/lib/moods";
import styles from "./MoodBackground.module.css";

export function MoodBackground({ progress }: { progress: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const activeRef = useRef(-1);

  // Per-frame: smooth glow morph — but written only to THIS one fixed element,
  // so it does not restyle the rest of the document.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const p = paletteAt(progress);
    el.style.setProperty("--bg-core", p.core);
    el.style.setProperty("--bg-edge", p.edge);
    el.style.setProperty("--glow-x", `${20 + progress * 60}%`);
  }, [progress]);

  // Discrete: text/accent change only when the ACTIVE SECTION changes, not every
  // frame. Setting a CSS var on <body> recalculates styles for every descendant,
  // so doing it per-frame would restyle the whole document on each scroll tick.
  // Consumers transition `color` to smooth the snap.
  useEffect(() => {
    const last = sectionOrder.length - 1;
    const i = Math.min(last, Math.max(0, Math.round(progress * last)));
    if (i === activeRef.current) return;
    activeRef.current = i;
    const m = moods[sectionOrder[i]];
    document.body.style.setProperty("--surface-text", m.text);
    document.body.style.setProperty("--surface-accent", m.accent);
  }, [progress]);

  return <div ref={ref} className={styles.bg} aria-hidden />;
}
