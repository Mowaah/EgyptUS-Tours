"use client";

import React from "react";
import styles from "./LoadingSpinner.module.scss";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "fullPage" | "inline";
  label?: string;
  className?: string;
}

export default function LoadingSpinner({
  size = "md",
  variant = "default",
  label = "Loading...",
  className = "",
}: LoadingSpinnerProps) {
  const containerClasses = [
    styles.wrapper,
    variant === "fullPage" ? styles.fullPage : "",
    variant === "inline" ? styles.inline : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses} role="status" aria-label="Loading">
      <div className={styles.spinnerContainer}>
        <div className={`${styles.spinnerRing} ${styles[size]}`} />
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
