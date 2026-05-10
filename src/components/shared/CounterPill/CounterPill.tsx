"use client";

import Image from "next/image";
import styles from "./CounterPill.module.scss";

interface CounterPillProps {
  label?: string;
  subLabel?: string;
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  className?: string;
  /** Renders only the pill without the label row — useful inside custom layouts like room selectors */
  pillOnly?: boolean;
}

export default function CounterPill({
  label,
  subLabel,
  value,
  onIncrease,
  onDecrease,
  min = 0,
  max,
  className = "",
  pillOnly = false,
}: CounterPillProps) {
  const id = label ? `counter-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined;

  const pill = (
    <div className={`${styles.pill} ${pillOnly ? className : ""}`} role="group" aria-labelledby={id}>
      <button
        type="button"
        onClick={onDecrease}
        disabled={value <= min}
        className={`${styles.button} ${styles.minus}`}
        aria-label={`Decrease ${label}`}
      >
        <Image src="/images/minus.svg" alt="" width={20} height={20} />
      </button>

      <span className={styles.value}>{value}</span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={max !== undefined && value >= max}
        className={`${styles.button} ${styles.plus}`}
        aria-label={`Increase ${label}`}
      >
        <Image src="/images/plus.svg" alt="" width={20} height={20} />
      </button>
    </div>
  );

  if (pillOnly) return pill;

  return (
    <div className={`${styles.counterRow} ${className}`}>
      {label && (
        <div className={styles.labelWrapper} id={id}>
          <span className={styles.label}>{label}</span>
          {subLabel && <span className={styles.subLabel}>{subLabel}</span>}
        </div>
      )}
      {pill}
    </div>
  );
}
