"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyCustomerEmail } from "@/lib/api";
import { LoadingSpinner } from "@/components/shared";
import { useAuth } from "@/contexts/AuthContext";
import {
  getPendingGuestRecord,
  clearPendingGuestRecord,
} from "@/utils/guestBookingAuth";
import styles from "./VerifyEmailPage.module.scss";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      router.replace("/?verification=expired");
      return;
    }

    let isMounted = true;

    verifyCustomerEmail({ token })
      .then((res) => {
        if (!isMounted) return;

        if (res.access && res.refresh && res.customer) {
          login(res.access, res.refresh, res.customer);
        }

        const pending = getPendingGuestRecord();
        if (pending) {
          clearPendingGuestRecord();
          const tab = pending.kind === "booking" ? "bookings" : "requests";
          const typeParam = pending.type ? `&type=${pending.type}` : "";
          router.replace(`/profile?tab=${tab}${typeParam}&verified=true`);
        } else {
          router.replace("/profile?verified=true");
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        const code = err?.response?.data?.code;
        if (code === "already_verified") {
          router.replace("/?verification=already_verified");
        } else {
          router.replace("/?verification=expired");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [searchParams, login, router]);

  return (
    <div className={styles.page}>
      <LoadingSpinner size="lg" label="" />
      <div className={styles.content}>
        <p className={styles.message}>Verifying your email and preparing your account...</p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className={styles.page}><LoadingSpinner size="lg" label="" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

