"use client";

import Image from "next/image";
import Link from "next/link";
import { Trip } from "@/types";
import Button from "../Button/Button";
import { useFavorite } from "@/hooks/useFavorite";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./TripCard.module.scss";

interface TripCardProps {
  trip: Trip;
  onFavoriteToggle?: (id: string) => void;
  discountLabel?: React.ReactNode;
  className?: string;
}

export default function TripCard({ trip, onFavoriteToggle, discountLabel, className = "" }: TripCardProps) {
  const tripDetailsHref = `/trips/${trip.id}`;
  const { isAuthenticated } = useAuth();
  const { isFavorite, isLoading, toggle } = useFavorite({
    slug: trip.id,
    kind: "trip",
    initialFavorite: trip.isFavorite ?? false,
  });

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggle();
    // Notify parent for backwards compatibility
    if (onFavoriteToggle) onFavoriteToggle(trip.id);
  };

  return (
    <div className={`${styles.card} ${className}`}>
      <Link href={tripDetailsHref} className={styles.imageWrapper}>
        <Image
          src={trip.image}
          alt={trip.title}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 400px"
          className={styles.image}
        />
        {discountLabel && (
          <div className={styles.discountBanner}>
            <span>{discountLabel}</span>
          </div>
        )}
        {isAuthenticated && (
          <button
            className={`${styles.favorite} ${isFavorite ? styles.active : ""} ${isLoading ? styles.loading : ""}`}
            onClick={handleFavoriteClick}
            aria-label="Toggle favorite"
            disabled={isLoading}
          >
            {isFavorite ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                className={`${styles.heartIcon} ${styles.heartActive}`}
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
        )}
      </Link>

      <div className={styles.content}>
        <span className={styles.location}>
          <Image src="/images/location-blue-filled.svg" alt="Location" width={13.71} height={13.71} />
          {trip.location}
        </span>
        <h3 className={styles.title}>
          <Link href={tripDetailsHref}>{trip.title}</Link>
        </h3>
        <p className={styles.description}>{trip.description}</p>

        <div className={styles.meta}>
          <div className={styles.price}>
            {trip.priceLabel && (
              <span className={styles.priceLabel}>{trip.priceLabel}</span>
            )}
            <span className={styles.priceFrom}>From </span>
            <span className={styles.priceValue}>
              {trip.price}
              {trip.currency}
            </span>
            <span className={styles.pricePer}>per person</span>
          </div>
          <div className={styles.details}>
            <span>
              <Image
                src="/images/clock.svg"
                alt="Duration"
                width={14}
                height={14}
              />
              {trip.duration.days} days
              {trip.duration.nights > 0 && ` - ${trip.duration.nights} nights`}
            </span>
            {trip.countries && trip.countries > 1 && (
              <span> · {trip.countries} countries</span>
            )}
          </div>
        </div>
      </div>

      <Button variant="primary" fullWidth className={styles.viewTripBtn} href={tripDetailsHref}>
        View Trip
      </Button>
    </div>
  );
}

