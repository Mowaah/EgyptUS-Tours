"use client";

import { ReactNode } from "react";
import styles from "./DetailHeroBar.module.scss";

interface DetailHeroBarProps {
  title: string;
  description?: string;
  rating: number;
  reviewCount: number;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  location?: string;
  duration?: string;
  mobileBrochureButton?: ReactNode;
  children?: ReactNode; // Slots for specific actions (Brochure, Share, etc.)
}

export default function DetailHeroBar({
  title,
  description,
  rating,
  reviewCount,
  isFavorite,
  onFavoriteToggle,
  location,
  duration,
  mobileBrochureButton,
  children,
}: DetailHeroBarProps) {
  return (
    <>
      <div className={styles.desktopCard}>
        <div className={styles.topRow}>
        <div className={styles.meta}>
          <span className={styles.reviews}>({reviewCount.toLocaleString()} reviews)</span>
          <span className={styles.rating}>{rating}</span>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="#FFB02E" className={styles.star}>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.favorite} ${isFavorite ? styles.favoriteActive : ""}`}
            onClick={onFavoriteToggle}
            aria-label="Toggle favorite"
          >
            <svg width="24" height="24" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.7001 2.58203C12.1917 2.58203 10.8417 3.31536 10.0001 4.44036C9.15841 3.31536 7.80841 2.58203 6.30008 2.58203C3.74175 2.58203 1.66675 4.66536 1.66675 7.24036C1.66675 8.23203 1.82508 9.1487 2.10008 9.9987C3.41675 14.1654 7.47508 16.657 9.48341 17.3404C9.76675 17.4404 10.2334 17.4404 10.5167 17.3404C12.5251 16.657 16.5834 14.1654 17.9001 9.9987C18.1751 9.1487 18.3334 8.23203 18.3334 7.24036C18.3334 4.66536 16.2584 2.58203 13.7001 2.58203Z" />
            </svg>
          </button>

          {children}
        </div>
      </div>

        <div className={styles.titleRow}>
          <h1 className={styles.title}>{title}</h1>
        </div>

        {description && <p className={styles.subtitle}>{description}</p>}
      </div>

      <div className={styles.mobileInfoCard}>
        <div className={styles.mobileInfoRow}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2971E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>{location}</span>
        </div>
        <div className={styles.mobileInfoRow}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2971E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>{duration}</span>
        </div>
        <div className={styles.mobileInfoRow}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#2971E6" stroke="#2971E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span>{rating} ({reviewCount} reviews)</span>
        </div>
      </div>

      {mobileBrochureButton && (
        <div className={styles.mobileBrochureBtn}>
          {mobileBrochureButton}
        </div>
      )}
    </>
  );
}
