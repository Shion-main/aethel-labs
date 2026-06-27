import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui";
import s from "./sections.module.css";

/** Eyebrow + big display heading + optional intro. The editorial unit at the
 *  top of every panel. `inverse` tints the eyebrow for dark surfaces. */
export function SectionHead({
  eyebrow,
  heading,
  intro,
  inverse = false,
  wide = false,
}: {
  eyebrow: string;
  heading: ReactNode;
  intro?: ReactNode;
  inverse?: boolean;
  wide?: boolean;
}) {
  return (
    <div className={wide ? s.headWide : s.head}>
      <Eyebrow color={inverse ? "inverse" : "accent"} style={{ marginBottom: "var(--space-4)" }}>
        {eyebrow}
      </Eyebrow>
      <h2 className={s.headline}>{heading}</h2>
      {intro ? <p className={s.intro}>{intro}</p> : null}
    </div>
  );
}
