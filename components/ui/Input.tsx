import type { InputHTMLAttributes } from "react";
import { Field, type FieldProps } from "./Field";

type InputProps = FieldProps & InputHTMLAttributes<HTMLInputElement>;

/** Aethel Labs — Input. */
export function Input({ label, hint, error, required, id, ...rest }: InputProps) {
  const control = (
    <input
      id={id}
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
