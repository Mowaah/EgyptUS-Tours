"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { resendCustomerEmailVerification } from "@/lib/api";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./EmailVerificationModal.module.scss";

export type EmailVerificationModalState =
  | "verify_email"
  | "expired"
  | "failed"
  | "already_verified";

export interface EmailVerificationModalProps {
  isOpen: boolean;
  state: EmailVerificationModalState;
  email?: string;
  onClose: () => void;
  onBackToSignup?: () => void;
  onGoHome?: () => void;
  onStateChange?: (newState: EmailVerificationModalState) => void;
}

export default function EmailVerificationModal({
  isOpen,
  state: initialModalState,
  email: initialEmail = "",
  onClose,
  onBackToSignup,
  onGoHome,
  onStateChange,
}: EmailVerificationModalProps) {
  const router = useRouter();
  const { t } = useTranslation("common");

  const [modalState, setModalState] = useState<EmailVerificationModalState>(initialModalState);
  const [email, setEmail] = useState<string>(initialEmail);
  const [isResending, setIsResending] = useState(false);
  const [resendFeedback, setResendFeedback] = useState<string | null>(null);
  const [promptEmail, setPromptEmail] = useState(false);

  useEffect(() => {
    setModalState(initialModalState);
  }, [initialModalState]);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    } else if (typeof window !== "undefined") {
      const stored = localStorage.getItem("egyptus_last_signup_email") || "";
      if (stored) setEmail(stored);
    }
  }, [initialEmail]);

  useEffect(() => {
    if (!isOpen) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const changeState = (next: EmailVerificationModalState) => {
    setModalState(next);
    setResendFeedback(null);
    if (onStateChange) onStateChange(next);
  };

  const handleResend = async () => {
    const targetEmail = (email || "").trim();
    if (!targetEmail) {
      setPromptEmail(true);
      return;
    }

    setIsResending(true);
    setResendFeedback(null);

    try {
      await resendCustomerEmailVerification({ email: targetEmail });
      setResendFeedback(t("auth.resendSuccess", "Verification email resent successfully."));
      if (modalState !== "verify_email") {
        changeState("verify_email");
      }
    } catch {
      changeState("failed");
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToSignup = () => {
    onClose();
    if (onBackToSignup) {
      onBackToSignup();
    } else {
      router.push("/?auth_mode=signup");
    }
  };

  const handleGoHome = () => {
    onClose();
    if (onGoHome) {
      onGoHome();
    } else {
      router.push("/");
    }
  };

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
      <div className={styles.modalCard}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label={t("common.close", "Close")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* State 1: Verify Your Email Address (Image 1) */}
        {modalState === "verify_email" && (
          <>
            <div className={`${styles.iconWrapper} ${styles.successIcon}`}>
              <Image
                src="/images/checkmark2.svg"
                alt="Success"
                width={38}
                height={38}
              />
            </div>

            <h2 className={styles.title}>
              {t("auth.verifyEmailTitle", "Verify Your Email Address")}
            </h2>

            <p className={styles.message}>
              {t("auth.verifyEmailStep1", "Open your inbox and click the link to verify your account.")}
              <br />
              {t("auth.verifyEmailStep2", "We've sent a verification email to")}
              <br />
              {email ? (
                <a href={`mailto:${email}`} className={styles.emailLink}>
                  {email}
                </a>
              ) : (
                <span className={styles.emailLink}>your email</span>
              )}
            </p>

            {resendFeedback && (
              <p className={styles.resendFeedback}>{resendFeedback}</p>
            )}

            <div className={styles.resendFooter}>
              <span>{t("auth.didntReceiveEmail", "Didn't receive the email?")}</span>
              <button
                type="button"
                className={styles.resendBtn}
                onClick={handleResend}
                disabled={isResending}
              >
                {isResending
                  ? t("auth.sending", "Sending...")
                  : t("auth.resendEmail", "Resend Email")}
              </button>
            </div>
          </>
        )}

        {/* State 2: Verification Link Expired (Image 2) */}
        {modalState === "expired" && (
          <>
            <div className={`${styles.iconWrapper} ${styles.errorIcon}`}>
              <svg width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28 12L12 28M12 12L28 28" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h2 className={styles.title}>
              {t("auth.linkExpiredTitle", "Verification Link Expired")}
            </h2>

            <p className={styles.message}>
              {t("auth.linkExpiredMsg1", "This verification link is no longer valid.")}
              <br />
              {t("auth.linkExpiredMsg2", "Request a new verification email to continue")}
            </p>

            {promptEmail && !email && (
              <div className={styles.inlineEmailInputWrapper}>
                <input
                  type="email"
                  placeholder={t("auth.enterEmailPlaceholder", "Enter your email")}
                  className={styles.emailInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}

            <div className={styles.actionsTwo}>
              <button
                type="button"
                className={styles.outlineButton}
                onClick={handleBackToSignup}
              >
                {t("auth.backToSignup", "Back to Signup")}
              </button>
              <button
                type="button"
                className={styles.solidButton}
                onClick={handleResend}
                disabled={isResending}
              >
                {isResending
                  ? t("auth.sending", "Sending...")
                  : t("auth.resendVerificationEmail", "Resend Verification Email")}
              </button>
            </div>
          </>
        )}

        {/* State 3: Verification Email Failed (Image 3) */}
        {modalState === "failed" && (
          <>
            <div className={`${styles.iconWrapper} ${styles.errorIcon}`}>
              <svg width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28 12L12 28M12 12L28 28" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h2 className={styles.title}>
              {t("auth.emailFailedTitle", "Verification Email Failed")}
            </h2>

            <p className={styles.message}>
              {t("auth.emailFailedMsg1", "We couldn't send the verification email.")}
              <br />
              {t("auth.emailFailedMsg2", "Please try again")}
            </p>

            {promptEmail && !email && (
              <div className={styles.inlineEmailInputWrapper}>
                <input
                  type="email"
                  placeholder={t("auth.enterEmailPlaceholder", "Enter your email")}
                  className={styles.emailInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}

            <div className={styles.actionsTwo}>
              <button
                type="button"
                className={styles.outlineButton}
                onClick={handleBackToSignup}
              >
                {t("auth.backToSignup", "Back to Signup")}
              </button>
              <button
                type="button"
                className={styles.solidButton}
                onClick={handleResend}
                disabled={isResending}
              >
                {isResending
                  ? t("auth.tryingAgain", "Trying Again...")
                  : t("auth.tryAgain", "Try Again")}
              </button>
            </div>
          </>
        )}

        {/* State 4: Email Already Verified (Image 4) */}
        {modalState === "already_verified" && (
          <>
            <div className={`${styles.iconWrapper} ${styles.successIcon}`}>
              <Image
                src="/images/checkmark2.svg"
                alt="Success"
                width={38}
                height={38}
              />
            </div>

            <h2 className={styles.title}>
              {t("auth.alreadyVerifiedTitle", "Email Already Verified")}
            </h2>

            <p className={styles.message}>
              {t("auth.alreadyVerifiedMsg", "Your email has already been verified.")}
            </p>

            <div className={styles.actionsSingle}>
              <button
                type="button"
                className={styles.fullWidthButton}
                onClick={handleGoHome}
              >
                {t("auth.goToHome", "Go to Home")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
