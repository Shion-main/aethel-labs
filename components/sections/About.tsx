import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { Reveal } from "@/components/layout/Reveal";
import s from "./sections.module.css";

export function About() {
  const { eyebrow, heading, body } = content.about;
  return (
    <Section id="about">
      <Reveal>
        <div>
          <p className={s.eyebrow}>{eyebrow}</p>
          <h2 className={s.headline}>{heading}</h2>
          <p className={s.sub}>{body}</p>
        </div>
      </Reveal>
    </Section>
  );
}
