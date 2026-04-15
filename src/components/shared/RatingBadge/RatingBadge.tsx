import Image from "next/image";
import styles from "./RatingBadge.module.scss";

interface RatingBadgeProps {
  rating: number;
  reviews: number;
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

  return (
    <div className={`${styles.badge} ${styles[`size-${size}`]} ${className}`.trim()}>
      <Image
        src="/images/star-yellow3.svg"
        alt=""
        width={iconSize}
        height={iconSize}
        aria-hidden="true"
      />
      <span>{rating}</span>
      <span className={styles.reviewCount}>({reviews.toLocaleString()})</span>
    </div>
  );
}
