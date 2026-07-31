"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import AuthBackLink from "../AuthBackLink/AuthBackLink";
import AuthSubmitButton from "../AuthSubmitButton/AuthSubmitButton";
import DashboardAuthLayout from "../DashboardAuthLayout/DashboardAuthLayout";
import styles from "./OtpConfirmationPage.module.scss";

import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { verifyAdminTotp, enrollAdminTotp, confirmAdminTotp } from "@/lib/adminCoreApi";

const OTP_LENGTH = 6;

export default function OtpConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const action = searchParams.get("action"); // 'setup' | 'verify'
  const token = searchParams.get("token");

  const { loginAdminTokens } = useAdminAuth();

  const [code, setCode] = useState(Array(OTP_LENGTH).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [qrCodeData, setQrCodeData] = useState<{ otpauth_url: string; secret: string } | null>(null);

  const isFormValid = code.every(Boolean);

  useEffect(() => {
    if (!action || !token) {
      router.replace("/dashboard/login");
      return;
    }

    if (action === "setup" && !qrCodeData) {
      enrollAdminTotp({ setup_token: token })
        .then((res) => {
          setQrCodeData(res);
        })
        .catch((err) => {
          console.error("Failed to fetch TOTP enrollment", err);
          setErrorMsg("Failed to start setup. Please login again.");
        });
    }
  }, [action, token, router, qrCodeData]);

  const handleDigitChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const nextValue = event.target.value.replace(/\D/g, "").slice(-1);
    const nextCode = [...code];
    nextCode[index] = nextValue;
    setCode(nextCode);
    if (hasError) {
      setHasError(false);
      setErrorMsg("");
    }

    if (nextValue && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (nextCode.every(Boolean)) {
      submitOtp(nextCode.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submitOtp = async (totpCode: string) => {
    setIsSubmitting(true);
    setHasError(false);
    setErrorMsg("");

    try {
      if (action === "setup") {
        const res = await confirmAdminTotp({ setup_token: token as string, code: totpCode });
        loginAdminTokens(res.access, res.refresh, res.user);
        router.push("/dashboard");
      } else if (action === "verify") {
        const res = await verifyAdminTotp({ challenge_token: token as string, code: totpCode });
        loginAdminTokens(res.access, res.refresh, res.user);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setHasError(true);
      if (err.response?.data?.detail) {
        setErrorMsg(err.response.data.detail);
      } else {
        setErrorMsg("Wrong OTP code.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid) {
      setHasError(true);
      setErrorMsg("Please enter the complete 6-digit code.");
      return;
    }
    
    await submitOtp(code.join(""));
  };

  return (
    <DashboardAuthLayout compactTop>
      <AuthBackLink href="/dashboard/login" />

      <div className={styles.content}>
        <header className={styles.welcome}>
          <h1 className={styles.title}>
            {action === "setup" ? "Set up Two-Factor Auth" : "Two-Factor Verification"}
          </h1>
          <p className={styles.subtitle}>
            {action === "setup"
              ? "Scan the QR code with your Authenticator app (like Google Authenticator), then enter the 6-digit code below."
              : "Open your Authenticator app and enter the 6-digit verification code below."}
          </p>
        </header>

        {action === "setup" && qrCodeData && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "32px" }}>
            <div style={{ background: "white", padding: "16px", borderRadius: "8px", border: "1px solid #EAECF0" }}>
              <QRCodeSVG value={qrCodeData.otpauth_url} size={150} />
            </div>
            <p style={{ marginTop: "16px", fontSize: "14px", color: "#667085" }}>
              Manual setup secret: <strong style={{ color: "#1D2939" }}>{qrCodeData.secret}</strong>
            </p>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.codeGroup}>
            <label className={styles.codeLabel}>Enter 6-digit code</label>
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
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>
            {hasError && (
              <div className={styles.errorText}>
                <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          <AuthSubmitButton
            type="submit"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            Verify Code
          </AuthSubmitButton>
        </form>
      </div>
    </DashboardAuthLayout>
  );
}
