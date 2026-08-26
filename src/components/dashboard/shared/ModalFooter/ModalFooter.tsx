"use client";

import styles from "./ModalFooter.module.scss";

interface ModalFooterProps {
  secondaryLabel: React.ReactNode;
  secondaryOnClick: () => void;
  primaryLabel: React.ReactNode;
  primaryOnClick: () => void;
  primaryDisabled?: boolean;
  secondaryDisabled?: boolean;
  isDanger?: boolean;
  primaryIsLoading?: boolean;
  hidePrimaryButton?: boolean;
}

export default function ModalFooter({
  secondaryLabel,
  secondaryOnClick,
  primaryLabel,
  primaryOnClick,
  primaryDisabled = false,
  secondaryDisabled = false,
  isDanger = false,
  primaryIsLoading = false,
  hidePrimaryButton = false,
}: ModalFooterProps) {
  return (
    <footer className={styles.footer}>
      <button
        type="button"
        className={styles.secondaryBtn}
        onClick={secondaryOnClick}
        disabled={secondaryDisabled}
      >
        {secondaryLabel}
      </button>
      {!hidePrimaryButton && (
        <button
          type="button"
          className={`${styles.primaryBtn} ${isDanger ? styles.dangerBtn : ""}`}
          onClick={primaryOnClick}
          disabled={primaryDisabled || primaryIsLoading}
          aria-busy={primaryIsLoading}
        >
          {primaryIsLoading ? (
            <span className={styles.spinner} aria-hidden />
          ) : (
            primaryLabel
          )}
        </button>
      )}
    </footer>
  );
}
