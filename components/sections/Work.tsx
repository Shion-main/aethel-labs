import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { Reveal } from "@/components/layout/Reveal";
import s from "./sections.module.css";

export function Work() {
  return (
    <Section id="work" theme="light">
      <Reveal>
        <div>
          <p className={s.eyebrow}>Selected work</p>
          <h2 className={s.headline}>A few things worth showing.</h2>
          <div className={s.workGrid}>
            {content.work.map((w) => (
              <article key={w.name} className={s.card}>
                <h3 className={s.cardTitle}>{w.name} — <em>{w.kind}</em></h3>
                <p className={s.cardBody}>{w.body}</p>
              </article>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
