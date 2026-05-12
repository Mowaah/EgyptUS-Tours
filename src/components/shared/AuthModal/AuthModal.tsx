"use client";

import { useState, useEffect } from "react";

import { createPortal } from "react-dom";
import { FormField } from "@/components/shared";
import { validateEmail, validatePassword, validateName } from "@/utils/validation";
import styles from "./AuthModal.module.scss";

export interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export default function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleModeChange = (newMode: "login" | "signup" | "reset") => {
    setMode(newMode);
    setEmail("");
    setPassword("");
    setName("");
    setEmailError("");
    setPasswordError("");
    setShowPassword(false);
  };

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!mounted) return null;

  const handleLogin = () => {
    let isValid = true;
    
    // Validate Email
    const emailValidationMsg = validateEmail(email);
    if (emailValidationMsg) {
      setEmailError(emailValidationMsg);
      isValid = false;
    }
    
    // Validate Password (unless in reset mode where it's hidden)
    if (mode !== "reset") {
      const passwordValidationMsg = validatePassword(password);
      if (passwordValidationMsg) {
        setPasswordError(passwordValidationMsg);
        isValid = false;
      }
    }

    // Validate Name (only if in signup mode)
    if (mode === "signup") {
      const nameValidationMsg = validateName(name);
      // Let's assume you'll add name validation handling later if you want to show it,
      // but for now we just prevent submission if invalid
      if (nameValidationMsg) {
        isValid = false;
        // Optionally: setNameError(nameValidationMsg)
      }
    }
    
    if (!isValid) return;

    // Fake login
    if (onLoginSuccess) {
      onLoginSuccess();
    }
    onClose();
  };

  const content = (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke="#0E2851" strokeWidth="2" strokeMiterlimit="10" />
            <path d="M20 12L12 20" stroke="#0E2851" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 12L20 20" stroke="#0E2851" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <h2 className={styles.title}>
          {mode === "reset" ? "Reset Password" : (
            <>
              {mode === "login" ? "Login" : "Signup"} to <span className={styles.brandText}>Egypt Us</span>
            </>
          )}
        </h2>

        <div className={styles.form}>
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
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5C5 5 2 12 2 12C2 12 5 19 12 19C19 19 22 12 22 12C22 12 19 5 12 5Z" />
                        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" />
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                        <line x1="2" y1="2" x2="22" y2="22"></line>
                      </svg>
                    )}
                  </button>
                </div>
              </FormField>
              {mode === "login" && (
                <div className={styles.forgetPasswordWrapper}>
                  <button className={styles.forgetPassword} type="button" onClick={() => handleModeChange("reset")}>Forget Password ?</button>
                </div>
              )}
            </div>
          )}

          <button className={styles.loginBtn} onClick={handleLogin}>
            {mode === "reset" ? "Reset Password" : mode === "login" ? "Login" : "Signup"}
          </button>
        </div>

        <div className={styles.dividerWrapper}>
          <div className={styles.line} />
          <span className={styles.orText}>Or</span>
          <div className={styles.line} />
        </div>

        <button className={styles.googleBtn}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span>Continue with Google</span>
        </button>

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
