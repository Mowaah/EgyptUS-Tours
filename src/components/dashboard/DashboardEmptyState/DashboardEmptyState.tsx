"use client";

import React from "react";
import Image from "next/image";
import styles from "./DashboardEmptyState.module.scss";

export interface DashboardEmptyStateProps {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
  imageSrc?: string;
  actionIconSrc?: string;
}

export default function DashboardEmptyState({
  title,
  subtitle,
  actionLabel,
  onAction,
  imageSrc = "/images/dashboard/empty.png",
  actionIconSrc,
}: DashboardEmptyStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.innerWrapper}>
        <div className={styles.graphicContainer}>
          <Image src={imageSrc} alt={title} width={210} height={210} />
        </div>

        <div className={styles.textContainer}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        {actionLabel && onAction && (
          <button type="button" className={`${styles.actionButton} ${actionIconSrc ? styles.actionButtonSecondary : ''}`} onClick={onAction}>
            <span className={actionIconSrc ? styles.actionTextSecondary : styles.actionText}>{actionLabel}</span>
            <span className={styles.actionIcon}>
              {actionIconSrc ? (
                <Image src={actionIconSrc} alt="" width={24} height={24} aria-hidden />
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5"/>
                  <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
