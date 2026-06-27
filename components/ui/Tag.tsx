import type { CSSProperties, ReactNode } from "react";

type Variant = "soft" | "outline" | "solid" | "inverse";

const variants: Record<Variant, CSSProperties> = {
  soft:    { background: "var(--accent-soft)", color: "var(--text-accent)", border: "1px solid transparent" },
  outline: { background: "transparent", color: "var(--text-body)", border: "1px solid var(--border-default)" },
  solid:   { background: "var(--ink-950)", color: "var(--paper)", border: "1px solid var(--ink-950)" },
  inverse: { background: "rgba(255,255,255,0.08)", color: "var(--paper)", border: "1px solid var(--border-inverse)" },
};

/** Aethel Labs — Tag. Small categorical label (work categories, filters). */
export function Tag({ children, variant = "soft", style }: { children: ReactNode; variant?: Variant; style?: CSSProperties }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.45em",
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-2xs)",
        fontWeight: "var(--weight-medium)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        lineHeight: 1,
        padding: "0.5em 0.85em",
        borderRadius: "var(--radius-pill)",
        whiteSpace: "nowrap",
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}
