import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { HeroScene } from "./HeroScene";
import { Reveal } from "@/components/layout/Reveal";
import s from "./sections.module.css";

export function Hero() {
  const { eyebrow, headline, sub, ctas } = content.hero;
  return (
    <Section id="hero">
      <HeroScene>
        <Reveal>
          <div className={s.heroText}>
            <p className={s.eyebrow}>{eyebrow}</p>
            <h1 className={s.headline}>{headline}</h1>
            <p className={s.sub}>{sub}</p>
            <div className={s.ctas}>
              {ctas.map((c) => (
                <a key={c.label} href={c.href} className={`${s.btn} ${c.variant === "primary" ? s.primary : s.ghost}`}>{c.label}</a>
              ))}
            </div>
          </div>
        </Reveal>
      </HeroScene>
    </Section>
  );
}
