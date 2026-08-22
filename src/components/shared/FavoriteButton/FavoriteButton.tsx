"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./FavoriteButton.module.scss";

export interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  ariaLabel?: string;
}

interface ParticleStyle {
  "--px": string;
  "--py": string;
  "--pdur": string;
  "--pdelay": string;
  "--p-end-scale": string;
  "--psize": string;
}

const PARTICLE_COUNT = 8;

export default function FavoriteButton({
  isFavorite,
  onToggle,
  isLoading = false,
  disabled = false,
  className = "",
  size = "md",
  ariaLabel = "Toggle favorite",
}: FavoriteButtonProps) {
  const [isBursting, setIsBursting] = useState(false);
  const [particles, setParticles] = useState<ParticleStyle[]>([]);
  const prevFavorite = useRef(isFavorite);
  const burstTimer = useRef<NodeJS.Timeout | null>(null);

  const generateParticles = (): ParticleStyle[] => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const angle = (i * (360 / PARTICLE_COUNT) + (Math.random() * 20 - 10)) * (Math.PI / 180);
      const dist = 18 + Math.random() * 8; // 18px to 26px
      return {
        "--px": `${Math.round(Math.cos(angle) * dist)}px`,
        "--py": `${Math.round(Math.sin(angle) * dist)}px`,
        "--pdur": `${Math.round(500 + Math.random() * 150)}ms`,
        "--pdelay": `${Math.round(Math.random() * 60)}ms`,
        "--p-end-scale": (0.4 + Math.random() * 0.4).toFixed(2),
        "--psize": (0.8 + Math.random() * 0.5).toFixed(2),
      };
    });
  };

  const triggerBurst = () => {
    if (burstTimer.current) {
      clearTimeout(burstTimer.current);
    }
    setParticles(generateParticles());
    setIsBursting(true);
    burstTimer.current = setTimeout(() => {
      setIsBursting(false);
    }, 650);
  };

  useEffect(() => {
    if (isFavorite && !prevFavorite.current) {
      triggerBurst();
    }
    prevFavorite.current = isFavorite;

    return () => {
      if (burstTimer.current) {
        clearTimeout(burstTimer.current);
      }
    };
  }, [isFavorite]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || isLoading) return;

    if (!isFavorite) {
      triggerBurst();
    }
    if (onToggle) {
      onToggle(e);
    }
  };

  const sizeClass = size === "sm" ? styles.sm : size === "lg" ? styles.lg : "";

  return (
    <button
      type="button"
      className={`${styles.favoriteBtn} ${sizeClass} ${isBursting ? styles.isBursting : ""} ${className}`}
      data-liked={isFavorite ? "true" : "false"}
      onClick={handleClick}
      aria-label={ariaLabel}
      disabled={disabled || isLoading}
    >
      <span className={styles.likeIcon}>
        <svg
          className={styles.heartSvg}
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.516 17.3423C10.2327 17.4423 9.76602 17.4423 9.48268 17.3423C7.06602 16.5173 1.66602 13.0757 1.66602 7.24232C1.66602 4.66732 3.74102 2.58398 6.29935 2.58398C7.81602 2.58398 9.15768 3.31732 9.99935 4.45065C10.841 3.31732 12.191 2.58398 13.6993 2.58398C16.2577 2.58398 18.3327 4.66732 18.3327 7.24232C18.3327 13.0757 12.9327 16.5173 10.516 17.3423Z"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <span className={styles.particles} aria-hidden="true">
        {particles.map((pStyle, idx) => (
          <i key={idx} style={pStyle as React.CSSProperties} />
        ))}
      </span>
    </button>
  );
}
