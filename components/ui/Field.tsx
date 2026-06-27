import type { ReactNode } from "react";

export interface FieldProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
}

/** Shared label/hint/error wrapper for Input / Select / Textarea. */
export function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
}: FieldProps & { htmlFor?: string; children: ReactNode }) {
  return (
    <div className="ae-field">
      {label ? (
        <label className="ae-field__label" htmlFor={htmlFor}>
          {label}{required ? <span className="ae-field__req">*</span> : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <span className="ae-field__hint ae-field__hint--error">{error}</span>
      ) : hint ? (
        <span className="ae-field__hint">{hint}</span>
      ) : null}
    </div>
  );
}
