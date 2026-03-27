"use client";

import Image from "next/image";
import { Trip } from "@/types";
import Button from "../Button/Button";
import styles from "./TripCard.module.scss";

interface TripCardProps {
  trip: Trip;
  onFavoriteToggle?: (id: string) => void;
}

export default function TripCard({ trip, onFavoriteToggle }: TripCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={trip.image}
          alt={trip.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className={styles.image}
        />
        {onFavoriteToggle && (
          <button
            className={`${styles.favorite} ${trip.isFavorite ? styles.active : ""}`}
            onClick={() => onFavoriteToggle(trip.id)}
            aria-label="Toggle favorite"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              className={`${styles.heartIcon} ${trip.isFavorite ? styles.heartActive : ""}`}
            >
              <path d="M13.7001 2.58203C12.1917 2.58203 10.8417 3.31536 10.0001 4.44036C9.15841 3.31536 7.80841 2.58203 6.30008 2.58203C3.74175 2.58203 1.66675 4.66536 1.66675 7.24036C1.66675 8.23203 1.82508 9.1487 2.10008 9.9987C3.41675 14.1654 7.47508 16.657 9.48341 17.3404C9.76675 17.4404 10.2334 17.4404 10.5167 17.3404C12.5251 16.657 16.5834 14.1654 17.9001 9.9987C18.1751 9.1487 18.3334 8.23203 18.3334 7.24036C18.3334 4.66536 16.2584 2.58203 13.7001 2.58203Z" />
            </svg>
          </button>
        )}
      </div>

      <div className={styles.content}>
        <span className={styles.location}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
          </svg>
          {trip.location}
        </span>
        <h3 className={styles.title}>{trip.title}</h3>
        <p className={styles.description}>{trip.description}</p>

        <div className={styles.meta}>
          <div className={styles.price}>
            {trip.priceLabel && (
              <span className={styles.priceLabel}>{trip.priceLabel}</span>
            )}
            <span className={styles.priceValue}>
              {trip.price}
              {trip.currency}
            </span>
            <span className={styles.pricePer}>per person</span>
          </div>
          <div className={styles.details}>
            <span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
              </svg>
              {trip.duration.days} days
              {trip.duration.nights > 0 && ` - ${trip.duration.nights} nights`}
            </span>
            {trip.countries && trip.countries > 1 && (
              <span> · {trip.countries} countries</span>
            )}
          </div>
        </div>
      </div>

      <Button variant="primary" fullWidth className={styles.viewTripBtn} href={`/trips/luxor-nile-cruise`}>
        View Trip
      </Button>
    </div>
  );
}
