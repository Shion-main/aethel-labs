import { Section } from "@/components/layout/Section";
import { content } from "@/lib/content";
import { ContactForm } from "@/components/ui/ContactForm";
import { Reveal } from "@/components/layout/Reveal";
import s from "./sections.module.css";

export function Contact() {
  const { heading, body } = content.contact;
  return (
    <Section id="contact">
      <Reveal>
        <div>
          <h2 className={s.headline}>{heading}</h2>
          <p className={s.sub}>{body}</p>
          <ContactForm />
        </div>
      </Reveal>
    </Section>
  );
}
