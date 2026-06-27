import type { CSSProperties, ReactNode, ElementType } from "react";

type Color = "accent" | "muted" | "inverse" | (string & {});

/** Aethel Labs — Eyebrow. Tracked uppercase mono kicker above section headings. */
export function Eyebrow({
  children,
  as: Tag = "p",
  color = "accent",
  style,
}: {
  children: ReactNode;
  as?: ElementType;
  color?: Color;
  style?: CSSProperties;
}) {
  const colorVar =
    color === "accent" ? "var(--text-accent)"
    : color === "muted" ? "var(--text-muted)"
    : color === "inverse" ? "var(--ember-400)"
    : color;
  return (
    <Tag
      style={{
        margin: 0,
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-xs)",
        fontWeight: "var(--weight-medium)",
        textTransform: "uppercase",
        letterSpacing: "var(--tracking-eyebrow)",
        color: colorVar,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
