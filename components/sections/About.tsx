import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { Reveal } from "@/components/layout/Reveal";
import { SectionHead } from "./SectionHead";
import s from "./sections.module.css";

export function About() {
  const { eyebrow, heading } = content.about;
  return (
    <Section id="about">
      <Reveal>
        <div style={{ maxWidth: "var(--container-text)" }}>
          <SectionHead eyebrow={eyebrow} heading={heading} inverse />
          <p className={s.aboutBody}>
            Aethel Labs exists because too many brands look good but don&apos;t work, and too many
            sites work but look like everyone else&apos;s. We do both — design and build — held to a
            single standard.
          </p>
          <p className={s.aboutBody}>
            The name comes from the Old English <em>æþel</em> — noble, of worth. It&apos;s a high bar
            to put in a name. That&apos;s the point. <strong>Design worth the name.</strong>
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
