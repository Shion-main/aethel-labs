"use client";
import { useProgress } from "@/components/scroll/ProgressContext";
import { ScrollTrigger } from "@/lib/gsap";
import { sectionOrder, type SectionId } from "@/lib/moods";
import styles from "./SideNav.module.css";

const LABELS: Record<SectionId, string> = {
  hero: "Home",
  pitch: "Ethos",
  services: "Services",
  frame: "Approach",
  work: "Work",
  process: "Process",
  packages: "Pricing",
  about: "About",
  contact: "Contact",
  footer: "Aethel",
};

export function SideNav() {
  const progress = useProgress();
  const count = sectionOrder.length;
  const active = Math.min(count - 1, Math.max(0, Math.round(progress * (count - 1))));

  function goTo(index: number) {
    const id = sectionOrder[index];
    const pinned = ScrollTrigger.getAll().find((t) => t.pin);
    if (pinned) {
      const ratio = index / (count - 1);
      const y = pinned.start + (pinned.end - pinned.start) * ratio;
      window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <nav className={styles.sidebar} aria-label="Section navigation">
      <button className={styles.home} onClick={() => goTo(0)} aria-label="Back to top">
        <span className={styles.glyph}>Æ</span>
      </button>

      <div className={styles.labelWrap} aria-hidden>
        <span key={active} className={styles.label}>{LABELS[sectionOrder[active]]}</span>
      </div>

      <ul className={styles.dots}>
        {sectionOrder.map((id, i) => (
          <li key={id}>
            <button
              className={`${styles.dot} ${i === active ? styles.active : ""}`}
              onClick={() => goTo(i)}
              aria-label={LABELS[id]}
              aria-current={i === active ? "true" : undefined}
            >
              <span className={styles.dotLabel}>{LABELS[id]}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
