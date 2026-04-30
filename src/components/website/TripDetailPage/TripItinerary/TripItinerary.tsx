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

      {/* ── DESKTOP LAYOUT (Horizontal timeline + Detail card) ── */}
      <div className={styles.desktopLayout}>
        {/* Day selector timeline */}
        <div className={styles.timeline}>
          {days.map((day, i) => (
            <button
              key={i}
              className={`${styles.dayBtn} ${active === i ? styles.dayBtnActive : ""}`}
              onClick={() => setActive(i)}
            >
              <span className={`${styles.dayLabel} ${i <= active ? styles.dayLabelActive : ""}`}>
                Day {day.day}
              </span>
              <div className={`
                ${styles.thumbCircle}
                ${i <= active ? styles.thumbCircleVisited : styles.thumbCircleInactive}
                ${i === active ? styles.thumbCircleSelected : ''}
              `}>
                {day.image && (
                  <Image src={day.image} alt={day.title} fill sizes="100px" className={styles.thumbImg} />
                )}
              </div>
              <div className={styles.connectorWrap}>
                {i > 0 && <div className={styles.connectorTrack} />}
                {i > 0 && i <= active && <div className={styles.connectorFill} />}
                <div className={`${styles.connectorDot} ${i <= active ? styles.connectorDotActive : ''}`} />
              </div>
              <div className={styles.dayInfo}>
                <p className={styles.dayTitle}>{day.title}</p>
                {day.subtitle && <p className={styles.daySubtitle}>{day.subtitle}</p>}
              </div>
            </button>
          ))}
        </div>

        {/* Active day detail */}
        {current && (
          <div className={styles.detail}>
            {/* Left: image */}
            <div className={styles.detailImg}>
              {current.image && (
                <Image src={current.image} alt={current.title} fill sizes="600px" className={styles.detailImgInner} />
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
                <span className={styles.metaItem}>
                  <Image src="/images/clock-blue.svg" alt="Duration" width={19} height={19} />
                  {current.durationHours} hours
                </span>
                <span className={styles.metaItem}>
                  <Image src="/images/meal-orange.svg" alt="Meals" width={19} height={19} />
                  {current.meals} meals
                </span>
                <span className={styles.metaItem}>
                  <Image src="/images/photo.svg" alt="Photos" width={17} height={17} />
                  Photos
                </span>
              </div>

              <p className={styles.detailDesc}>{current.description}</p>

              {current.highlights && current.highlights.length > 0 && (
                <div className={styles.highlights}>
                  <h3 className={styles.highlightsTitle}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Today's Highlights
                  </h3>
                  <ul className={styles.highlightsList}>
                    {current.highlights.map((h, hi) => (
                      <li key={hi} className={styles.highlightItem}>
                        <Image src="/images/location.svg" alt="Location" width={17} height={17} />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── MOBILE LAYOUT (Vertical Accordion) ── */}
      <div className={styles.mobileLayout}>
        <div className={styles.mobileTimelineContainer}>
          {days.map((day, i) => {
            const isActive = active === i;
            return (
              <div key={i} className={styles.mobileDayWrapper}>
                {/* Timeline line and dot */}
                <div className={styles.mobileTimelineGraphics}>
                  <div className={styles.mobileLine} />
                  <div className={`${styles.mobileDot} ${isActive ? styles.mobileDotActive : ''}`} />
                </div>
                
                <div className={styles.mobileDayContent}>
                  <span className={`${styles.mobileDayLabel} ${isActive ? styles.mobileDayLabelActive : ''}`}>
                    Day {day.day}
                  </span>
                  
                  <div 
                    className={`${styles.mobileCard} ${isActive ? styles.mobileCardActive : ''}`}
                    onClick={() => setActive(i)}
                  >
                    {!isActive ? (
                      /* Collapsed View */
                      <div className={styles.mobileCollapsed}>
                        <div className={styles.mobileCollapsedThumb}>
                          {day.image && (
                            <Image src={day.image} alt={day.title} fill sizes="50px" className={styles.thumbImg} />
                          )}
                        </div>
                        <div className={styles.mobileCollapsedText}>
                          <p className={styles.mobileCollapsedTitle}>{day.title}</p>
                          {day.subtitle && <p className={styles.mobileCollapsedSubtitle}>{day.subtitle}</p>}
                        </div>
                        <svg className={styles.mobileChevron} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    ) : (
                      /* Expanded View */
                      <div className={styles.mobileExpanded}>
                        <div className={styles.mobileExpandedImg}>
                          {day.image && (
                            <Image src={day.image} alt={day.title} fill sizes="100vw" className={styles.detailImgInner} />
                          )}
                          {day.value && (
                            <span className={styles.mobileValueBadge}>${day.value.toLocaleString()} VALUE</span>
                          )}
                          <div className={styles.mobileImgOverlay}>
                            <p className={styles.mobileImgTitle}>{day.title}</p>
                          </div>
                        </div>

                        <div className={styles.mobileExpandedInfo}>
                          <div className={styles.metaRow}>
                            <span className={styles.metaItem}>
                              <Image src="/images/clock-blue.svg" alt="Duration" width={16} height={16} />
                              {day.durationHours} hours
                            </span>
                            <span className={styles.metaItem}>
                              <Image src="/images/meal-orange.svg" alt="Meals" width={16} height={16} />
                              {day.meals} meals
                            </span>
                            <span className={styles.metaItem}>
                              <Image src="/images/photo.svg" alt="Photos" width={14} height={14} />
                              Photos
                            </span>
                          </div>

                          <p className={styles.detailDesc}>{day.description}</p>

                          {day.highlights && day.highlights.length > 0 && (
                            <div className={styles.highlights}>
                              <h3 className={styles.highlightsTitle}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF6600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                                Today's Highlights
                              </h3>
                              <ul className={styles.highlightsList}>
                                {day.highlights.map((h, hi) => (
                                  <li key={hi} className={styles.highlightItem}>
                                    <Image src="/images/location.svg" alt="Location" width={15} height={15} />
                                    {h}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
