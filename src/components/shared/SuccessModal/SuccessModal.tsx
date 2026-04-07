"use client";
import Image from "next/image";
import styles from "./SuccessModal.module.scss";

export interface SuccessModalProps {
  title?: string;
  message?: string;
  buttonText?: string;
  onClose: () => void;
  primaryButtonText?: string;
  onPrimaryClick?: () => void;
  children?: React.ReactNode;
}

export default function SuccessModal({
  title = "Message Sent Successfully",
  message = "Thank you for contacting us. Our team will review your message and get back to you as soon as possible.",
  buttonText = "Back to Home",
  onClose,
  primaryButtonText,
  onPrimaryClick,
  children,
}: SuccessModalProps) {
  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.modalIcon} aria-hidden="true">
          <Image
            src="/images/checkmark2.svg"
            alt="Success Checkmark"
            width={48}
            height={48}
            className={styles.modalCheckIcon}
          />
        </div>

        <h2 className={styles.modalTitle}>{title}</h2>
        <p className={styles.modalMessage}>{message}</p>

        {children}

        <div className={styles.modalActions}>
          <button className={styles.modalSecondaryButton} onClick={onClose} type="button">
            {buttonText}
          </button>
          {primaryButtonText && onPrimaryClick && (
            <button className={styles.modalPrimaryButton} onClick={onPrimaryClick} type="button">
              {primaryButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
