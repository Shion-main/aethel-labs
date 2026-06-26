import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { Reveal } from "@/components/layout/Reveal";
import s from "./sections.module.css";

export function Packages() {
  return (
    <Section id="packages" theme="light">
      <Reveal>
        <div>
          <p className={s.eyebrow}>Packages</p>
          <h2 className={s.headline}>Clear pricing. No surprises.</h2>
          <table className={s.table}>
            <thead><tr><th scope="col">Package</th><th scope="col">What it is</th><th scope="col">From</th></tr></thead>
            <tbody>
              {content.packages.map((p) => (
                <tr key={p.name}><td><strong>{p.name}</strong></td><td>{p.what}</td><td>{p.price}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </Section>
  );
}
