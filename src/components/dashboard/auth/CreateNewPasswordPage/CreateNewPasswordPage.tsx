"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { DashboardField, PasswordToggleButton } from "@/components/shared";
import { validatePassword } from "@/utils/validation";
import AuthBackLink from "../AuthBackLink/AuthBackLink";
import AuthSubmitButton from "../AuthSubmitButton/AuthSubmitButton";
import DashboardAuthLayout from "../DashboardAuthLayout/DashboardAuthLayout";
import styles from "./CreateNewPasswordPage.module.scss";

export default function CreateNewPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordsMatch =
    confirmPassword.trim() !== "" && password === confirmPassword;
  const isFormValid =
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    !validatePassword(password) &&
    passwordsMatch;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextPasswordError = validatePassword(password);
    const nextConfirmPasswordError = !confirmPassword
      ? "Please confirm your password."
      : password !== confirmPassword
        ? "Passwords do not match."
        : null;

    setPasswordError(nextPasswordError ?? "");
    setConfirmPasswordError(nextConfirmPasswordError ?? "");

    if (nextPasswordError || nextConfirmPasswordError) return;

    setIsSubmitting(true);
    // TODO: wire to password reset API
    router.push("/dashboard/login");
  };

  return (
    <DashboardAuthLayout compactTop>
      <AuthBackLink href="/dashboard/otp-confirmation" />

      <div className={styles.content}>
        <header className={styles.welcome}>
          <h1 className={styles.title}>Create New Password!</h1>
          <p className={styles.subtitle}>
            To update your password, enter the new password twice. Ensure it
            meets our security standards.
          </p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.fields}>
            <DashboardField
              id="new-password"
              label={
                <>
                  New Password <span className={styles.requiredMark}>*</span>
                </>
              }
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="************"
              value={password}
              error={passwordError}
              onChange={(event) => {
                setPassword(event.target.value);
                if (passwordError) setPasswordError("");
                if (confirmPasswordError) setConfirmPasswordError("");
              }}
              endAdornment={
                <PasswordToggleButton
                  isVisible={showPassword}
                  className={styles.eyeBtn}
                  onToggle={() => setShowPassword((value) => !value)}
                />
              }
            />

            <DashboardField
              id="confirm-new-password"
              label={
                <>
                  Confirm New Password{" "}
                  <span className={styles.requiredMark}>*</span>
                </>
              }
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="************"
              value={confirmPassword}
              error={confirmPasswordError}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                if (confirmPasswordError) setConfirmPasswordError("");
              }}
              endAdornment={
                <PasswordToggleButton
                  isVisible={showConfirmPassword}
                  className={styles.eyeBtn}
                  onToggle={() => setShowConfirmPassword((value) => !value)}
                />
              }
            />
          </div>

          <AuthSubmitButton
            type="submit"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            Reset Password
          </AuthSubmitButton>
        </form>
      </div>
    </DashboardAuthLayout>
  );
}
