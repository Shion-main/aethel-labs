"use client";
import { useEffect, useRef } from "react";
import styles from "./BuildSpine.module.css";

// The Aethel frame-mark, as its two source paths (viewBox 0 0 5122 5122).
const TIP = "M2775.07 2746.5L2977.68 2401.5L3339 2605.95L2775.07 2746.5Z";
const BODY =
  "M3307 1266H565V1678H896.573L2234.5 2444L2437.64 2092L1720.57 1678H2775.07L1523 3846.64H1998.74L1999.07 3846.06L2802.3 3855.86L2234.5 3522L3307 1691.5L3818.5 1987.86H4557.3L3307 1266Z";

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
// ease so stage edges feel deliberate, not linear
const ease = (t: number) => t * t * (3 - 2 * t);

/**
 * The build-spine. A persistent ghost frame-mark that builds as the world slides:
 *   frames (0–0.34) -> shapes (0.24–0.6) -> colour (0.55–0.84) -> resolve (0.8–1).
 * Drives CSS custom properties (cheap) rather than re-rendering the SVG.
 */
export function BuildSpine({ progress }: { progress: number }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const p = progress;
    const draw = ease(clamp(p / 0.34));
    const fill = ease(clamp((p - 0.24) / 0.36));
    const color = ease(clamp((p - 0.55) / 0.29));
    const resolve = ease(clamp((p - 0.8) / 0.2));

    el.style.setProperty("--draw", draw.toFixed(3));
    el.style.setProperty("--strokeop", (1 - fill).toFixed(3)); // outline fades as shape fills
    el.style.setProperty("--filln", (fill * (1 - color)).toFixed(3));
    el.style.setProperty("--fillc", (fill * color).toFixed(3));
    el.style.setProperty("--spine-op", (0.04 + 0.07 * p + 0.06 * resolve).toFixed(3));
    el.style.setProperty("--spine-scale", (0.92 + 0.1 * resolve).toFixed(3));
  }, [progress]);

  return (
    <div className={styles.spine} aria-hidden>
      <svg ref={ref} className={styles.svg} viewBox="0 0 5122 5122" fill="none">
        <defs>
          <linearGradient id="aeSpineGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d67955" />
            <stop offset="0.55" stopColor="#c75d3a" />
            <stop offset="1" stopColor="#853a22" />
          </linearGradient>
        </defs>
        <g className={styles.stroke}>
          <path pathLength={1} d={BODY} />
          <path pathLength={1} d={TIP} />
        </g>
        <g className={styles.flat}>
          <path d={BODY} />
          <path d={TIP} />
        </g>
        <g className={styles.grad}>
          <path d={BODY} />
          <path d={TIP} />
        </g>
      </svg>
    </div>
  );
}
