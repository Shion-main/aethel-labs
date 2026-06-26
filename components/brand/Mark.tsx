import Image from "next/image";
import styles from "./Mark.module.css";

interface MarkProps {
  variant?: "full" | "glyph";
  className?: string;
}

export function Mark({ variant = "full", className }: MarkProps) {
  const src = variant === "full" ? "/brand/logo-full-white.svg" : "/brand/mark-white.svg";
  return (
    <Image
      src={src}
      alt="Aethel Labs"
      width={variant === "full" ? 220 : 40}
      height={variant === "full" ? 84 : 40}
      priority
      className={`${styles.mark} ${className ?? ""}`}
    />
  );
}
