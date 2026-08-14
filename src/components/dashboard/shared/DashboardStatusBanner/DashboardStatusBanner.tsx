"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./DashboardStatusBanner.module.scss";

export type DashboardStatusBannerVariant = "success" | "warning" | "error";

export interface DashboardStatusBannerProps {
  message: string;
  variant?: DashboardStatusBannerVariant;
  className?: string;
  show?: boolean;
  onClose?: () => void;
  durationMs?: number;
  // Kept for backward compatibility if any component still passes it manually
  leaving?: boolean;
}

export default function DashboardStatusBanner({
  message,
  variant = "success",
  className = "",
  show = true,
  onClose,
  durationMs = 3000,
  leaving: externalLeaving,
}: DashboardStatusBannerProps) {
  const [visible, setVisible] = useState(show);
  const [internalLeaving, setInternalLeaving] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setInternalLeaving(false);
      const leaveTimer = setTimeout(() => setInternalLeaving(true), durationMs - 300);
      const unmountTimer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, durationMs);

      return () => {
        clearTimeout(leaveTimer);
        clearTimeout(unmountTimer);
      };
    } else {
      setVisible(false);
      setInternalLeaving(false);
    }
  }, [show, durationMs, onClose]);

  if (!visible) return null;

  const isLeaving = externalLeaving !== undefined ? externalLeaving : internalLeaving;

  const bannerClassName = [
    styles.banner,
    styles[variant],
    isLeaving ? styles.leaving : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={bannerClassName} role="status" aria-live="polite">
      <span className={styles.icon} aria-hidden>
        {variant === "warning" || variant === "error" ? (
          <span className={variant === "error" ? styles.errorIcon : styles.warningIcon}>
            <Image src="/images/dashboard/info.svg" alt="" width={20} height={20} />
          </span>
        ) : (
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm4.05 7.36-4.63 4.63a.9.9 0 0 1-1.27 0L7.95 12.8a.9.9 0 0 1 1.27-1.27l1.56 1.56 3.99-3.99a.9.9 0 0 1 1.28 1.27Z" />
          </svg>
        )}
      </span>
      <span>{message}</span>
    </div>
  );
}
