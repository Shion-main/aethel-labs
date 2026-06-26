import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import s from "./sections.module.css";

export function Pitch() {
  return (
    <Section id="pitch">
      <h2 className={s.headline} style={{ maxWidth: "20ch" }}>{content.pitch}</h2>
    </Section>
  );
}
