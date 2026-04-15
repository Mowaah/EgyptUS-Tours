import React from 'react';
import Image from 'next/image';
import styles from './EventsFeatured.module.scss';

export default function EventsFeatured() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Work .. Play .. Paradise.</h2>
        <p className={styles.subtitle}>
          Elevate your team's productivity with a mix of professional logistics and Red Sea luxury in El Gouna.
        </p>
      </div>

      <div className={styles.card}>
        <div className={styles.layout}>
          {/* ── Left: Stacked Images ── */}
          <div className={styles.imageStack}>
            <div className={styles.imageLayer3} />
            <div className={styles.imageLayer2} />
            <div className={styles.imageLayer1}>
              <div className={styles.tag}>FEATURED EVENT</div>
              <div className={styles.imageInfo}>
                <h4 className={styles.day}>Day 1</h4>
                <p className={styles.venue}>Beach Gala Dinner</p>
              </div>
            </div>
          </div>

          {/* ── Right: Details ── */}
          <div className={styles.details}>
            <div className={styles.eventHeader}>
              <h3 className={styles.eventTitle}>Blue Horizon Summit</h3>
              <p className={styles.eventSubtitle}>60 Executives - Team Building - Desert Experience - Beach Gala Dinner</p>
            </div>

            <div className={styles.highlights}>
              <div className={styles.highlightsHeader}>
                <Image src="/images/star-yellow2.svg" alt="" width={20} height={20} />
                <span className={styles.highlightsTitle}>Highlights</span>
              </div>

              <div className={styles.pills}>
                <div className={styles.pill}>
                  <Image src="/images/location.svg" alt="" width={20} height={20} />
                  <span>El Gouna Egypt</span>
                </div>
                <div className={styles.pill}>
                  <Image src="/images/chart.svg" alt="" width={20} height={20} />
                  <span>5-Star Resort</span>
                </div>
                <div className={styles.pill}>
                  <Image src="/images/profile-blue.svg" alt="" width={20} height={20} />
                  <span>60 Executives</span>
                </div>
                <div className={styles.pill}>
                  <Image src="/images/grid-view2.svg" alt="" width={20} height={20} />
                  <span>3-Day Program</span>
                </div>
              </div>
            </div>

            <ul className={styles.checkList}>
              {[
                "100% client satisfaction Score",
                "Seamless Logistics & Coordination",
                "Delivered Under Budget",
                "Proximity to venues",
              ].map((item, idx) => (
                <li key={idx} className={styles.checkItem}>
                  <div className={styles.checkIcon}>
                    <Image src="/images/check-blue.svg" alt="" width={10} height={10} />
                  </div>
                  <span className={styles.checkText}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
