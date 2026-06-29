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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailMsg = validateEmail(email);
    setEmailError(emailMsg ?? "");

    if (emailMsg) return;

    // Simulate incorrect email
    setEmailError("We couldn't find an account with that email address.");
    return;
    
    // setIsSubmitting(true);
    // router.push("/dashboard/otp-confirmation");
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
            Send OTP
          </AuthSubmitButton>
        </form>
      </div>
    </DashboardAuthLayout>
  );
}
