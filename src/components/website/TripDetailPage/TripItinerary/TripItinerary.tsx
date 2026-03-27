"use client";
import { useState } from "react";
import Image from "next/image";
import { Trip } from "@/types";
import styles from "./TripItinerary.module.scss";

interface Props { trip: Trip; }

export default function TripItinerary({ trip }: Props) {
  const days = trip.itinerary ?? [];
  const [active, setActive] = useState(0);
  if (!days.length) return null;

  const totalValue = days.reduce((sum, d) => sum + (d.value ?? 0), 0);
  const current = days[active];

  return (
    <section id="itinerary" className={styles.section}>
      {/* Header */}
      <div className={styles.headerWrap}>
        <span className={styles.satisfactionPill}>97% Traveler Satisfaction Rate</span>
        <h2 className={styles.heading}>Day by Day Itinerary</h2>
        <p className={styles.subtitle}>
          Experience{" "}
          <span className={styles.valueHighlight}>${totalValue.toLocaleString()} worth of unforgettable moments</span>{" "}
          along the legendary Nile River
        </p>
      </div>

      {/* Day selector timeline */}
      <div className={styles.timeline}>
        {days.map((day, i) => (
          <button
            key={i}
            className={`${styles.dayBtn} ${active === i ? styles.dayBtnActive : ""}`}
            onClick={() => setActive(i)}
          >
            <span className={`${styles.dayLabel} ${active === i ? styles.dayLabelActive : ""}`}>
              Day {day.day}
            </span>
            <div className={`${styles.thumbCircle} ${active === i ? styles.thumbCircleActive : ""}`}>
              {day.image && (
                <Image src={day.image} alt={day.title} fill sizes="80px" className={styles.thumbImg} />
              )}
            </div>
            <div className={styles.connectorWrap}>
              <div className={`${styles.connector} ${active === i || active === i + 1 ? styles.connectorActive : ""}`} />
              <div className={`${styles.connectorDot} ${active === i ? styles.connectorDotActive : ""}`} />
            </div>
            <p className={styles.dayTitle}>{day.title}</p>
            {day.subtitle && <p className={styles.daySubtitle}>{day.subtitle}</p>}
          </button>
        ))}
      </div>

      {/* Active day detail */}
      {current && (
        <div className={styles.detail}>
          {/* Left: image */}
          <div className={styles.detailImg}>
            {current.image && (
              <Image src={current.image} alt={current.title} fill sizes="500px" className={styles.detailImgInner} />
            )}
            {current.value && (
              <span className={styles.valueBadge}>${current.value.toLocaleString()} VALUE</span>
            )}
            <div className={styles.detailOverlay}>
              <p className={styles.overlayDay}>Day {current.day}</p>
              <p className={styles.overlayTitle}>{current.title}</p>
            </div>
          </div>

          {/* Right: info */}
          <div className={styles.detailInfo}>
            <div className={styles.metaRow}>
              {current.durationHours && (
                <span className={styles.metaItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#2971E6" strokeWidth="1.8"/>
                    <path d="M12 7v5l3 3" stroke="#2971E6" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  {current.durationHours} hours
                </span>
              )}
              {current.meals && (
                <span className={styles.metaItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 11l19-9-9 19-2-8-8-2z" stroke="#2971E6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {current.meals} meals
                </span>
              )}
              <span className={styles.metaItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="#2971E6" strokeWidth="1.8"/>
                  <circle cx="8.5" cy="8.5" r="1.5" fill="#2971E6"/>
                  <path d="M21 15l-5-5L5 21" stroke="#2971E6" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                Photos
              </span>
            </div>

            <p className={styles.detailDesc}>{current.description}</p>

            {current.highlights && current.highlights.length > 0 && (
              <div className={styles.highlights}>
                <h3 className={styles.highlightsTitle}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="#FF6600" fill="#FF6600" opacity="0.2" strokeWidth="1.5"/>
                  </svg>
                  Today's Highlights
                </h3>
                <ul className={styles.highlightsList}>
                  {current.highlights.map((h, hi) => (
                    <li key={hi} className={styles.highlightItem}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                      </svg>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
