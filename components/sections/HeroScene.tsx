"use client";
import { useEffect, useState, type ReactNode } from "react";
import { useProgress } from "@/components/scroll/ProgressContext";
import styles from "./HeroScene.module.css";

/**
 * Hero composition. At rest the four logo parts sit as frosted-glass shards in
 * the MARGINS around the headline (never covering it). As scroll progresses they
 * fly inward — sweeping across, over the text — and assemble into the mark, which
 * cross-fades into the crisp full ÆTHEL LABS lockup. After it resolves, the whole
 * hero zooms out as it hands off to the next section.
 *
 * Scatter offsets are in vw / vh so the rest positions are real viewport margins.
 */

type Shard = {
  id: string;
  src: string;
  x: number; // rest offset (vw) from the assembly point
  y: number; // rest offset (vh)
  r: number; // rest rotation (deg)
  s: number; // rest scale
  z: number; // 2 = behind text, 4 = in front of text (sweeps over it)
  blur: number;
};

// Rest positions all sit to the right of / above / below the left-weighted
// headline (clear of the text). As they fly to the centre assembly point the
// two z:4 shards sweep leftward across the headline.
const SHARDS: Shard[] = [
  { id: "bar", src: "/brand/parts/part-bar.png", x: 8, y: -36, r: -14, s: 1.14, z: 2, blur: 4 },
  { id: "blade", src: "/brand/parts/part-blade.png", x: 40, y: -8, r: 18, s: 1.22, z: 4, blur: 9 },
  { id: "leg", src: "/brand/parts/part-leg.png", x: 18, y: 38, r: 13, s: 1.18, z: 2, blur: 5 },
  { id: "counter", src: "/brand/parts/part-counter.png", x: 52, y: 12, r: -22, s: 1.3, z: 4, blur: 10 },
];

const BUILD_END = 0.038; // assemble early, while the hero is still front-and-centre
const PITCH_CENTER = 1 / 9; // hero(0) → pitch(1) across 10 panels
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function HeroScene({ children }: { children: ReactNode }) {
  const progress = useProgress();
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const build = reduce ? 1 : clamp01(progress / BUILD_END);
  const resolved = clamp01((build - 0.55) / 0.45);
  // shards dissolve quickly as the crisp logo resolves, to avoid a double-mark
  const shardOpacity = clamp01(1 - resolved * 1.8);

  // after assembly, the hero zooms out as it hands off to the pitch
  const exit = reduce ? 0 : clamp01((progress - BUILD_END) / (PITCH_CENTER - BUILD_END));
  const sceneScale = lerp(1, 0.82, exit);
  const sceneOpacity = lerp(1, 0.2, exit);

  return (
    <div className={styles.scene} style={{ transform: `scale(${sceneScale})`, opacity: sceneOpacity }}>
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
                transform: `translate(${tx}vw, ${ty}vh) rotate(${rot}deg) scale(${sc})`,
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
