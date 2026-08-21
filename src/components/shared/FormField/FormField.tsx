import React, { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import Image from "next/image";
import styles from "./FormField.module.scss";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isTextarea?: boolean;
  isSelect?: boolean;
  error?: string;
  // allowing override styles, for example adding icons
  wrapperClassName?: string;
  rows?: number;
  children?: React.ReactNode;
}

export default function FormField({
  label,
  isTextarea,
  isSelect,
  error,
  className,
  wrapperClassName,
  children,
  ...props
}: FormFieldProps) {
  const isInvalid = !!error;

  return (
    <div className={`${styles.field} ${wrapperClassName || ""}`}>
      {label && (
        <label className={styles.fieldLabel} htmlFor={props.id}>
          {label}
          {props.required && <span className={styles.required}>*</span>}
        </label>
      )}

      {isTextarea ? (
        <textarea
          className={`${styles.input} ${styles.textarea} ${
            isInvalid ? styles.inputInvalid : ""
          } ${className || ""}`}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : isSelect ? (
        <select
          className={`${styles.input} ${isInvalid ? styles.inputInvalid : ""} ${
            className || ""
          }`}
          {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {children}
        </select>
      ) : children ? (
        children
      ) : (
        <input
          className={`${styles.input} ${isInvalid ? styles.inputInvalid : ""} ${
            className || ""
          }`}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {isInvalid && (
        <div className={styles.errorMessage}>
          <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
