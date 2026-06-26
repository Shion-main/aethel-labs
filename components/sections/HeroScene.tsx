"use client";
import { useEffect, useState, type ReactNode } from "react";
import { useProgress } from "@/components/scroll/ProgressContext";
import styles from "./HeroScene.module.css";

/**
 * The hero composition: the four logo parts appear as scattered frosted-glass
 * shards (each a div masked to the exact part silhouette), drifting at different
 * depths — some BEHIND the headline, some IN FRONT of it. As scroll progresses
 * they converge into the assembled mark, then cross-fade into the crisp full
 * logo lockup. Ambient glass panes give the background depth.
 */

type Shard = {
  id: string;
  src: string;
  /** scattered offset (% of shard box), rotation (deg), scale at progress 0 */
  x: number;
  y: number;
  r: number;
  s: number;
  /** stacking layer: 2 = behind text, 4 = in front of text */
  z: number;
  /** base blur of the frosted glass */
  blur: number;
};

// blade + counter sit IN FRONT of the text (z 4) for the 3D depth-over-text effect.
const SHARDS: Shard[] = [
  { id: "bar", src: "/brand/parts/part-bar.png", x: -34, y: -46, r: -15, s: 1.15, z: 2, blur: 4 },
  { id: "blade", src: "/brand/parts/part-blade.png", x: -86, y: 14, r: 19, s: 1.22, z: 4, blur: 9 },
  { id: "leg", src: "/brand/parts/part-leg.png", x: -22, y: 48, r: 13, s: 1.2, z: 2, blur: 5 },
  { id: "counter", src: "/brand/parts/part-counter.png", x: -98, y: -26, r: -24, s: 1.35, z: 4, blur: 10 },
];

const BUILD_END = 0.085;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function HeroScene({ children }: { children: ReactNode }) {
  const progress = useProgress();
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const build = reduce ? 1 : Math.min(1, Math.max(0, progress / BUILD_END));
  // crisp full logo resolves in the final third of the build; shards fade out under it.
  const resolved = Math.min(1, Math.max(0, (build - 0.55) / 0.45));
  const shardOpacity = 1 - resolved * 0.9;

  return (
    <div className={styles.scene}>
      <div className={styles.pane1} style={{ transform: `rotate(-8deg) translateY(${lerp(18, -22, build)}px)` }} />
      <div className={styles.pane2} style={{ transform: `rotate(10deg) translateY(${lerp(-16, 26, build)}px)` }} />

      <div className={styles.stage} aria-hidden>
        {SHARDS.map((sh) => {
          const tx = lerp(sh.x, 0, build);
          const ty = lerp(sh.y, 0, build);
          const rot = lerp(sh.r, 0, build);
          const sc = lerp(sh.s, 1, build);
          return (
            <div
              key={sh.id}
              className={styles.shard}
              style={{
                WebkitMaskImage: `url(${sh.src})`,
                maskImage: `url(${sh.src})`,
                transform: `translate(${tx}%, ${ty}%) rotate(${rot}deg) scale(${sc})`,
                opacity: shardOpacity,
                backdropFilter: `blur(${sh.blur}px) saturate(150%)`,
                WebkitBackdropFilter: `blur(${sh.blur}px) saturate(150%)`,
                zIndex: sh.z,
              }}
            />
          );
        })}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo-full-white.svg"
          alt=""
          aria-hidden
          className={styles.resolved}
          style={{ opacity: resolved }}
        />
      </div>

      <div className={styles.mid}>
        <div className={styles.midInner}>{children}</div>
      </div>
    </div>
  );
}
