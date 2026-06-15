"use client";

import React from "react";
import RichTextEditor from "@/components/shared/RichTextEditor/RichTextEditor";
import styles from "./FormFields.module.scss";

interface RichTextFieldProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  error?: string;
}

export function RichTextField({ label, value = "", onChange, className = "", error }: RichTextFieldProps) {
  return (
    <div className={`${styles.field} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div style={{ width: "100%" }}>
        <RichTextEditor value={value} onChange={onChange} error={error} />
      </div>
    </div>
  );
}
