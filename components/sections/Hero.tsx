import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { HeroScene } from "./HeroScene";
import { Reveal } from "@/components/layout/Reveal";
import { Button, Eyebrow } from "@/components/ui";
import s from "./sections.module.css";

export function Hero() {
  const { eyebrow, sub } = content.hero;
  return (
    <Section id="hero">
      <HeroScene>
        <Reveal>
          <div className={s.heroText}>
            <Eyebrow color="inverse">{eyebrow}</Eyebrow>
            <h1 className={s.display} style={{ marginTop: "var(--space-5)" }}>
              Designing brands.{"\n"}
              <span className={s.accent}>Building</span> what they live on.
            </h1>
            <p className={s.heroSub}>{sub}</p>
            <div className={s.ctas}>
              <Button variant="primary" size="lg" href="#work">See the work</Button>
              <Button variant="inverse" size="lg" href="#contact">Start a project</Button>
            </div>
          </div>
        </Reveal>
      </HeroScene>
    </Section>
  );
}
