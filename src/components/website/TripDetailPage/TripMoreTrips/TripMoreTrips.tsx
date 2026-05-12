import { TripCard } from "@/components/shared";
import Button from "@/components/shared/Button/Button";
import Image from "next/image";
import type { Trip } from "@/types";
import styles from "./TripMoreTrips.module.scss";

// Mocking 8 identical trips based on visual mockup showing "Luxury 5 days Luxor and Aswan Nile Cruise"
const MORE_TRIPS: Trip[] = Array(8).fill({
  id: "more-trip-mock",
  title: "Luxury 5 days Luxor and Aswan Nile Cruise",
  location: "Luxor & Aswan",
  price: 2000,
  duration: { days: 8, nights: 7 },
  image: "/images/pyramids4.jpg",
} as Trip);

export default function TripMoreTrips() {
  return (
    <section id="more-trips" className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.heading}>More Inspiring Trips</h2>
          <p className={styles.subtitle}>
            Didn't find what you were looking for? Explore other highly-rated, expertly-crafted packages perfect for your next trips
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={
            <Image
              src="/images/arrows/arrow-right.svg"
              alt=""
              width={24}
              height={24}
              style={{ marginTop: "4px" }}
            />
          }
        >
          Explore More
        </Button>
      </div>

      <div className={styles.grid}>
        {MORE_TRIPS.map((trip, i) => (
          <TripCard key={i} trip={trip} />
        ))}
      </div>
    </section>
  );
}
