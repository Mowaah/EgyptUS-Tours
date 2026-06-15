import React, { ReactNode } from "react";
import styles from "./FormFields.module.scss";

interface FormSpecProps {
  children: ReactNode;
  className?: string;
}

export function FormSpec({ children, className = "" }: FormSpecProps) {
  return (
    <div className={`${styles.specItem} ${className}`}>
      {children}
    </div>
  );
}
