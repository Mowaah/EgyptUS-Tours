"use client";

import { CSSProperties, ElementType, ReactNode } from "react";
import styles from "./GlassCard.module.scss";

interface GlassCardProps {
  /** Render as any HTML tag or component. Defaults to "div" */
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Figma glass preset for navbar active pill on hero */
  variant?: "default" | "nav";
  [key: string]: unknown;
}

/**
 * GlassCard — glass morphism wrapper.
 * Use variant="nav" for the hero navbar active link (Figma glass settings).
 */
export default function GlassCard({
  as: Tag = "div",
  children,
  className = "",
  style,
  variant = "default",
  ...rest
}: GlassCardProps) {
  const isNav = variant === "nav";

  return (
    <Tag
      className={`${styles.glass} ${isNav ? styles.glassNav : ""} ${className}`.trim()}
      style={{
        ...(isNav
          ? {}
          : {
              backdropFilter: "blur(4px) saturate(140%)",
              WebkitBackdropFilter: "blur(4px) saturate(140%)",
            }),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
