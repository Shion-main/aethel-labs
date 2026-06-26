import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { Mark } from "@/components/brand/Mark";
import { Reveal } from "@/components/layout/Reveal";
import s from "./sections.module.css";

export function Frame() {
  const { eyebrow, heading, body } = content.frame;
  return (
    <Section id="frame">
      <Reveal>
        <div>
          <p className={s.eyebrow}>{eyebrow}</p>
          <h2 className={s.headline}>{heading}</h2>
          <p className={s.sub}>{body}</p>
        </div>
      </Reveal>
      <Mark variant="glyph" />
    </Section>
  );
}
