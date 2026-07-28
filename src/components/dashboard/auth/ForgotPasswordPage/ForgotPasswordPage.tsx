"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { DashboardField } from "@/components/dashboard/shared";;
import { validateEmail } from "@/utils/validation";
import AuthBackLink from "../AuthBackLink/AuthBackLink";
import AuthSubmitButton from "../AuthSubmitButton/AuthSubmitButton";
import DashboardAuthLayout from "../DashboardAuthLayout/DashboardAuthLayout";
import styles from "./ForgotPasswordPage.module.scss";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = email.trim() !== "" && !validateEmail(email);

  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailMsg = validateEmail(email);
    setEmailError(emailMsg ?? "");

    if (emailMsg) return;

    setIsSubmitting(true);
    setSuccessMessage("");
    
    try {
      const { forgotAdminPassword } = await import("@/lib/adminApi");
      const res = await forgotAdminPassword({ email });
      setSuccessMessage(res.detail || "A reset link has been sent to your email.");
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setEmailError(err.response.data.detail);
      } else {
        setEmailError("We couldn't process your request at this time.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardAuthLayout compactTop>
      <AuthBackLink href="/dashboard/login" />

      <div className={styles.content}>
        <header className={styles.welcome}>
          <h1 className={styles.title}>Forgot Your Password?</h1>
          <p className={styles.subtitle}>
            Enter your email or phone number to find your account and reset
            password.
          </p>
        </header>

        {successMessage ? (
          <div className={styles.form} style={{ textAlign: "center" }}>
            <div style={{ color: "#039855", marginBottom: "24px", padding: "16px", backgroundColor: "#ECFDF3", borderRadius: "8px" }}>
              {successMessage}
            </div>
            <AuthSubmitButton type="button" onClick={() => router.push("/dashboard/login")}>
              Return to Login
            </AuthSubmitButton>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <DashboardField
              id="forgot-password-email"
              label="E-mail"
              type="email"
              autoComplete="email"
              placeholder="Example@Gmail.Com"
              value={email}
              error={emailError}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
            />

            <AuthSubmitButton
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Send Reset Link
            </AuthSubmitButton>
          </form>
        )}
      </div>
    </DashboardAuthLayout>
  );
}
