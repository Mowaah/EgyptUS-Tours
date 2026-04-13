import Image from "next/image";
import Link from "next/link";
import { Hotel } from "@/types";
import Button from "../Button/Button";
import { StarRating, GlassCard } from "@/components/shared";
import styles from "./HotelCard.module.scss";

interface HotelCardProps {
  hotel: Hotel;
  /** Grid (default) or list view */
  view?: "grid" | "list";
  /** Whether to show the Start Route button (default false) */
  showRouteBtn?: boolean;
  /** Override image height (default 288px) */
  imageHeight?: number;
}

export default function HotelCard({ hotel, view = "grid", showRouteBtn = false, imageHeight }: HotelCardProps) {
  const isList = view === "list";
  const hotelDetailsHref = `/hotels/${hotel.id}`;

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
        {!isList && showRouteBtn && (
          <GlassCard as="button" className={styles.routeBtn} type="button">
            Start Route
          </GlassCard>
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

