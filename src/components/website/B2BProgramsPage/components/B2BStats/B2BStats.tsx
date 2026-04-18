import React from 'react';
import Image from 'next/image';
import styles from './B2BStats.module.scss';

const STATS = [
  { value: "120+", label: "Corporate Events" },
  { value: "+15", label: "Client Satisfaction" },
  { value: "97%", label: "Client Satisfaction Rate" },
];

const BADGES_ROW1 = [
  "Dedicated corporate account manager",
  "5-Star hotel partnerships",
  "Exclusive venue access",
  "Full transportation & logistics",
  "Transparent contracts",
];

const BADGES_ROW2 = [
  "Multilingual team",
  "24/7 operational support",
];



export default function B2BStats() {
  return (
    <section className={styles.section}>
      {/* Dotted airplane decoration — top right */}
      <div className={styles.decoration} aria-hidden="true">
        <Image src="/images/dotted-line3.svg" alt="" width={355} height={266} />
      </div>

      <div className={styles.header}>
        <h2 className={styles.title}>Why Us</h2>
        <p className={styles.subtitle}>TRUSTED BY LEADING ORGANIZATIONS</p>
      </div>

      <div className={styles.statsWrapper}>
        <div className={styles.statsGrid}>
          {STATS.map((stat, idx) => (
            <div key={idx} className={styles.statItem}>
              <span className={styles.value}>{stat.value}</span>
              <span className={styles.label}>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.badgesCard}>
          <div className={styles.badgesRow}>
            {BADGES_ROW1.map((text, idx) => (
              <div key={idx} className={styles.badge}>
                <div className={styles.iconWrap}>
                  <Image src="/images/star-blue.svg" alt="" width={17} height={16} />
                </div>
                <span className={styles.badgeText}>{text}</span>
              </div>
            ))}
          </div>
          <div className={styles.badgesRow}>
            {BADGES_ROW2.map((text, idx) => (
              <div key={idx} className={styles.badge}>
                <div className={styles.iconWrap}>
                  <Image src="/images/star-blue.svg" alt="" width={17} height={16} />
                </div>
                <span className={styles.badgeText}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
