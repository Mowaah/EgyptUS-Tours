"use client";

import Image from "next/image";
import styles from "./SortButton.module.scss";

interface SortOption {
  value: string;
  label: string;
}

interface SortButtonProps {
  options: SortOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** When false, hides the "Sort by:" label (e.g. tight mobile toolbars) */
  showLabel?: boolean;
}

export default function SortButton({
  options,
  defaultValue,
  onChange,
  showLabel = true,
}: SortButtonProps) {
  return (
    <div
      className={[styles.sort, !showLabel && styles.compact].filter(Boolean).join(" ")}
    >
      {showLabel && <span>Sort by:</span>}
      <div className={styles.selectWrapper}>
        <select
          className={styles.select}
          defaultValue={defaultValue || options[0]?.value}
          onChange={(e) => onChange?.(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <Image
          src="/images/arrows/arrow-down2.svg"
          alt=""
          width={12}
          height={7}
          className={styles.arrow}
        />
      </div>
    </div>
  );
}
