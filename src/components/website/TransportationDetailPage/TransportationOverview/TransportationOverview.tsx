import React from 'react';
import Image from 'next/image';
import styles from './TransportationOverview.module.scss';

export default function TransportationOverview() {
  return (
    <section id="overview" className={styles.section}>
      <h2 className={styles.title}>Overview</h2>
      
      <div className={styles.descriptionWrap}>
        <p className={styles.description}>
          Experience the pinnacle of luxury travel with our Mercedes S-Class. This premium sedan combines elegant design with cutting-edge technology, offering an unparalleled journey through Egypt's historic destinations.
        </p>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <div className={`${styles.iconWrap} ${styles.blue}`}>
            <Image src="/images/large-bag.svg" alt="" width={24} height={24} />
          </div>
          <p className={styles.statValue}>2 Large Bags</p>
          <p className={styles.statLabel}>Spacious trunk area</p>
        </div>

        <div className={styles.statItem}>
          <div className={`${styles.iconWrap} ${styles.orange}`}>
            <Image src="/images/profile2-orange.svg" alt="" width={24} height={24} />
          </div>
          <p className={styles.statValue}>3 Passengers</p>
          <p className={styles.statLabel}>Comfortable seating</p>
        </div>

        <div className={styles.statItem}>
          <div className={`${styles.iconWrap} ${styles.blue}`}>
            <Image src="/images/clock2-blue.svg" alt="" width={24} height={24} />
          </div>
          <p className={styles.statValue}>7-8 hours</p>
          <p className={styles.statLabel}>Estimated duration</p>
        </div>
      </div>
    </section>
  );
}
