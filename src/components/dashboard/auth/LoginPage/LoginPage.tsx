"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardField, PasswordToggleButton } from "@/components/shared";
import { validateEmail, validatePassword } from "@/utils/validation";
import AuthSubmitButton from "../AuthSubmitButton/AuthSubmitButton";
import DashboardAuthLayout from "../DashboardAuthLayout/DashboardAuthLayout";
import styles from "./LoginPage.module.scss";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid =
    email.trim() !== "" &&
    password.trim() !== "" &&
    !validateEmail(email) &&
    !validatePassword(password);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailMsg = validateEmail(email);
    const passwordMsg = validatePassword(password);
    setEmailError(emailMsg ?? "");
    setPasswordError(passwordMsg ?? "");

    if (emailMsg || passwordMsg) return;

    setIsSubmitting(true);
    // TODO: wire to auth API
    router.push("/dashboard");
  };

  return (
    <DashboardAuthLayout>
      <header className={styles.welcome}>
        <h1 className={styles.title}>Welcome Back to Your Tourism Dashboard</h1>
        <p className={styles.subtitle}>Access and manage your tourism platform</p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.fields}>
          <DashboardField
            id="login-email"
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

          <DashboardField
            id="login-password"
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="************"
            value={password}
            error={passwordError}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError("");
            }}
            endAdornment={
              <PasswordToggleButton
                isVisible={showPassword}
                className={styles.eyeBtn}
                onToggle={() => setShowPassword((value) => !value)}
              />
            }
          />

          <div className={styles.forgotRow}>
            <Link href="/dashboard/forgot-password" className={styles.forgotLink}>
              Forget Password?
            </Link>
          </div>
        </div>

        <AuthSubmitButton
          type="submit"
          disabled={!isFormValid || isSubmitting}
          isLoading={isSubmitting}
        >
          Login
        </AuthSubmitButton>
      </form>
    </DashboardAuthLayout>
  );
}
