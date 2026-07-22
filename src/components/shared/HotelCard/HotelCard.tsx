"use client";

import Image from "next/image";
import Link from "next/link";
import { Hotel } from "@/types";
import Button from "../Button/Button";
import { StarRating } from "@/components/shared";
import { useFavorite } from "@/hooks/useFavorite";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./HotelCard.module.scss";

interface HotelCardProps {
  hotel: Hotel;
  /** Grid (default) or list view */
  view?: "grid" | "list";
  /** Override image height (default 288px) */
  imageHeight?: number;
  onFavoriteToggle?: (id: string) => void;
}

export default function HotelCard({ hotel, view = "grid", imageHeight, onFavoriteToggle }: HotelCardProps) {
  const isList = view === "list";
  const hotelDetailsHref = `/hotels/${hotel.id}`;
  const { isAuthenticated } = useAuth();
  const { isFavorite, isLoading, toggle } = useFavorite({
    slug: hotel.id,
    kind: "hotel",
    initialFavorite: hotel.isFavorite ?? false,
  });

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggle();
    // Notify parent for backwards compatibility
    if (onFavoriteToggle) onFavoriteToggle(hotel.id);
  };

  return (
    <div className={`${styles.card} ${isList ? styles.listCard : ""}`}>
      {/* ── Image ── */}
      <Link href={hotelDetailsHref} className={`${styles.imageWrapper} ${isList ? styles.listImageWrapper : ""}`} style={imageHeight ? { height: imageHeight } : undefined}>
        <Image
          src={hotel.image}
          alt={hotel.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={styles.image}
        />
        <div className={styles.overlay}>
          <h3 className={styles.name}>{hotel.name}</h3>
          <span className={styles.location}>{hotel.location}</span>
        </div>
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

      {/* ── Content ── */}
      <div className={`${styles.content} ${isList ? styles.listContent : ""}`}>
        <div className={styles.ratingRow}>
          <span className={styles.starLabel}>
            {hotel.stars}-Star Luxury Hotel
          </span>
          <StarRating filled={hotel.stars} value={hotel.rating} className={styles.starRating} />
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{hotel.rooms}</span>
            <span className={styles.statLabel}>Rooms</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>${hotel.pricePerNight}</span>
            <span className={styles.statLabel}>/night</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{hotel.reviews}</span>
            <span className={styles.statLabel}>Reviews</span>
          </div>
        </div>

        <div className={styles.separator} />

        <div className={styles.footer}>
          <div className={styles.price}>
            <span className={styles.priceLabel}>Starting from</span>
            <span className={styles.priceValue}>
              ${hotel.pricePerNight}
              <small>/night</small>
            </span>
          </div>
          <Button variant="primary" size="sm" href={`/hotels/${hotel.id}/book`}>
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}

