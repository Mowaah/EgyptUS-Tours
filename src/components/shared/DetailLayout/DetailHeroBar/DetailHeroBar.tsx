"use client";

import { ReactNode } from "react";
import Image from "next/image";
import styles from "./DetailHeroBar.module.scss";

interface DetailHeroBarProps {
  title: string;
  description?: string;
  rating: number;
  reviewCount: number;
  showReviews?: boolean;
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
  showReviews = true,
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
            <div className={styles.ratingGroup}>
              <span className={styles.rating}>{rating}</span>
              <Image src="/images/rating-star.svg" alt="star" width={24.94} height={23} className={styles.star} />
            </div>
            {showReviews && <span className={styles.reviews}>({reviewCount.toLocaleString()} reviews)</span>}
          </div>

          <div className={styles.actions}>
            <button
              className={`${styles.favorite} ${isFavorite ? styles.favoriteActive : ""}`}
              onClick={onFavoriteToggle}
              aria-label="Toggle favorite"
            >
              {isFavorite ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.heartActive}
                >
                  <path d="M13.7001 2.58203C12.1917 2.58203 10.8417 3.31536 10.0001 4.44036C9.15841 3.31536 7.80841 2.58203 6.30008 2.58203C3.74175 2.58203 1.66675 4.66536 1.66675 7.24036C1.66675 8.23203 1.82508 9.1487 2.10008 9.9987C3.41675 14.1654 7.47508 16.657 9.48341 17.3404C9.76675 17.4404 10.2334 17.4404 10.5167 17.3404C12.5251 16.657 16.5834 14.1654 17.9001 9.9987C18.1751 9.1487 18.3334 8.23203 18.3334 7.24036C18.3334 4.66536 16.2584 2.58203 13.7001 2.58203Z" />
                </svg>
              ) : (
                <Image
                  src="/images/heart-blue.svg"
                  alt=""
                  width={20}
                  height={20}
                  className={styles.heartBlue}
                />
              )}
            </button>

            {children}
          </div>
        </div>

        <div className={styles.titleRow}>
          <h1 className={styles.title}>{title}</h1>
        </div>

        {description && <p className={styles.subtitle}>{description}</p>}

        {(location || duration) && (
          <div className={styles.tagsContainer}>
            {location && (
              <div className={styles.tag}>
                <Image src="/images/location-blue-filled.svg" alt="Location" width={18} height={18} />
                <span>{location}</span>
              </div>
            )}
            {duration && (
              <div className={styles.tag}>
                <Image src="/images/clock2-blue.svg" alt="Duration" width={18} height={18} />
                <span>{duration}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {(location || duration) && (
        <div className={styles.mobileInfoCard}>
          {location && (
            <div className={styles.mobileInfoRow}>
              <Image src="/images/location-blue-filled.svg" alt="Location" width={18} height={18} />
              <span>{location}</span>
            </div>
          )}
          {duration && (
            <div className={styles.mobileInfoRow}>
              <Image src="/images/clock2-blue.svg" alt="Duration" width={18} height={18} />
              <span>{duration}</span>
            </div>
          )}
          <div className={styles.mobileInfoRow}>
            <Image src="/images/rating-star.svg" alt="Rating" width={18} height={18} />
            <div className={styles.ratingGroup} style={{ gap: "4px" }}>
              <span className={styles.rating}>{rating}</span>
              {showReviews && <span className={styles.reviews}>({reviewCount.toLocaleString()} reviews)</span>}
            </div>
          </div>
        </div>
      )}

      {mobileBrochureButton && (
        <div className={styles.mobileBrochureBtn}>
          {mobileBrochureButton}
        </div>
      )}
    </>
  );
}
