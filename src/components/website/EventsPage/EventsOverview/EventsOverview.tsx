import React from 'react';
import Image from 'next/image';
import EventsBookingWidget from '../EventsBookingWidget/EventsBookingWidget';
import styles from './EventsOverview.module.scss';

export default function EventsOverview() {
  return (
    <section id="overview" className={styles.section}>
      <div className={styles.layout}>
        {/* ── Left: Content ── */}
        <div className={styles.content}>
          <h2 className={styles.title}>Overview</h2>
          
          <div className={styles.descriptionWrap}>
            <p className={styles.description}>
              Egypt is an ideal destination for MICE events, offering a unique combination of strategic location,
              competitive pricing, and rich cultural experiences. As a gateway between Africa, Asia, and
              Europe, Egypt provides excellent international connectivity and world-class conference facilities.
            </p>
            <p className={styles.description}>
              Our professional event management teams ensure seamless execution from concept to
              completion, while the country's iconic historical backdrop creates memorable experiences for
              delegates. With USD-friendly pricing and luxury 5-star accommodations, Egypt delivers outstanding
              value for international corporate events.
            </p>
          </div>

          <div className={styles.stats}>
            <div className={styles.statCard}>
              <div className={styles.iconWrap}>
                <Image src="/images/mice/meetings.svg" alt="" width={32} height={32} />
              </div>
              <p className={styles.statValue}>2,500</p>
              <p className={styles.statLabel}>Max capacity</p>
            </div>

            <div className={styles.statCard}>
              <div className={styles.iconWrap}>
                <Image src="/images/exhibition.svg" alt="" width={32} height={32} />
              </div>
              <p className={styles.statValue}>5,000m²</p>
              <p className={styles.statLabel}>Exhibition space</p>
            </div>

            <div className={styles.statCard}>
              <div className={styles.iconWrap}>
                <Image src="/images/languages.svg" alt="" width={32} height={32} />
              </div>
              <p className={styles.statValue}>12+</p>
              <p className={styles.statLabel}>Languages</p>
            </div>
          </div>
        </div>

        {/* ── Right: Sidebar ── */}
        <aside className={styles.sidebar}>
          <EventsBookingWidget />
        </aside>
      </div>
    </section>
  );
}
