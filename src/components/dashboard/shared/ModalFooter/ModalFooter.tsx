"use client";

import styles from "./ModalFooter.module.scss";

interface ModalFooterProps {
  secondaryLabel: React.ReactNode;
  secondaryOnClick: () => void;
  primaryLabel: React.ReactNode;
  primaryOnClick: () => void;
  primaryDisabled?: boolean;
  isDanger?: boolean;
}

export default function ModalFooter({
  secondaryLabel,
  secondaryOnClick,
  primaryLabel,
  primaryOnClick,
  primaryDisabled = false,
  isDanger = false,
}: ModalFooterProps) {
  return (
    <footer className={styles.footer}>
      <button
        type="button"
        className={styles.secondaryBtn}
        onClick={secondaryOnClick}
      >
        {secondaryLabel}
      </button>
      <button
        type="button"
        className={`${styles.primaryBtn} ${isDanger ? styles.dangerBtn : ""}`}
        onClick={primaryOnClick}
        disabled={primaryDisabled}
      >
        {primaryLabel}
      </button>
    </footer>
  );
}
