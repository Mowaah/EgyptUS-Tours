"use client";

import Link from "next/link";
import styles from "./Button.module.scss";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "secondary-outline" | "dark";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  fullWidth,
  href,
  onClick,
  className = "",
  disabled,
  isLoading = false,
  type = "button",
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    className,
    isLoading ? styles.loading : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={classes}>
        {icon && iconPosition === "left" && (
          <span className={styles.icon}>{icon}</span>
        )}
        <span>{children}</span>
        {icon && iconPosition === "right" && (
          <span className={styles.icon}>{icon}</span>
        )}
      </Link>
    );
  }

  return (
    <button 
      className={classes} 
      onClick={onClick} 
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      type={type}
    >
      {isLoading ? (
        <span className={styles.spinner} aria-hidden />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className={styles.icon}>{icon}</span>
          )}
          <span>{children}</span>
          {icon && iconPosition === "right" && (
            <span className={styles.icon}>{icon}</span>
          )}
        </>
      )}
    </button>
  );
}
