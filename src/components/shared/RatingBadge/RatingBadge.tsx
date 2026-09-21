import Image from "next/image";
import styles from "./RatingBadge.module.scss";

interface RatingBadgeProps {
  rating: number;
  reviews?: number;
  size?: "sm" | "md";
  className?: string;
}

export default function RatingBadge({
  rating,
  reviews,
  size = "sm",
  className = "",
}: RatingBadgeProps) {
  const iconSize = size === "md" ? 18 : 14;
  const numRating = Number(rating);
  const formattedRating = !isNaN(numRating)
    ? numRating % 1 === 0
      ? String(Math.round(numRating))
      : String(numRating)
    : rating;

  return (
    <div className={`${styles.badge} ${styles[`size-${size}`]} ${className}`.trim()}>
      <Image
        src="/images/star-yellow3.svg"
        alt=""
        width={iconSize}
        height={iconSize}
        aria-hidden="true"
      />
      <span>{formattedRating}</span>
      {reviews !== undefined && (
        <span className={styles.reviewCount}>({reviews.toLocaleString()})</span>
      )}
    </div>
  );
}
