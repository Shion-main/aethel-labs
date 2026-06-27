import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { Reveal } from "@/components/layout/Reveal";
import { PinBehind } from "./PinBehind";
import s from "./sections.module.css";

export function Services() {
  const { eyebrow, heading, items } = content.services;
  return (
    <Section id="services" theme="light">
      {/* Sits still behind the solid Ethos panel; Ethos slides off to reveal it. */}
      <PinBehind index={2} total={10} start={1 / 9} end={2 / 9}>
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
      </PinBehind>
    </Section>
  );
}
