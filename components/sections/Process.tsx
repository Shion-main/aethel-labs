import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { Reveal } from "@/components/layout/Reveal";
import s from "./sections.module.css";

export function Process() {
  return (
    <Section id="process">
      <Reveal>
        <div>
          <p className={s.eyebrow}>How it goes</p>
          <h2 className={s.headline}>Four steps, no mystery.</h2>
          <ol className={s.steps}>
            {content.process.map((step) => (
              <li key={step.n} className={s.card}>
                <div className={s.cardTitle}>{String(step.n).padStart(2, "0")} · {step.title}</div>
                <p className={s.cardBody}>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </Section>
  );
}
