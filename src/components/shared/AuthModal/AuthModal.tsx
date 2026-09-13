"use client";

import { useState, useEffect, useSyncExternalStore } from "react";

import { createPortal } from "react-dom";
import FormField from "@/components/shared/FormField/FormField";
import PasswordToggleButton from "@/components/shared/PasswordToggleButton/PasswordToggleButton";
import { validateEmail, validatePassword, validateName } from "@/utils/validation";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { loginCustomer, signupCustomer, googleLoginCustomer, resendCustomerEmailVerification } from "@/lib/api";
import { useTranslation } from "@/hooks/useTranslation";
import {
  getGuestAuthEmail,
  getGuestAuthName,
  clearPendingGuestRecord,
  getPendingGuestRecord,
} from "@/utils/guestBookingAuth";
import EmailVerificationModal, {
  type EmailVerificationModalState,
} from "@/components/shared/EmailVerificationModal/EmailVerificationModal";
import styles from "./AuthModal.module.scss";

export interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess?: () => void;
  initialMode?: "login" | "signup" | "reset";
  initialEmail?: string;
  initialName?: string;
}

export default function AuthModal({
  onClose,
  onLoginSuccess,
  initialMode = "login",
  initialEmail,
  initialName,
}: AuthModalProps) {
  const { t } = useTranslation("common");
  const mounted = useSyncExternalStore(
    subscribeToClientMount,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [mode, setMode] = useState<"login" | "signup" | "reset">(initialMode);
  const pendingRecord = getPendingGuestRecord();
  const defaultEmail = initialEmail || getGuestAuthEmail();
  const defaultName = initialName || getGuestAuthName();

  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("");
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [verificationModalState, setVerificationModalState] = useState<EmailVerificationModalState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleModeChange = (newMode: "login" | "signup" | "reset") => {
    setMode(newMode);
    setPassword("");
    setEmailError("");
    setPasswordError("");
    setGlobalError("");
    setGlobalSuccess("");
    setUnverifiedEmail("");
    setShowPassword(false);
  };

  const handleResend = async () => {
    if (!unverifiedEmail) return;
    setIsSubmitting(true);
    setGlobalError("");
    setGlobalSuccess("");
    try {
      await resendCustomerEmailVerification({ email: unverifiedEmail });
      setGlobalSuccess(t("auth.verificationSent", "A new verification link has been sent to your email!"));
      setUnverifiedEmail("");
    } catch (err: any) {
      setGlobalError(t("auth.resendFailed", "Failed to resend verification email. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!mounted) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mounted]);

  if (!mounted) return null;

  const handleLogin = async () => {
    let isValid = true;

    const emailValidationMsg = validateEmail(email);
    if (emailValidationMsg) {
      setEmailError(emailValidationMsg);
      isValid = false;
    }

    if (mode !== "reset") {
      const passwordValidationMsg = validatePassword(password);
      if (passwordValidationMsg) {
        setPasswordError(passwordValidationMsg);
        isValid = false;
      }
    }

    if (mode === "signup") {
      const nameValidationMsg = validateName(name);
      if (nameValidationMsg) isValid = false;
    }

    if (!isValid) return;

    setIsSubmitting(true);
    setGlobalError("");
    setGlobalSuccess("");

    try {
      if (mode === "login") {
        const res = await loginCustomer({ email, password });
        if (res.access && res.refresh) {
          clearPendingGuestRecord();
          login(res.access, res.refresh, res.customer);
          if (onLoginSuccess) onLoginSuccess();
          onClose();
        }
      } else if (mode === "signup") {
        await signupCustomer({ email, password, full_name: name });
        if (typeof window !== "undefined") {
          localStorage.setItem("egyptus_last_signup_email", email.trim());
        }
        setPassword("");
        setVerificationModalState("verify_email");
      } else if (mode === "reset") {
        // TODO: Password reset API
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        if (err.response.data.code === "email_taken") {
          setMode("login");
          setGlobalError(
            t(
              "auth.emailTakenLoginPrompt",
              "An account with this email already exists. Please log in with your password to link your booking."
            )
          );
        } else {
          setGlobalError(err.response.data.detail);
        }
        if (err.response.data.code === "email_unverified") {
          setUnverifiedEmail(email);
        }
      } else {
        setGlobalError("An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    setIsSubmitting(true);
    setGlobalError("");
    try {
      const res = await googleLoginCustomer(credentialResponse.credential);
      if (res.access && res.refresh) {
        clearPendingGuestRecord();
        login(res.access, res.refresh, res.customer);
        if (onLoginSuccess) onLoginSuccess();
        onClose();
      }
    } catch (err: any) {
      setGlobalError(err?.response?.data?.detail || t("auth.googleSignInFailed", "Google sign-in failed. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verificationModalState) {
    return (
      <EmailVerificationModal
        isOpen={true}
        state={verificationModalState}
        email={email}
        onClose={onClose}
        onStateChange={(next) => setVerificationModalState(next)}
        onBackToSignup={() => {
          setVerificationModalState(null);
          setMode("signup");
        }}
        onGoHome={() => {
          setVerificationModalState(null);
          onClose();
        }}
      />
    );
  }

  const content = (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {mode === "reset" ? (
              t("auth.resetPassword", "Reset Password")
            ) : (
              <>
                {mode === "login" ? t("auth.loginTitle", "Login to") : t("auth.signupTitle", "Signup to")}{" "}
                <span className={styles.brandText}>{t("auth.brandName", "Egypt Us")}</span>
              </>
            )}
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke="#0E2851" strokeWidth="2" strokeMiterlimit="10" />
              <path d="M20 12L12 20" stroke="#0E2851" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 12L20 20" stroke="#0E2851" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className={styles.form}>
          {globalError && (
            <div className={styles.messageContainer}>
              <div className={styles.errorText}>{globalError}</div>
              {unverifiedEmail && (
                <button 
                  type="button"
                  onClick={() => setVerificationModalState("verify_email")}
                  className={styles.resendNoticeBtn}
                >
                  {t("auth.resendVerification", "Resend Verification Link")}
                </button>
              )}
            </div>
          )}
          {globalSuccess && <div className={styles.successText}>{globalSuccess}</div>}
          {mode === "signup" && (
            <FormField
              label={t("auth.fullName", "Full name")}
              type="text"
              className={styles.modalInput}
              placeholder={t("auth.fullNamePlaceholder", "Enter Your Name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          {pendingRecord && pendingRecord.email && email.trim().toLowerCase() === pendingRecord.email.toLowerCase() && (
            <div className={styles.guestLinkHint}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span>{t("auth.guestLinkHint", "Use this email to link your recent booking or request to your account.")}</span>
            </div>
          )}

          <FormField
            label={t("auth.email", "E-mail")}
            type="email"
            className={`${styles.modalInput} ${emailError ? styles.hasError : ""}`}
            placeholder={t("auth.emailPlaceholder", "Example@Gmail.Com")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
            error={emailError}
          />

          {mode !== "reset" && (
            <div className={styles.passwordFieldWrapper}>
              <FormField label={t("auth.password", "Password")} error={passwordError}>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`${styles.modalInput} ${passwordError ? styles.hasError : ""}`}
                    placeholder={t("auth.passwordPlaceholder", "************")}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                  />
                  <PasswordToggleButton
                    isVisible={showPassword}
                    className={styles.eyeBtn}
                    onToggle={() => setShowPassword((value) => !value)}
                    size={24}
                  />
                </div>
              </FormField>
              {mode === "login" && (
                <div className={styles.forgetPasswordWrapper}>
                  <button className={styles.forgetPassword} type="button" onClick={() => handleModeChange("reset")}>{t("auth.forgetPassword", "Forgot Password ?")}</button>
                </div>
              )}
            </div>
          )}

          <button className={styles.loginBtn} onClick={handleLogin} disabled={isSubmitting}>
            {isSubmitting ? t("auth.pleaseWait", "Please wait...") : mode === "reset" ? t("auth.resetPassword", "Reset Password") : mode === "login" ? t("auth.login", "Login") : t("auth.signup", "Signup")}
          </button>

          {mode !== "reset" && (
            <>
              <div className={styles.dividerWrapper}>
                <div className={styles.line} />
                <span className={styles.orText}>{t("auth.or", "OR")}</span>
                <div className={styles.line} />
              </div>
              <div className={styles.googleBtnContainer}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    setGlobalError(t("auth.googleSignInFailed", "Google sign-in failed. Please try again."));
                  }}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  logo_alignment="center"
                  shape="pill"
                  width="400"
                />
              </div>
            </>
          )}
        </div>

        <div className={styles.footer}>
          {mode === "signup" ? (
            <>
              <span className={styles.footerText}>{t("auth.alreadyHaveAccount", "Already have an Account ?")}</span>
              <button className={styles.signupLink} type="button" onClick={() => handleModeChange("login")}>{t("auth.loginLink", "Login")}</button>
            </>
          ) : (
            <>
              <span className={styles.footerText}>{t("auth.dontHaveAccount", "Don’t have an Account ?")}</span>
              <button className={styles.signupLink} type="button" onClick={() => handleModeChange("signup")}>{t("auth.signUpLink", "Sign-up")}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

function subscribeToClientMount() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}
