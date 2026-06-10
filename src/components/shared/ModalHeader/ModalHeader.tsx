"use client";

import Image from "next/image";
import styles from "./ModalHeader.module.scss";

interface ModalHeaderProps {
  iconSrc: string;
  title: string;
  subtitle?: string;
  onClose: () => void;
  id?: string;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.closeSvg}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export default function ModalHeader({
  iconSrc,
  title,
  subtitle,
  onClose,
  id,
}: ModalHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerIcon} aria-hidden>
        <Image src={iconSrc} alt="" width={20} height={20} />
      </div>
      <div className={styles.headerText}>
        <h2 id={id}>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <button
        type="button"
        className={styles.closeButton}
        aria-label="Close modal"
        onClick={onClose}
      >
        <CloseIcon />
      </button>
    </header>
  );
}
