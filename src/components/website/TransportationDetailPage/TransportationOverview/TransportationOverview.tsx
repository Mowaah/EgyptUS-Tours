import React from 'react';
import Image from 'next/image';
import styles from './TransportationOverview.module.scss';

interface TransportationOverviewProps {
  description: string;
  luggage: string;
  passengers: number;
  durationHoursMin?: number;
  durationHoursMax?: number;
}

export default function TransportationOverview({
  description,
  luggage,
  passengers,
  durationHoursMin,
  durationHoursMax
}: TransportationOverviewProps) {
  const durationText = durationHoursMin && durationHoursMax
    ? `${durationHoursMin}-${durationHoursMax} hours`
    : durationHoursMin
    ? `${durationHoursMin}+ hours`
    : null;

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
          <p className={styles.statValue}>{luggage || "Standard"}</p>
          <p className={styles.statLabel}>Spacious trunk area</p>
        </div>

        <div className={styles.statItem}>
          <div className={`${styles.iconWrap} ${styles.orange}`}>
            <Image src="/images/profile2-orange.svg" alt="" width={24} height={24} />
          </div>
          <p className={styles.statValue}>{passengers} Passengers</p>
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
