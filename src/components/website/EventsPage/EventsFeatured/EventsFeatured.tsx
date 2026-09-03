"use client";

import React from 'react';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './EventsFeatured.module.scss';

export default function EventsFeatured() {
  const { t } = useTranslation("events");

  const highlightPills = [
    t("featured.pills.cairo", "Cairo, Luxor & Aswan"),
    t("featured.pills.jerusalem", "Jerusalem Exploration"),
    t("featured.pills.hotel", "Hotel Accommodation"),
    t("featured.pills.flights", "Flight Ticket Arrangements"),
    t("featured.pills.egyptologists", "Professional Egyptologists"),
    t("featured.pills.meetings", "Business Meetings"),
  ];

  const checklistItems = [
    t("featured.checklist.coordination", "Seamless Group Coordination"),
    t("featured.checklist.businessLeisure", "Business & Leisure Successfully Combined"),
    t("featured.checklist.endToEnd", "End-to-End Travel Arrangements"),
    t("featured.checklist.onGround", "Smooth On-Ground Support"),
  ];

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t("featured.sectionTitle", "Work. Connect. Experience Egypt.")}</h2>
        <p className={styles.subtitle}>
          {t("featured.sectionSubtitle", "Bring your team together through a seamless blend of business & team experiences")}
        </p>
      </div>

      <div className={styles.card}>
        <div className={styles.layout}>
          {/* ── Left: Single Image ── */}
          <div className={styles.imageWrap}>
            <Image
              src="/images/case-study.png"
              alt={t("featured.eventTitle", "60 American Travelers")}
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
                <h3 className={styles.eventTitle}>{t("featured.eventTitle", "60 American Travelers")}</h3>
                <p className={styles.eventSubtitle}>{t("featured.eventSubtitle", "Egypt & Jerusalem Group Travel Experience")}</p>
              </div>

              <div className={styles.highlights}>
                <div className={styles.highlightsHeader}>
                  <span className={styles.highlightsTitle}>{t("featured.highlights", "Highlights")}</span>
                </div>

                <div className={styles.pills}>
                  {highlightPills.map((pill) => (
                    <div key={pill} className={styles.pill}>
                      <Image src="/images/star-motion-blue.svg" alt="" width={22} height={22} />
                      <span>{pill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <ul className={styles.checkList}>
              {checklistItems.map((item) => (
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
