import Image from "next/image";
import styles from "./FavoriteDestinations.module.scss";

interface FavoriteDestinationsProps {
  data?: Record<string, number> | Array<{
    destination?: string;
    name?: string;
    bookings_count?: number;
    count?: number;
    pct?: string | number;
    [key: string]: any;
  }>;
}

export default function FavoriteDestinations({ data = {} }: FavoriteDestinationsProps) {
  const styleClasses = [styles.dotBlue, styles.dotPurple, styles.dotOrange, styles.dotDarkBlue];

  let destinations: { destination: string; count: number; pct: number }[] = [];

  if (Array.isArray(data)) {
    const totalCount = data.reduce(
      (sum, item) => sum + Number(item.bookings_count ?? item.count ?? 0),
      0
    );
    destinations = data
      .map((item) => {
        const count = Number(item.bookings_count ?? item.count ?? 0);
        const pct =
          item.pct !== undefined
            ? Math.round(Number(item.pct))
            : totalCount > 0
            ? Math.round((count / totalCount) * 100)
            : 0;
        return {
          destination: item.destination || item.name || "Unknown",
          count,
          pct,
        };
      })
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count);
  } else if (data && typeof data === "object") {
    const totalCount = Object.values(data).reduce(
      (a: number, b: any) => a + Number(b || 0),
      0
    );
    destinations = Object.entries(data)
      .map(([destination, countVal]) => {
        const count = Number(countVal || 0);
        const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
        return {
          destination,
          count,
          pct,
        };
      })
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count);
  }

  // Take top 4 destinations for the legend
  const topDestinations = destinations.slice(0, 4);

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
        {topDestinations.length > 0 ? (
          topDestinations.map((item, idx) => (
            <div className={styles.legendItem} key={item.destination}>
              <div className={`${styles.dot} ${styleClasses[idx % styleClasses.length]}`} />
              <div className={styles.text}>
                <strong>{item.pct}%</strong>
                <span>{item.destination}</span>
              </div>
            </div>
          ))
        ) : (
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
