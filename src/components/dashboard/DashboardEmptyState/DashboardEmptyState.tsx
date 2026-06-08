"use client";

import React from "react";
import Image from "next/image";
import styles from "./DashboardEmptyState.module.scss";

export interface DashboardEmptyStateProps {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function DashboardEmptyState({
  title,
  subtitle,
  actionLabel,
  onAction,
}: DashboardEmptyStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.innerWrapper}>
        <div className={styles.graphicContainer}>
          <Image src="/images/dashboard/empty.png" alt="Empty state" width={210} height={210} />
        </div>

        <div className={styles.textContainer}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        {actionLabel && onAction && (
          <button type="button" className={styles.actionButton} onClick={onAction}>
            <span className={styles.actionText}>{actionLabel}</span>
            <span className={styles.actionIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5"/>
                <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
