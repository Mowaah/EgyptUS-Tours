"use client";

import { useState, useEffect, useSyncExternalStore } from "react";

import { createPortal } from "react-dom";
import FormField from "@/components/shared/FormField/FormField";
import PasswordToggleButton from "@/components/shared/PasswordToggleButton/PasswordToggleButton";
import { validateEmail, validatePassword, validateName } from "@/utils/validation";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { loginCustomer, signupCustomer, googleLoginCustomer, resendCustomerEmailVerification } from "@/lib/api";
import styles from "./AuthModal.module.scss";

export interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export default function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const mounted = useSyncExternalStore(
    subscribeToClientMount,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("");
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleModeChange = (newMode: "login" | "signup" | "reset") => {
    setMode(newMode);
    setEmail("");
    setPassword("");
    setName("");
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
      setGlobalSuccess("A new verification link has been sent to your email!");
      setUnverifiedEmail("");
    } catch (err: any) {
      setGlobalError("Failed to resend verification email. Please try again.");
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
          login(res.access, res.refresh, res.customer);
          if (onLoginSuccess) onLoginSuccess();
          onClose();
        }
      } else if (mode === "signup") {
        await signupCustomer({ email, password, full_name: name });
        setMode("login");
        setGlobalSuccess("Account created successfully. Please check your email to verify your address before logging in.");
        setPassword("");
      } else if (mode === "reset") {
        // TODO: Password reset API
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        setGlobalError(err.response.data.detail);
        if (err.response.data.code === 'email_unverified') {
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
        login(res.access, res.refresh, res.customer);
        if (onLoginSuccess) onLoginSuccess();
        onClose();
      }
    } catch (err: any) {
      setGlobalError(err?.response?.data?.detail || "Google sign-in failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {mode === "reset" ? "Reset Password" : (
              <>
                {mode === "login" ? "Login" : "Signup"} to <span className={styles.brandText}>Egypt Us</span>
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
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ color: "var(--red-error)", fontSize: "14px", textAlign: "center" }}>{globalError}</div>
              {unverifiedEmail && (
                <button 
                  onClick={handleResend}
                  disabled={isSubmitting}
                  style={{ marginTop: "8px", background: "none", border: "none", color: "var(--primary-color)", fontWeight: "600", cursor: "pointer", fontSize: "14px", textDecoration: "underline" }}
                >
                  {isSubmitting ? "Sending..." : "Resend Verification Link"}
                </button>
              )}
            </div>
          )}
          {globalSuccess && <div style={{ color: "var(--green-success)", fontSize: "14px", marginBottom: "12px", textAlign: "center" }}>{globalSuccess}</div>}
          {mode === "signup" && (
            <FormField
              label="Full name"
              type="text"
              className={styles.modalInput}
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <FormField
            label="E-mail"
            type="email"
            className={`${styles.modalInput} ${emailError ? styles.hasError : ""}`}
            placeholder="Example@Gmail.Com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
            error={emailError}
          />

          {mode !== "reset" && (
            <div className={styles.passwordFieldWrapper}>
              <FormField label="Password" error={passwordError}>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`${styles.modalInput} ${passwordError ? styles.hasError : ""}`}
                    placeholder="************"
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
                  <button className={styles.forgetPassword} type="button" onClick={() => handleModeChange("reset")}>Forget Password ?</button>
                </div>
              )}
            </div>
          )}

          <button className={styles.loginBtn} onClick={handleLogin} disabled={isSubmitting}>
            {isSubmitting ? "Please wait..." : mode === "reset" ? "Reset Password" : mode === "login" ? "Login" : "Signup"}
          </button>

          {mode !== "reset" && (
            <>
              <div className={styles.dividerWrapper}>
                <div className={styles.line} />
                <span className={styles.orText}>OR</span>
                <div className={styles.line} />
              </div>
              <div className={styles.googleBtnContainer}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    setGlobalError("Google sign-in failed. Please try again.");
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
              <span className={styles.footerText}>Already have an Account ?</span>
              <button className={styles.signupLink} type="button" onClick={() => handleModeChange("login")}>Login</button>
            </>
          ) : mode === "reset" ? (
            <>
              <span className={styles.footerText}>Don’t have an Account ?</span>
              <button className={styles.signupLink} type="button" onClick={() => handleModeChange("signup")}>Sign-up</button>
            </>
          ) : (
            <>
              <span className={styles.footerText}>Don’t have an Account ?</span>
              <button className={styles.signupLink} type="button" onClick={() => handleModeChange("signup")}>Sign-up</button>
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
