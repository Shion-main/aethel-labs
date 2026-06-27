import type { SelectHTMLAttributes, ReactNode } from "react";
import { Field, type FieldProps } from "./Field";

type Option = string | { value: string; label: string };

type SelectProps = FieldProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    options?: Option[];
    children?: ReactNode;
  };

/** Aethel Labs — Select. Native select with a brand chevron. */
export function Select({ label, hint, error, required, id, options, children, ...rest }: SelectProps) {
  const control = (
    <span className="ae-select-wrap">
      <select
        id={id}
        className={["ae-control", error ? "ae-control--invalid" : ""].filter(Boolean).join(" ")}
        aria-invalid={error ? true : undefined}
        required={required}
        {...rest}
      >
        {options
          ? options.map((o) => {
              const value = typeof o === "string" ? o : o.value;
              const lbl = typeof o === "string" ? o : o.label;
              return <option key={value} value={value}>{lbl}</option>;
            })
          : children}
      </select>
      <svg className="ae-select-wrap__chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
  if (label || hint || error) {
    return <Field label={label} hint={hint} error={error} required={required} htmlFor={id}>{control}</Field>;
  }
  return control;
}
