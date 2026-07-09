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
        <div className={styles.timelineContainer}>
          {Array.from({ length: Math.ceil(days.length / 5) }).map((_, rowIndex) => {
            const chunk = days.slice(rowIndex * 5, (rowIndex + 1) * 5);
            const isLtr = rowIndex % 2 === 0;
            const hasNextRow = (rowIndex + 1) * 5 < days.length;
            
            // Check if the connection curve between this row and the next should be "active" (filled)
            // It is active if the currently selected active day is on or after the first day of the NEXT row.
            const nextRowFirstDayIndex = (rowIndex + 1) * 5;
            const isCurveActive = active >= nextRowFirstDayIndex;

            return (
              <div key={rowIndex} className={`${styles.timelineRow} ${isLtr ? styles.ltr : styles.rtl}`}>
                {chunk.map((day, chunkIndex) => {
                  const i = rowIndex * 5 + chunkIndex;
                  // For styling the connector inside the row
                  // The line goes up to the *next* item. So if i < days.length - 1, we show a line.
                  // But wait, the line in the item itself should only go to the edge if it's the last in the chunk!
                  const isLastInChunk = chunkIndex === chunk.length - 1;
                  const isLastTotal = i === days.length - 1;

                  return (
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
                        {/* Extension for the very first item (Day 1) */}
                        {(i === 0) && (
                          <div className={styles.connectorExtensionStart} />
                        )}
                        
                        {/* Track to the next item in the same row. 
                            We omit this for the last item in a chunk because the curve handles the outbound path. */}
                        {(!isLastInChunk && !isLastTotal) && <div className={styles.connectorTrack} />}
                        
                        {/* Active fill up to the active day */}
                        {(i < active && !isLastInChunk) && <div className={styles.connectorFill} />}
                        {(i === active && !isLastInChunk) && <div className={styles.connectorFillActiveDay} />}
                        
                        
                        {/* Extension for the very last item */}
                        {(isLastTotal) && (
                          <div className={`${styles.connectorExtensionEnd} ${i <= active ? styles.connectorExtensionEndActive : styles.connectorTrackBase}`} />
                        )}

                        <div className={`${styles.connectorDot} ${i <= active ? styles.connectorDotActive : ''}`} />
                      </div>
                      
                      <div className={styles.dayInfo}>
                        <p className={styles.dayTitle}>{day.title}</p>
                        {day.subtitle && <p className={styles.daySubtitle}>{day.subtitle}</p>}
                      </div>
                    </button>
                  );
                })}

                {/* Fill empty spots to keep flex-basis 20% aligned */}
                {chunk.length < 5 && Array.from({ length: 5 - chunk.length }).map((_, emptyIdx) => (
                  <div key={`empty-${emptyIdx}`} className={styles.dayBtnEmpty} />
                ))}

                {/* The curved connector to the next row */}
                {hasNextRow && (
                  <div className={`${styles.rowCurve} ${isCurveActive ? styles.rowCurveActive : ''}`} />
                )}
              </div>
            );
          })}
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
                        <Image src="/images/location-blue2.svg" alt="Location" width={17} height={17} />
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
                  <div className={`${styles.mobileLine} ${i < active ? styles.mobileLineActive : ''}`} />
                  <div className={`${styles.mobileDot} ${i <= active ? styles.mobileDotActive : ''}`} />
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
