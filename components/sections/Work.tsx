import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { Reveal } from "@/components/layout/Reveal";
import { SectionHead } from "./SectionHead";
import { Card, Tag } from "@/components/ui";
import s from "./sections.module.css";

const gradients = [
  ["var(--ember-700)", "var(--ember-500)"],
  ["var(--ink-800)", "var(--ink-600)"],
  ["var(--ember-600)", "var(--ink-800)"],
  ["var(--ink-700)", "var(--ember-700)"],
  ["var(--ember-800)", "var(--ink-900)"],
];

export function Work() {
  return (
    <Section id="work" theme="light">
      <Reveal>
        <div>
          <SectionHead eyebrow="Selected work" heading="A few things worth showing." />
          <div className={s.workGrid}>
            {content.work.map((w, i) => {
              const [from, to] = gradients[i % gradients.length];
              return (
                <Card key={w.name} interactive padding="none">
                  <div className={s.workThumb} style={{ background: `linear-gradient(125deg, ${from}, ${to})` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className={s.workThumbMark} src="/brand/mark-white.svg" alt="" aria-hidden />
                    {w.live ? <span className={s.workLive}><Tag variant="inverse">● Live</Tag></span> : null}
                  </div>
                  <div className={s.workMeta}>
                    <h3 className={s.workName}>{w.name}</h3>
                    <div className={s.workTags}><Tag variant="outline">{w.kind}</Tag></div>
                    <p className={s.cardBody}>{w.body}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
