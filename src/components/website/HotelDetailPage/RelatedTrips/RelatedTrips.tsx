import { TripCard, Button } from "@/components/shared";
import Image from "next/image";
import { Hotel, Trip } from "@/types";
import { mockTrips } from "@/lib/mockTrips"; // Assuming this exists or using a portion
import styles from "./RelatedTrips.module.scss";

interface RelatedTripsProps {
  hotel: Hotel;
}

export default function RelatedTrips({ hotel }: RelatedTripsProps) {
  // Use first 4 mock trips as "related" for now
  const trips = mockTrips.slice(0, 4);

  return (
    <section id="related-trips" className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.heading}>Related Trips</h2>
          <p className={styles.subtitle}>
            Explore tours and packages that include a stay at this hotel.
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        {trips.map((trip: Trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </section>
  );
}
