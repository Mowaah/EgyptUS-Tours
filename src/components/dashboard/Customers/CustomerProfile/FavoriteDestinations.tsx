import Image from "next/image";
import styles from "./FavoriteDestinations.module.scss";

export default function FavoriteDestinations() {
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
        <div className={styles.legendItem}>
          <div className={`${styles.dot} ${styles.dotBlue}`} />
          <div className={styles.text}>
            <strong>40%</strong>
            <span>Siwa</span>
          </div>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.dot} ${styles.dotPurple}`} />
          <div className={styles.text}>
            <strong>20%</strong>
            <span>The pyramids</span>
          </div>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.dot} ${styles.dotOrange}`} />
          <div className={styles.text}>
            <strong>30%</strong>
            <span>Sinai</span>
          </div>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.dot} ${styles.dotDarkBlue}`} />
          <div className={styles.text}>
            <strong>10%</strong>
            <span>Siwa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
