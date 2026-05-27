"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import AuthBackLink from "../AuthBackLink/AuthBackLink";
import AuthSubmitButton from "../AuthSubmitButton/AuthSubmitButton";
import DashboardAuthLayout from "../DashboardAuthLayout/DashboardAuthLayout";
import styles from "./OtpConfirmationPage.module.scss";

const OTP_LENGTH = 4;
const RESEND_COOLDOWN_SECONDS = 30;

export default function OtpConfirmationPage() {
  const router = useRouter();
  const [code, setCode] = useState(Array(OTP_LENGTH).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(
    RESEND_COOLDOWN_SECONDS,
  );
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const isFormValid = code.every(Boolean);
  const isResendDisabled = cooldownSeconds > 0;
  const formattedCooldown = `00:${cooldownSeconds.toString().padStart(2, "0")}`;

  useEffect(() => {
    if (cooldownSeconds === 0) return;

    const timer = window.setTimeout(() => {
      setCooldownSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [cooldownSeconds]);

  const handleDigitChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const nextValue = event.target.value.replace(/\D/g, "").slice(-1);
    const nextCode = [...code];
    nextCode[index] = nextValue;
    setCode(nextCode);
    if (hasError) setHasError(false);

    if (nextValue && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    // TODO: wire to OTP verification API
    router.push("/dashboard/create-new-password");
  };

  const handleResend = () => {
    if (isResendDisabled) return;

    // TODO: wire to resend OTP API
    setCooldownSeconds(RESEND_COOLDOWN_SECONDS);
  };

  return (
    <DashboardAuthLayout compactTop>
      <AuthBackLink href="/dashboard/forgot-password" />

      <div className={styles.content}>
        <header className={styles.welcome}>
          <h1 className={styles.title}>OTP Confirmation</h1>
          <p className={styles.subtitle}>
            A 4-digit verification code has been sent to ad@.... It will be
            available within one minute.
          </p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.codeGroup}>
            <label className={styles.codeLabel}>Enter the code you received</label>
            <div className={styles.codeInputs}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(node) => {
                    inputRefs.current[index] = node;
                  }}
                  className={[
                    styles.codeInput,
                    hasError
                      ? styles.codeInputError
                      : digit
                        ? styles.codeInputSuccess
                        : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={digit}
                  onChange={(event) => handleDigitChange(index, event)}
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <AuthSubmitButton
            type="submit"
            disabled={!isFormValid || isSubmitting}
            isLoading={isSubmitting}
          >
            Verify
          </AuthSubmitButton>
        </form>

        <p className={styles.resendText}>
          <span className={styles.resendPrompt}>
            <span>Having trouble receiving the code?</span>
            <strong>{formattedCooldown}</strong>
          </span>
          <button
            type="button"
            disabled={isResendDisabled}
            onClick={handleResend}
          >
            Resend
          </button>
        </p>
      </div>
    </DashboardAuthLayout>
  );
}
