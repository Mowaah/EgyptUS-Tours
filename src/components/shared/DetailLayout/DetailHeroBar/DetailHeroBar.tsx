"use client";

import { ReactNode } from "react";
import Image from "next/image";
import FavoriteButton from "../../FavoriteButton/FavoriteButton";
import styles from "./DetailHeroBar.module.scss";

interface DetailHeroBarProps {
  title: string;
  description?: string;
  rating: number;
  reviewCount: number;
  showReviews?: boolean;
  showFavorite?: boolean;
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
  showFavorite = true,
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
            {showFavorite && onFavoriteToggle && (
              <FavoriteButton
                isFavorite={isFavorite ?? false}
                onToggle={onFavoriteToggle}
                className={styles.favorite}
              />
            )}

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
