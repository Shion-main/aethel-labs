import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { Reveal } from "@/components/layout/Reveal";
import { SectionHead } from "./SectionHead";
import s from "./sections.module.css";

export function Process() {
  return (
    <Section id="process" theme="light">
      <Reveal>
        <div>
          <SectionHead eyebrow="How it goes" heading="Four steps, no mystery." />
          <ol className={s.steps}>
            {content.process.map((step) => (
              <li key={step.n} className={s.step}>
                <span className={s.stepNum}>{String(step.n).padStart(2, "0")}</span>
                <h3 className={s.stepTitle}>{step.title}</h3>
                <p className={s.cardBody}>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </Section>
  );
}
