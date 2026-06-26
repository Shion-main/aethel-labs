import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { Reveal } from "@/components/layout/Reveal";
import { ZoomIn } from "./ZoomIn";
import s from "./sections.module.css";

export function Pitch() {
  return (
    <Section id="pitch">
      <div className={s.pitchBg} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/mark-white.svg" alt="" className={s.pitchWatermark} />
      </div>
      <ZoomIn center={1 / 9}>
        <Reveal>
          <h2 className={s.statement}>{content.pitch}</h2>
        </Reveal>
      </ZoomIn>
    </Section>
  );
}
