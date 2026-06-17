import React, { InputHTMLAttributes, forwardRef } from "react";
import styles from "./FormFields.module.scss";

interface ToggleFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

export const ToggleField = forwardRef<HTMLInputElement, ToggleFieldProps>(
  ({ label, description, className = "", ...props }, ref) => {
    return (
      <div className={`${styles.toggleField} ${className}`}>
        <div className={styles.toggleHeader}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span className={styles.toggleLabel}>{label}</span>
            {description && <span className={styles.toggleDescription}>{description}</span>}
          </div>
          <label className={styles.switch}>
            <input type="checkbox" ref={ref} {...props} />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    );
  }
);
ToggleField.displayName = "ToggleField";
