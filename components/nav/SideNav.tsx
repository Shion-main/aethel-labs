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
        <svg className={styles.glyph} viewBox="0 0 5122 5122" aria-hidden focusable="false">
          <path d="M2775.07 2746.5L2977.68 2401.5L3339 2605.95L2775.07 2746.5Z" fill="currentColor" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3307 1266H565V1678H896.573L2234.5 2444L2437.64 2092L1720.57 1678H2775.07L1523 3846.64H1998.74L1999.07 3846.06L2802.3 3855.86L2234.5 3522L3307 1691.5L3818.5 1987.86H4557.3L3307 1266Z"
            fill="currentColor"
          />
        </svg>
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
