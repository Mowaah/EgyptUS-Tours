import { TripCard } from "@/components/shared";
import Button from "@/components/shared/Button/Button";
import Image from "next/image";
import type { Trip } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./TripMoreTrips.module.scss";

interface TripMoreTripsProps {
  relatedTrips?: Trip[];
}

export default function TripMoreTrips({ relatedTrips = [] }: TripMoreTripsProps) {
  const { t } = useTranslation("trips");
  if (!relatedTrips || relatedTrips.length === 0) {
    return null;
  }

  return (
    <section id="more-trips" className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.heading}>{t("moreTrips.heading", "More Inspiring Trips")}</h2>
          <p className={styles.subtitle}>
            {t("moreTrips.subtitle", "Didn't find what you were looking for? Explore other highly-rated, expertly-crafted packages perfect for your next trips")}
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
          {t("moreTrips.exploreMore", "Explore More")}
        </Button>
      </div>

      <div className={styles.grid}>
        {relatedTrips.slice(0, 4).map((trip, i) => (
          <TripCard key={i} trip={trip} />
        ))}
      </div>
    </section>
  );
}
