import React from 'react';
import Image from 'next/image';
import styles from './B2BCaseStudy.module.scss';

export default function B2BCaseStudy() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Case Study Spotlight</h2>
        <p className={styles.subtitle}>Real results from real corporate events</p>
      </div>

      <div className={styles.card}>
        <div className={styles.layout}>
          {/* ── Left: Image ── */}
          <div className={styles.imageWrap}>
            <Image
              src="/images/case-study.jpg"
              alt="Case Study"
              fill
              sizes="647px"
              className={styles.image}
            />
          </div>

          {/* ── Right: Details (same as EventsFeatured) ── */}
          <div className={styles.details}>
            <div className={styles.eventHeader}>
              <h3 className={styles.eventTitle}>60 Executives</h3>
              <p className={styles.eventSubtitle}>3-Day Corporate Leadership Retreat</p>
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
                  <span>Building Desert Experience</span>
                </div>
                <div className={styles.pill}>
                  <Image src="/images/grid-view2.svg" alt="" width={20} height={20} />
                  <span>Gala Dinner on the Beach</span>
                </div>
              </div>
            </div>

            <ul className={styles.checkList}>
              {[
                "100% Client Satisfaction",
                "Seamless Logistics Execution",
                "Delivered Under Budget",
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
