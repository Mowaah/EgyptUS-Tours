"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PasswordToggleButton } from "@/components/shared";
import { DashboardField } from "@/components/dashboard/shared";;
import { validateEmail, validatePassword } from "@/utils/validation";
import AuthSubmitButton from "../AuthSubmitButton/AuthSubmitButton";
import DashboardAuthLayout from "../DashboardAuthLayout/DashboardAuthLayout";
import styles from "./LoginPage.module.scss";

import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { loginAdmin } from "@/lib/adminCoreApi";

export default function LoginPage() {
  const router = useRouter();
  const { loginAdminTokens } = useAdminAuth();
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailMsg = validateEmail(email);
    const passwordMsg = validatePassword(password);
    setEmailError(emailMsg ?? "");
    setPasswordError(passwordMsg ?? "");

    if (emailMsg || passwordMsg) return;

    setIsSubmitting(true);
    try {
      const res = await loginAdmin({ email, password });
      if (res.requires_totp) {
        router.push(`/dashboard/otp-confirmation?action=verify&token=${res.challenge_token}`);
      } else if (res.requires_totp_setup) {
        router.push(`/dashboard/otp-confirmation?action=setup&token=${res.setup_token}`);
      } else if (res.access && res.refresh) {
        // Fallback in case TOTP is completely disabled and JWT is returned immediately
        loginAdminTokens(res.access, res.refresh, res.user);
        router.push("/dashboard");
      }
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setPasswordError(err.response.data.detail);
      } else {
        setPasswordError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
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
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Login
        </AuthSubmitButton>
      </form>
    </DashboardAuthLayout>
  );
}
