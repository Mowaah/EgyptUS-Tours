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
  metadata?: { label: string; value: React.ReactNode; valueColor?: string }[];
  children?: React.ReactNode;
  variant?: "success" | "error";
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
  variant = "success",
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
        <div
          className={styles.modalIcon}
          style={variant === "error" ? { background: "#F97066", boxShadow: "0 0 6.3px 0 rgba(249, 112, 102, 0.76)" } : undefined}
          aria-hidden="true"
        >
          {variant === "error" ? (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28 12L12 28M12 12L28 28" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <Image
              src="/images/checkmark2.svg"
              alt="Success Checkmark"
              width={48}
              height={48}
              className={styles.modalCheckIcon}
            />
          )}
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
