import type { TextareaHTMLAttributes } from "react";
import { Field, type FieldProps } from "./Field";

type TextareaProps = FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

/** Aethel Labs — Textarea. */
export function Textarea({ label, hint, error, required, id, rows = 4, ...rest }: TextareaProps) {
  const control = (
    <textarea
      id={id}
      rows={rows}
      className={["ae-control", error ? "ae-control--invalid" : ""].filter(Boolean).join(" ")}
      aria-invalid={error ? true : undefined}
      required={required}
      {...rest}
    />
  );
  if (label || hint || error) {
    return <Field label={label} hint={hint} error={error} required={required} htmlFor={id}>{control}</Field>;
  }
  return control;
}
