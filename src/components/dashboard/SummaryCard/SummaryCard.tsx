import Image from "next/image";
import styles from "./SummaryCard.module.scss";

import React from "react";

const TrendIcon = ({ trend }: { trend: "up" | "down" }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {trend === "up" ? (
      <path d="M23 6l-9.5 9.5-5-5L1 18m15-12h7v7" />
    ) : (
      <path d="M23 18l-9.5-9.5-5 5L1 6m15 12h7v-7" />
    )}
  </svg>
);

export interface SummaryCardProps {
  label: React.ReactNode;
  value: React.ReactNode;
  change?: string;
  trend?: "up" | "down";
  tone?: "blue" | "orange" | "pink" | "purple" | "green" | "gray" | string;
  iconSrc?: string;
  icon?: React.ReactNode;
  className?: string;
  customBadgeIcon?: React.ReactNode;
}

export default function SummaryCard({
  label,
  value,
  change,
  trend,
  tone = "blue",
  iconSrc,
  icon,
  className = "",
  customBadgeIcon,
}: SummaryCardProps) {
  // Determine if tone is one of the predefined styles
  const isPredefinedTone = ["blue", "orange", "pink", "purple", "green", "gray"].includes(tone);
  const toneClass = isPredefinedTone ? styles[tone] : "";

  return (
    <article className={`${styles.card} ${toneClass} ${className}`}>
      <div className={styles.top}>
        {(iconSrc || icon) && (
          <span className={styles.icon} aria-hidden>
            {icon ? (
              icon
            ) : (
              iconSrc && (
                <Image
                  src={iconSrc}
                  alt=""
                  width={18}
                  height={18}
                />
              )
            )}
          </span>
        )}
        <span className={styles.label}>{label}</span>
      </div>
      <div className={styles.bottom}>
        <strong className={styles.value}>{value}</strong>
        {change && (
          <span className={`${styles.trend} ${trend === "down" ? styles.down : ""} ${!trend ? styles.neutral : ""}`}>
            {customBadgeIcon && <span className={styles.customBadgeIcon}>{customBadgeIcon}</span>}
            {change}
            {trend && <TrendIcon trend={trend} />}
          </span>
        )}
      </div>
    </article>
  );
}
