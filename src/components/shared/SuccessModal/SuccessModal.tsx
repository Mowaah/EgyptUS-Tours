"use client";
import { useEffect } from "react";
import Image from "next/image";
import styles from "./SuccessModal.module.scss";

export interface SuccessModalProps {
  title?: string;
  message?: string;
  buttonText?: string;
  hideSecondaryButton?: boolean;
  onClose: () => void;
  primaryButtonText?: string;
  onPrimaryClick?: () => void;
  metadata?: { label: string; value: string; valueColor?: string }[];
  children?: React.ReactNode;
}

export default function SuccessModal({
  title = "Message Sent Successfully",
  message = "Thank you for contacting us. Our team will review your message and get back to you as soon as possible.",
  buttonText = "Back to Home",
  hideSecondaryButton = false,
  onClose,
  primaryButtonText,
  onPrimaryClick,
  metadata,
  children,
}: SuccessModalProps) {
  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = "hidden";
    
    // Unlock scroll on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

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

        {metadata && metadata.length > 0 && (
          <div className={styles.metaGrid}>
            {metadata.map((item) => (
              <div key={item.label} className={styles.metaCol}>
                <span className={styles.metaLabel}>{item.label}</span>
                <strong
                  className={styles.metaValue}
                  style={item.valueColor ? { color: item.valueColor } : undefined}
                >
                  {item.value}
                </strong>
              </div>
            ))}
          </div>
        )}

        {children}

        <div className={styles.modalActions}>
          {!hideSecondaryButton && (
            <button className={styles.modalSecondaryButton} onClick={onClose} type="button">
              {buttonText}
            </button>
          )}
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
