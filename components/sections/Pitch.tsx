import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { Reveal } from "@/components/layout/Reveal";
import s from "./sections.module.css";

export function Pitch() {
  return (
    <Section id="pitch">
      <Reveal>
        <h2 className={s.headline} style={{ maxWidth: "20ch" }}>{content.pitch}</h2>
      </Reveal>
    </Section>
  );
}
