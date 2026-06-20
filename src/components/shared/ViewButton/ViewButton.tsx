"use client";

import styles from "./ViewButton.module.scss";

interface ViewButtonProps {
  onClick?: () => void;
  className?: string;
}

export default function ViewButton({ onClick, className = "" }: ViewButtonProps) {
  return (
    <button
      className={`${styles.viewBtn} ${className}`}
      onClick={onClick}
      type="button"
    >
      <span
        className={styles.viewIcon}
        style={{
          maskImage: `url('/images/dashboard/view.svg')`,
          WebkitMaskImage: `url('/images/dashboard/view.svg')`,
        }}
        aria-hidden
      />
      View
    </button>
  );
}
