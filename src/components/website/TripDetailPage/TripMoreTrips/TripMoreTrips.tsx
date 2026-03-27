import { TripCard } from "@/components/shared";
import type { Trip } from "@/types";
import styles from "./TripMoreTrips.module.scss";

// Mocking 4 identical trips based on visual mockup showing "Luxury 5 days Luxor and Aswan Nile Cruise"
const MORE_TRIPS: Trip[] = Array(4).fill({
  id: "more-trip-mock",
  title: "Luxury 5 days Luxor and Aswan Nile Cruise",
  location: "Luxor & Aswan",
  price: 2000,
  duration: { days: 8, nights: 7 },
  image: "/images/pyramids4.jpg",
} as Trip);

export default function TripMoreTrips() {
  return (
    <section id="more-inspiring-adventures" className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.heading}>More Inspiring Trips</h2>
          <p className={styles.subtitle}>
            Didn't find what you were looking for? Explore other highly-rated, expertly-crafted packages perfect for your next trips
          </p>
        </div>
        <button className={styles.exploreBtn}>
          Explore More
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className={styles.grid}>
        {MORE_TRIPS.map((trip, i) => (
          <TripCard key={i} trip={trip} />
        ))}
      </div>
    </section>
  );
}
