"use client";

import Image from "next/image";
import { Trip } from "@/types";
import Button from "@/components/shared/Button/Button";
import styles from "./TripHeroBar.module.scss";

interface TripHeroBarProps {
  trip: Trip;
  onFavoriteToggle?: () => void;
}

export default function TripHeroBar({ trip, onFavoriteToggle }: TripHeroBarProps) {
  const rating = trip.rating ?? 0;
  const reviewCount = trip.reviewCount ?? 0;

  return (
    <div className={styles.heroBar}>
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
            className={`${styles.favorite} ${trip.isFavorite ? styles.favoriteActive : ""}`}
            onClick={onFavoriteToggle}
            aria-label="Toggle favorite"
          >
            <svg width="24" height="24" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.7001 2.58203C12.1917 2.58203 10.8417 3.31536 10.0001 4.44036C9.15841 3.31536 7.80841 2.58203 6.30008 2.58203C3.74175 2.58203 1.66675 4.66536 1.66675 7.24036C1.66675 8.23203 1.82508 9.1487 2.10008 9.9987C3.41675 14.1654 7.47508 16.657 9.48341 17.3404C9.76675 17.4404 10.2334 17.4404 10.5167 17.3404C12.5251 16.657 16.5834 14.1654 17.9001 9.9987C18.1751 9.1487 18.3334 8.23203 18.3334 7.24036C18.3334 4.66536 16.2584 2.58203 13.7001 2.58203Z" />
            </svg>
          </button>

          <Button
            variant="outline"
            size="sm"
            className={styles.actionBtn}
            icon={<Image src="/images/brochure.svg" alt="" width={18} height={18} />}
            iconPosition="left"
          >
            Get the Brochure
          </Button>

          <Button
            variant="primary"
            size="sm"
            className={styles.actionBtn}
            icon={<Image src="/images/share.svg" alt="" width={18} height={18} />}
            iconPosition="left"
          >
            Share
          </Button>
        </div>
      </div>

      <div className={styles.titleRow}>
        <h1 className={styles.title}>{trip.title}</h1>
      </div>

      <p className={styles.subtitle}>{trip.description}</p>
    </div>
  );
}
