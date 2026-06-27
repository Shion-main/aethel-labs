import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { Mark } from "@/components/brand/Mark";
import { Reveal } from "@/components/layout/Reveal";
import { SectionHead } from "./SectionHead";
import s from "./sections.module.css";

export function Frame() {
  const { eyebrow, heading, body } = content.frame;
  return (
    <Section id="frame">
      <div className={s.split}>
        <Reveal>
          <div>
            <SectionHead eyebrow={eyebrow} heading={heading} inverse wide />
            <p className={s.splitBody}>{body}</p>
          </div>
        </Reveal>
        <div className={s.frameArt}>
          <div className={s.frameGlow} />
          <Mark variant="glyph" />
        </div>
      </div>
    </Section>
  );
}
