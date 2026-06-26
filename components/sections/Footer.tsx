import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { Mark } from "@/components/brand/Mark";
import s from "./sections.module.css";

export function Footer() {
  return (
    <Section id="footer">
      <div className={s.footer}>
        <div>
          <Mark variant="glyph" />
          <p className={s.cardBody} style={{ marginTop: 12 }}>{content.footer.tagline}</p>
        </div>
        <p className={s.cardBody}>{content.footer.copyright}</p>
      </div>
    </Section>
  );
}
