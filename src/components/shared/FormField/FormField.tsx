"use client";

import React, { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
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
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1ZM6.5 8.5H5.5V5.5H6.5V8.5ZM6.5 4.5H5.5V3.5H6.5V4.5Z"
              fill="#D32F2F"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
