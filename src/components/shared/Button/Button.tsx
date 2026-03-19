"use client";

import styles from "./Button.module.scss";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "dark";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
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
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <a href={href} className={classes}>
        {icon && iconPosition === "left" && (
          <span className={styles.icon}>{icon}</span>
        )}
        <span>{children}</span>
        {icon && iconPosition === "right" && (
          <span className={styles.icon}>{icon}</span>
        )}
      </a>
    );
  }

  return (
    <button className={classes} onClick={onClick}>
      {icon && iconPosition === "left" && (
        <span className={styles.icon}>{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <span className={styles.icon}>{icon}</span>
      )}
    </button>
  );
}
