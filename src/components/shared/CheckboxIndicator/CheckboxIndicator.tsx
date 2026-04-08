"use client";

import type { HTMLAttributes } from "react";

import styles from "./CheckboxIndicator.module.scss";

export type CheckboxIndicatorVariant = "radio" | "square";
export type CheckboxIndicatorSize = "sm" | "md";

export interface CheckboxIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  selected: boolean;
  variant: CheckboxIndicatorVariant;
  /** sm = 16px, md = 20px. Ignored when surface is "overlay" (24px square). */
  size?: CheckboxIndicatorSize;
  /** Frosted overlay style for destination cards and similar. */
  surface?: "default" | "overlay";
  /**
   * "filter" — sidebar-style 20px radios (e.g. trips filters): 1px border, soft ring + shadow when selected.
   */
  emphasis?: "default" | "filter";
}

function indicatorClass(
  variant: CheckboxIndicatorVariant,
  size: CheckboxIndicatorSize,
  selected: boolean,
  surface: "default" | "overlay",
  emphasis: "default" | "filter",
): string {
  if (variant === "square" && surface === "overlay") {
    return selected ? styles.squareOverlaySelected : styles.squareOverlayEmpty;
  }
  if (variant === "radio") {
    if (size === "md") {
      if (emphasis === "filter") {
        return selected ? styles.radioMdSelectedFilter : styles.radioMdEmptyFilter;
      }
      return selected ? styles.radioMdSelected : styles.radioMdEmpty;
    }
    return selected ? styles.radioSmSelected : styles.radioSmEmpty;
  }
  if (size === "md") {
    return selected ? styles.squareMdSelected : styles.squareMdEmpty;
  }
  return selected ? styles.squareSmSelected : styles.squareSmEmpty;
}

export default function CheckboxIndicator({
  selected,
  variant,
  size = "sm",
  surface = "default",
  emphasis = "default",
  className,
  ...rest
}: CheckboxIndicatorProps) {
  return (
    <span
      className={`${styles.root} ${indicatorClass(variant, size, selected, surface, emphasis)}${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
}
