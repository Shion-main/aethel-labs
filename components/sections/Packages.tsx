import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { Reveal } from "@/components/layout/Reveal";
import { SectionHead } from "./SectionHead";
import { Card, Tag, Button } from "@/components/ui";
import s from "./sections.module.css";

function Check() {
  return (
    <svg className={s.pkgCheck} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 8.5l3.2 3.2L13 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Packages() {
  return (
    <Section id="packages" theme="light">
      <Reveal>
        <div>
          <SectionHead
            eyebrow="Packages"
            heading="Clear pricing. No surprises."
            intro="Fixed scope, fixed price. You know what you're getting and what it costs before we start."
          />
          <div className={s.pkgGrid}>
            {content.packages.map((p) => (
              <Card key={p.name} padding="lg" variant={p.featured ? "inverse" : "default"} className={s.pkg}>
                <div className={s.pkgHead}>
                  <h3 className={s.pkgName} style={p.featured ? { color: "var(--paper)" } : undefined}>{p.name}</h3>
                  {p.featured ? <Tag variant="soft">Popular</Tag> : null}
                </div>
                <p className={s.pkgWhat} style={p.featured ? { color: "var(--ink-200)" } : undefined}>{p.what}</p>
                <div className={s.pkgPriceRow}>
                  <span className={s.pkgFrom}>from</span>
                  <span className={s.pkgPrice} style={{ color: p.featured ? "var(--ember-400)" : "var(--text-strong)" }}>{p.price}</span>
                  {p.unit ? <span className={s.pkgUnit}>{p.unit}</span> : null}
                </div>
                <ul className={s.pkgFeat}>
                  {p.features.map((f) => (
                    <li key={f} className={s.pkgFeatItem} style={p.featured ? { color: "var(--ink-200)" } : undefined}>
                      <Check />{f}
                    </li>
                  ))}
                </ul>
                <div className={s.pkgCta}>
                  <Button variant={p.featured ? "inverse" : "secondary"} fullWidth href="#contact">Get a quote</Button>
                </div>
              </Card>
            ))}
          </div>
          <p className={s.pkgNote}>Indicative ranges. Final quote depends on scope — confirmed before any work begins.</p>
        </div>
      </Reveal>
    </Section>
  );
}
