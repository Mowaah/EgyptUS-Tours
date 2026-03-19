import styles from "./StarRating.module.scss";

const STAR_PATH =
  "M16.0182 4.09313L18.0716 8.19979C18.3516 8.77146 19.0982 9.31979 19.7282 9.42479L23.4499 10.0431C25.8299 10.4398 26.3899 12.1665 24.6749 13.8698L21.7816 16.7631C21.2916 17.2531 21.0232 18.1981 21.1749 18.8748L22.0032 22.4565C22.6566 25.2915 21.1516 26.3881 18.6432 24.9065L15.1549 22.8415C14.5249 22.4681 13.4866 22.4681 12.8449 22.8415L9.35656 24.9065C6.85989 26.3881 5.34323 25.2798 5.99656 22.4565L6.82489 18.8748C6.97656 18.1981 6.70823 17.2531 6.21823 16.7631L3.32489 13.8698C1.62156 12.1665 2.16989 10.4398 4.54989 10.0431L8.27156 9.42479C8.88989 9.31979 9.63656 8.77146 9.91656 8.19979L11.9699 4.09313C13.0899 1.86479 14.9099 1.86479 16.0182 4.09313Z";

interface StarRatingProps {
  /** Number of filled stars (1-5) */
  filled?: number;
  /** Rating value to display (e.g. 4.2). If omitted, filled is used. */
  value?: number;
  /** Show the rating number next to stars */
  showValue?: boolean;
  /** Star icon size in pixels */
  size?: number;
  className?: string;
}

export default function StarRating({
  filled,
  value,
  showValue = true,
  size = 14,
  className = "",
}: StarRatingProps) {
  const filledCount = filled ?? (value !== undefined ? Math.floor(value) : 0);
  const displayValue = value ?? filledCount;
  const emptyCount = Math.max(0, 5 - filledCount);

  return (
    <span className={`${styles.stars} ${className}`}>
      {Array.from({ length: filledCount }, (_, i) => (
        <svg
          key={`f-${i}`}
          width={size}
          height={size}
          viewBox="0 0 28 28"
          fill="none"
          aria-hidden
        >
          <path d={STAR_PATH} fill="#FDC700" />
        </svg>
      ))}
      {Array.from({ length: emptyCount }, (_, i) => (
        <svg
          key={`e-${i}`}
          width={size}
          height={size}
          viewBox="0 0 28 28"
          fill="none"
          aria-hidden
        >
          <path d={STAR_PATH} fill="#E5E7EB" />
        </svg>
      ))}
      {showValue && <span className={styles.ratingValue}>{displayValue}</span>}
    </span>
  );
}
