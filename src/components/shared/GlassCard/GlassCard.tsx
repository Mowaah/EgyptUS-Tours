"use client";

import { CSSProperties, ElementType, ReactNode } from "react";
import styles from "./GlassCard.module.scss";

interface GlassCardProps {
  /** Render as any HTML tag or component. Defaults to "div" */
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
}

/**
 * GlassCard — liquid glass morphism wrapper.
 *
 * The "liquid" quality comes from an SVG feDisplacementMap filter in backdrop-filter.
 * This warps/refracts whatever is behind the element, simulating real optical glass.
 *
 * - Chrome/Edge: full effect (blur + SVG warp + saturate)
 * - Safari:      blur + saturate (url() in backdrop-filter not supported)
 * - Firefox:     semi-transparent surface + box-shadow edges (no backdrop-filter)
 */
export default function GlassCard({
  as: Tag = "div",
  children,
  className = "",
  style,
  ...rest
}: GlassCardProps) {
  return (
    <Tag
      className={`${styles.glass} ${className}`}
      style={{
        backdropFilter: `blur(4px) saturate(140%)`,
        WebkitBackdropFilter: `blur(4px) saturate(140%)`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
