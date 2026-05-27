import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./DashboardField.module.scss";

interface DashboardFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  error?: string;
  endAdornment?: ReactNode;
}

export default function DashboardField({
  label,
  error,
  endAdornment,
  className,
  id,
  ...props
}: DashboardFieldProps) {
  const errorId = error && id ? `${id}-error` : undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.control}>
        <input
          id={id}
          className={`${styles.input} ${error ? styles.inputError : ""} ${
            endAdornment ? styles.hasAdornment : ""
          } ${className || ""}`}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={errorId}
          {...props}
        />
        {endAdornment ? (
          <div className={styles.endAdornment}>{endAdornment}</div>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className={styles.errorText} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
