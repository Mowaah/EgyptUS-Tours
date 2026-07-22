"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { verifyCustomerEmail } from "@/lib/api";
import { SectionHeader } from "@/components/shared";
import { useAuth } from "@/contexts/AuthContext";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    let token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }

    let isMounted = true;

    verifyCustomerEmail({ token })
      .then((res) => {
        if (isMounted) {
          if (res.access && res.refresh && res.customer) {
            login(res.access, res.refresh, res.customer);
          }
          setStatus("success");
          setMessage("Your email has been verified! You are now automatically logged in.");
        }
      })
      .catch((err) => {
        if (isMounted) {
          setStatus("error");
          if (err.response?.data?.detail) {
            setMessage(err.response.data.detail);
          } else {
            setMessage("An error occurred while verifying your email. Please try again.");
          }
        }
      });

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  return (
    <div style={{ padding: "120px 20px", minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      
      {status === "success" && (
        <Image 
          src="/images/dashboard/activate-modal.svg" 
          alt="Success" 
          width={80} 
          height={80} 
          style={{ marginBottom: "24px" }} 
        />
      )}

      {status === "error" && (
        <Image 
          src="/images/dashboard/delete-modal.svg" 
          alt="Error" 
          width={80} 
          height={80} 
          style={{ marginBottom: "24px" }} 
        />
      )}

      <SectionHeader 
        showLabel={false}
        heading={status === "success" ? "Email Verified" : status === "error" ? "Verification Failed" : "Verifying Email"} 
      />
      
      <div style={{ marginTop: "16px", textAlign: "center", maxWidth: "600px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <p style={{ fontSize: "18px", lineHeight: "1.6", color: "var(--text-color)" }}>
          {message}
        </p>
        
        {status !== "loading" && (
          <div style={{ marginTop: "40px" }}>
            <Link 
              href="/" 
              style={{
                display: "inline-block",
                padding: "12px 32px",
                backgroundColor: "var(--primary-color)",
                color: "#fff",
                borderRadius: "8px",
                fontWeight: "600",
                textDecoration: "none"
              }}
            >
              Return Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
