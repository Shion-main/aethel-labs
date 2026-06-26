import type { ReactNode } from "react";
import type { SectionId } from "@/lib/moods";
import styles from "./Section.module.css";

interface SectionProps {
  id: SectionId;
  children: ReactNode;
  /** 'light' sections (work, packages) flip text to ink on ivory. */
  theme?: "dark" | "light";
  /** horizontal panel width in viewport widths once horizontal mode is on (Phase 2). */
  vw?: number;
}

export function Section({ id, children, theme = "dark" }: SectionProps) {
  return (
    <section
      id={id}
      data-section={id}
      className={`${styles.section} ${theme === "light" ? styles.light : ""}`}
    >
      <div className={styles.inner}>{children}</div>
    </section>
  );
}
