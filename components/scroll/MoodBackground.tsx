"use client";
import { useEffect, useRef } from "react";
import { paletteAt } from "@/lib/interpolate";
import styles from "./MoodBackground.module.css";

export function MoodBackground({ progress }: { progress: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const p = paletteAt(progress);
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--bg-core", p.core);
    el.style.setProperty("--bg-edge", p.edge);
    // drift the glow horizontally with progress for parallax depth
    el.style.setProperty("--glow-x", `${20 + progress * 60}%`);
    document.body.style.setProperty("--surface-text", p.text);
    document.body.style.setProperty("--surface-accent", p.accent);
  }, [progress]);

  return <div ref={ref} className={styles.bg} aria-hidden />;
}
