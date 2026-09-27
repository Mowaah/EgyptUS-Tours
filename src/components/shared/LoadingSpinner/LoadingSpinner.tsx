"use client";

import React from "react";
import styles from "./LoadingSpinner.module.scss";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "fullPage" | "inline";
  color?: "primary" | "white" | "current";
  label?: string;
  className?: string;
}

export default function LoadingSpinner({
  size = "md",
  variant = "default",
  color = "primary",
  label,
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

  const resolvedLabel = label !== undefined ? label : variant === "inline" ? "" : "Loading...";
  const Tag = variant === "inline" ? "span" : "div";

  return (
    <Tag className={containerClasses} role="status" aria-label="Loading">
      <span className={styles.spinnerContainer}>
        <span
          className={[
            styles.spinnerRing,
            styles[size],
            color !== "primary" ? styles[color] : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      </span>
      {resolvedLabel && <span className={styles.label}>{resolvedLabel}</span>}
    </Tag>
  );
}
