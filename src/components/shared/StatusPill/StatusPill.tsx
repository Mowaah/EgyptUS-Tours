import React from "react";
import styles from "./StatusPill.module.scss";

export type StatusPillVariant =
  | "green"
  | "red"
  | "blue"
  | "orange"
  | "pink"
  | "gray"
  | "orangeDark"
  | "orangeLight"
  | "teal"
  | "redSoft"
  | "grayDark"
  | "pinkSoft"
  | "lightBlue"
  | "purple"
  | "magenta"
  | "darkBlue"
  | "blueDark";

export type StatusPillSize = "sm" | "md" | "lg";
export type StatusPillIconType = "dot" | "spinner" | "check" | "x" | "none";

interface StatusPillProps {
  label: React.ReactNode;
  variant: StatusPillVariant;
  size?: StatusPillSize;
  iconType?: StatusPillIconType;
  icon?: React.ReactNode;
  hideDot?: boolean;
  className?: string;
}

export function LoadingGlyph() {
  return (
    <svg className={styles.spinnerSvg} width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity="0.25"
      />
      <path
        fill="none"
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function StatusPill({
  label,
  variant,
  size = "md",
  iconType = "dot",
  icon,
  hideDot = false,
  className = "",
}: StatusPillProps) {
  const variantClass = styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`] || styles.variantGray;

  let sizeClass = "";
  if (size === "sm") sizeClass = styles.sizeSm;
  else if (size === "lg") sizeClass = styles.sizeLg;

  const renderIcon = () => {
    if (icon) return <span className={styles.icon}>{icon}</span>;
    if (hideDot || iconType === "none") return null;
    if (iconType === "spinner") return <span className={styles.icon}><LoadingGlyph /></span>;
    if (iconType === "check") return <span className={styles.icon}>✓</span>;
    if (iconType === "x") return <span className={styles.icon}>✕</span>;
    return <i aria-hidden />;
  };

  return (
    <span className={`${styles.pill} ${variantClass} ${sizeClass} ${className}`.trim()}>
      {renderIcon()}
      {label}
    </span>
  );
}
