import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { ContactForm } from "@/components/ui/ContactForm";
import { Reveal } from "@/components/layout/Reveal";
import { SectionHead } from "./SectionHead";
import s from "./sections.module.css";

export function Contact() {
  const { heading, body, email, socials } = content.contact;
  return (
    <Section id="contact" theme="light">
      <div className={s.contactGrid}>
        <Reveal>
          <div>
            <SectionHead eyebrow="Let's talk" heading={heading} intro={body} />
            <div className={s.contactMeta}>
              <a className={s.contactLink} href={`mailto:${email}`}>{email}</a>
              {socials.map((soc) => (
                <a key={soc.label} className={s.contactLink} href={soc.href}>{soc.label}</a>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}
