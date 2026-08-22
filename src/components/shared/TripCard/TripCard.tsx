"use client";

import Image from "next/image";
import Link from "next/link";
import { Trip } from "@/types";
import Button from "../Button/Button";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import { useFavorite } from "@/hooks/useFavorite";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./TripCard.module.scss";

interface TripCardProps {
  trip: Trip;
  onFavoriteToggle?: (id: string) => void;
  className?: string;
}

export default function TripCard({ trip, onFavoriteToggle, className = "" }: TripCardProps) {
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
        {trip.discountLabel && (
          <div className={styles.discountBanner}>
            <span>{trip.discountLabel}</span>
          </div>
        )}
        {isAuthenticated && (
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={handleFavoriteClick}
            isLoading={isLoading}
            className={styles.favorite}
          />
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

