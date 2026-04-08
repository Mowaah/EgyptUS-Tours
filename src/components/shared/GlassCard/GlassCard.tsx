"use client";

import { useId, CSSProperties, ElementType, ReactNode } from "react";
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
  const uid = useId();
  // Strip colons – invalid in CSS/SVG id selectors
  const filterId = `glass-${uid.replace(/:/g, "")}`;

  return (
    <Tag
      className={`${styles.glass} ${className}`}
      style={{
        // Chrome/Edge: blur → SVG warp → saturate
        backdropFilter: `blur(5px) url(#${filterId}) saturate(140%)`,
        // Safari fallback: blur + saturate, no distortion
        WebkitBackdropFilter: `blur(5px) saturate(140%)`,
        ...style,
      }}
      {...rest}
    >
      {/*
        Hidden SVG defines the per-instance liquid-glass displacement filter.
        feTurbulence generates a smooth noise map; feDisplacementMap uses it to
        warp the backdrop pixels — this is what makes it look like liquid/optical glass.
      */}
      <svg
        aria-hidden="true"
        focusable="false"
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      >
        <defs>
          <filter
            id={filterId}
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65 0.55"
              numOctaves="3"
              seed="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="4"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {children}
    </Tag>
  );
}
