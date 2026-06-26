import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { Reveal } from "@/components/layout/Reveal";
import { WipePanel } from "./WipePanel";
import s from "./sections.module.css";

export function Services() {
  const { eyebrow, heading, items } = content.services;
  return (
    <Section id="services">
      <WipePanel start={1 / 9} end={2 / 9} color="#0a1a2f" />
      <Reveal>
        <div>
          <p className={s.eyebrow}>{eyebrow}</p>
          <h2 className={s.headline}>{heading}</h2>
          <div className={s.grid3}>
            {items.map((it) => (
              <article key={it.title} className={s.card}>
                <h3 className={s.cardTitle}>{it.title}{it.tag ? ` · ${it.tag}` : ""}</h3>
                <p className={s.cardBody}>{it.body}</p>
              </article>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
