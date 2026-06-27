import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { Reveal } from "@/components/layout/Reveal";
import { SectionHead } from "./SectionHead";
import { Card, Tag } from "@/components/ui";
import s from "./sections.module.css";

export function Services() {
  const { eyebrow, heading, items } = content.services;
  return (
    <Section id="services" theme="light">
      <Reveal>
        <div>
          <SectionHead eyebrow={eyebrow} heading={heading} />
          <div className={s.serviceGrid}>
            {items.map((it, i) => (
              <Card key={it.title} interactive padding="lg">
                <div className={s.cardHead}>
                  <span className={s.cardNum}>{String(i + 1).padStart(2, "0")}</span>
                  {it.tag ? <Tag>{it.tag}</Tag> : null}
                </div>
                <h3 className={s.cardTitle}>{it.title}</h3>
                <p className={s.cardBody}>{it.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
