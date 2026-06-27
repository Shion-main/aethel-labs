import { Section } from "@/components/layout/Section";
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
            <h2 className={s.statement}>
              Most businesses get half: a designer who can&apos;t build, or a developer with no eye.{" "}
              <span className={s.accent}>Aethel is both</span> — design and build under one roof,
              from the first idea to the thing that ships.
            </h2>
          </Reveal>
        </ZoomIn>
      </EthosPanel>
    </Section>
  );
}
