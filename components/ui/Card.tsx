import type { HTMLAttributes, ReactNode } from "react";

type Variant = "default" | "outline" | "sunken" | "inverse";
type Padding = "sm" | "md" | "lg" | "none";

interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  variant?: Variant;
  interactive?: boolean;
  padding?: Padding;
  href?: string;
}

/** Aethel Labs — Card. Sharp by default; optional hover lift + ember edge. */
export function Card({
  children,
  variant = "default",
  interactive = false,
  padding = "lg",
  href,
  className,
  ...rest
}: CardProps) {
  const cls = [
    "ae-card",
    `ae-card--${variant}`,
    `ae-card--pad-${padding}`,
    interactive || href ? "ae-card--interactive" : "",
    className ?? "",
  ].filter(Boolean).join(" ");

  if (href) {
    return <a className={cls} href={href} {...(rest as object)}>{children}</a>;
  }
  return <div className={cls} {...rest}>{children}</div>;
}
