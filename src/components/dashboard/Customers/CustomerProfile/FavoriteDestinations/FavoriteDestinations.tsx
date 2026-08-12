import Image from "next/image";
import styles from "./FavoriteDestinations.module.scss";

export default function FavoriteDestinations({ data = {} }: { data?: Record<string, number> }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);

  // Take top 4 destinations for the legend
  const topDestinations = Object.entries(data)
    .filter(([_, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const styleClasses = [styles.dotBlue, styles.dotPurple, styles.dotOrange, styles.dotDarkBlue];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Image src="/images/dashboard/customers/overview/location.svg" alt="" width={24} height={24} aria-hidden />
        </div>
        <div className={styles.headerText}>
          <h2>Favorite Destinations in Egypt</h2>
          <p>Overview of bookings to different Places</p>
        </div>
      </div>

      <div className={styles.mapContainer}>
        <Image 
          src="/images/dashboard/map.png" 
          alt="World Map Destinations" 
          fill
          style={{ objectFit: "contain" }}
          quality={100}
          unoptimized
        />
      </div>

      <div className={styles.legend}>
        {topDestinations.length > 0 ? topDestinations.map(([destination, count], idx) => (
          <div className={styles.legendItem} key={destination}>
            <div className={`${styles.dot} ${styleClasses[idx % styleClasses.length]}`} />
            <div className={styles.text}>
              <strong>{total > 0 ? Math.round((count / total) * 100) : 0}%</strong>
              <span>{destination}</span>
            </div>
          </div>
        )) : (
          <div className={styles.legendItem}>
            <div className={styles.text}>
              <span>No destinations booked yet</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
