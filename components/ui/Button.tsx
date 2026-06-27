import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "link" | "inverse";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  type?: "button" | "submit" | "reset";
  href?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

/** Aethel Labs — Button. Sharp corners, deliberate motion, ember accent. */
export function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  href,
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled = false,
  ...rest
}: ButtonProps) {
  const cls = [
    "ae-btn",
    `ae-btn--${variant}`,
    `ae-btn--${size}`,
    fullWidth ? "ae-btn--block" : "",
  ].filter(Boolean).join(" ");

  const content = (
    <>
      {iconLeft ? <span className="ae-btn__icon" aria-hidden>{iconLeft}</span> : null}
      <span className="ae-btn__label">{children}</span>
      {iconRight ? <span className="ae-btn__icon" aria-hidden>{iconRight}</span> : null}
    </>
  );

  if (href && !disabled) {
    return <a className={cls} href={href} {...(rest as object)}>{content}</a>;
  }
  return (
    <button className={cls} type={type} disabled={disabled} {...rest}>
      {content}
    </button>
  );
}
