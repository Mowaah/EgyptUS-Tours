"use client";

import Image from "next/image";
import Link from "next/link";
import { Hotel } from "@/types";
import Button from "../Button/Button";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import { StarRating } from "@/components/shared";
import { useFavorite } from "@/hooks/useFavorite";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
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
  const { formatCurrency } = useCurrency();
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
        {(hotel.discountTitle || hotel.discountValue) && (
          <div className={styles.discountBanner}>
            <span>
              {hotel.discountTitle && <span>{hotel.discountTitle} &mdash; </span>}
              <span className={styles.discountValueText}>{hotel.discountValue}</span>
            </span>
          </div>
        )}
        <div className={styles.overlay}>
          <h3 className={styles.name}>{hotel.name}</h3>
          <span className={styles.location}>{hotel.location}</span>
        </div>
        {isAuthenticated && (
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={handleFavoriteClick}
            isLoading={isLoading}
            className={styles.favorite}
          />
        )}

      </Link>

      {/* ── Content ── */}
      <div className={`${styles.content} ${isList ? styles.listContent : ""}`}>
        <div className={styles.ratingRow}>
          <span className={styles.starLabel}>
            {hotel.stars}-Star Luxury Hotel
          </span>
          <StarRating filled={hotel.stars} value={hotel.stars} className={styles.starRating} />
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{hotel.rooms}</span>
            <span className={styles.statLabel}>Rooms</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{formatCurrency(hotel.pricePerNight)}</span>
            <span className={styles.statLabel}>/night</span>
          </div>
        </div>

        <div className={styles.separator} />

        <div className={styles.footer}>
          <div className={styles.price}>
            <span className={styles.priceLabel}>Starting from</span>
            <span className={styles.priceValue}>
              {hotel.originalPrice && (
                <span className={styles.originalPrice}>{formatCurrency(hotel.originalPrice)}</span>
              )}
              {formatCurrency(hotel.pricePerNight)}
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

