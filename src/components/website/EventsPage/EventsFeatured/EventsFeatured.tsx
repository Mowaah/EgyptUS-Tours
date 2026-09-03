import React from 'react';
import Image from 'next/image';
import styles from './EventsFeatured.module.scss';

const HIGHLIGHT_PILLS = [
  "Cairo, Luxor & Aswan",
  "Jerusalem Exploration",
  "Hotel Accommodation",
  "Flight Ticket Arrangements",
  "Professional Egyptologists",
  "Business Meetings",
];

const CHECKLIST_ITEMS = [
  "Seamless Group Coordination",
  "Business & Leisure Successfully Combined",
  "End-to-End Travel Arrangements",
  "Smooth On-Ground Support",
];

export default function EventsFeatured() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Work. Connect. Experience Egypt.</h2>
        <p className={styles.subtitle}>
          Bring your team together through a seamless blend of business &amp; team experiences
        </p>
      </div>

      <div className={styles.card}>
        <div className={styles.layout}>
          {/* ── Left: Single Image ── */}
          <div className={styles.imageWrap}>
            <Image
              src="/images/case-study.png"
              alt="60 American Travelers"
              fill
              sizes="(max-width: 1024px) 100vw, 629px"
              className={styles.image}
              priority
            />
          </div>

          {/* ── Right: Details (Frame 20) ── */}
          <div className={styles.details}>
            <div className={styles.topContent}>
              <div className={styles.eventHeader}>
                <h3 className={styles.eventTitle}>60 American Travelers</h3>
                <p className={styles.eventSubtitle}>Egypt &amp; Jerusalem Group Travel Experience</p>
              </div>

              <div className={styles.highlights}>
                <div className={styles.highlightsHeader}>
                  <span className={styles.highlightsTitle}>Highlights</span>
                </div>

                <div className={styles.pills}>
                  {HIGHLIGHT_PILLS.map((pill) => (
                    <div key={pill} className={styles.pill}>
                      <Image src="/images/star-motion-blue.svg" alt="" width={22} height={22} />
                      <span>{pill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <ul className={styles.checkList}>
              {CHECKLIST_ITEMS.map((item) => (
                <li key={item} className={styles.checkItem}>
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
