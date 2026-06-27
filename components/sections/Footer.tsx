import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { Mark } from "@/components/brand/Mark";
import s from "./sections.module.css";

export function Footer() {
  return (
    <Section id="footer">
      <div className={s.footerWrap}>
        <div className={s.footerTop}>
          <div style={{ maxWidth: 320 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Mark variant="glyph" />
              <span style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--paper)" }}>Aethel Labs</span>
            </div>
            <p className={s.footerTag}>{content.footer.tagline}</p>
          </div>
          <div className={s.footCols}>
            <div>
              <div className={s.footColTitle}>Studio</div>
              <ul className={s.footList}>
                {content.nav.links.map((l) => (
                  <li key={l.label}><a href={l.href}>{l.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className={s.footColTitle}>Elsewhere</div>
              <ul className={s.footList}>
                {content.contact.socials.map((soc) => (
                  <li key={soc.label}><a href={soc.href}>{soc.label}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className={s.footerBottom}>
          <span>{content.footer.copyright}</span>
          <span>æþel — noble, of worth</span>
        </div>
      </div>
    </Section>
  );
}
