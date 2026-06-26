import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { Reveal } from "@/components/layout/Reveal";
import { ZoomIn } from "./ZoomIn";
import { EthosPanel } from "./EthosPanel";
import s from "./sections.module.css";

export function Pitch() {
  return (
    <Section id="pitch">
      {/* solid panel that peels away left→right to uncover Services behind it */}
      <EthosPanel start={1 / 9} end={2 / 9}>
        <ZoomIn center={1 / 9}>
          <Reveal>
            <h2 className={s.statement}>{content.pitch}</h2>
          </Reveal>
        </ZoomIn>
      </EthosPanel>
    </Section>
  );
}
