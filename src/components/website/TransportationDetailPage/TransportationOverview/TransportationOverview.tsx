import React from 'react';
import Image from 'next/image';
import styles from './TransportationOverview.module.scss';

interface TransportationOverviewProps {
  description: string;
  luggage?: string;
  luggageCapacity?: number;
  passengers: number;
  durationHoursMin?: number;
  durationHoursMax?: number;
}

export default function TransportationOverview({
  description,
  luggage,
  luggageCapacity,
  passengers,
  durationHoursMin,
  durationHoursMax
}: TransportationOverviewProps) {
  let durationText: string | null = null;
  if (durationHoursMin !== undefined && durationHoursMin !== null) {
    if (durationHoursMin === 24 || durationHoursMax === 24) {
      durationText = "Full Day";
    } else if (durationHoursMax && durationHoursMax !== durationHoursMin) {
      durationText = `${durationHoursMin}-${durationHoursMax} hours`;
    } else {
      durationText = durationHoursMin === 1 ? "1 hour" : `${durationHoursMin} hours`;
    }
  } else if (durationHoursMax !== undefined && durationHoursMax !== null) {
    if (durationHoursMax === 24) {
      durationText = "Full Day";
    } else {
      durationText = durationHoursMax === 1 ? "1 hour" : `${durationHoursMax} hours`;
    }
  }

  let luggageText = luggage || "Standard";
  if (luggageCapacity !== undefined && luggageCapacity !== null && luggageCapacity > 0) {
    luggageText = `${luggageCapacity} large suitcase${luggageCapacity > 1 ? "s" : ""}`;
  }

  return (
    <section id="overview" className={styles.section}>
      <h2 className={styles.title}>Overview</h2>
      
      <div className={styles.descriptionWrap}>
        <p className={styles.description}>
          {description || "No overview available."}
        </p>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <div className={`${styles.iconWrap} ${styles.blue}`}>
            <Image src="/images/large-bag.svg" alt="" width={24} height={24} />
          </div>
          <p className={styles.statValue}>{luggageText}</p>
          <p className={styles.statLabel}>Spacious trunk area</p>
        </div>

        <div className={styles.statItem}>
          <div className={`${styles.iconWrap} ${styles.orange}`}>
            <Image src="/images/profile2-orange.svg" alt="" width={24} height={24} />
          </div>
          <p className={styles.statValue}>{passengers} Passenger{passengers === 1 ? "" : "s"}</p>
          <p className={styles.statLabel}>Comfortable seating</p>
        </div>

        {durationText && (
          <div className={styles.statItem}>
            <div className={`${styles.iconWrap} ${styles.blue}`}>
              <Image src="/images/clock2-blue.svg" alt="" width={24} height={24} />
            </div>
            <p className={styles.statValue}>{durationText}</p>
            <p className={styles.statLabel}>Estimated duration</p>
          </div>
        )}
      </div>
    </section>
  );
}
