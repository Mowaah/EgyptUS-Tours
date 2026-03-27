"use client";
import { useState } from "react";
import Image from "next/image";
import { Trip } from "@/types";
import Button from "@/components/shared/Button/Button";
import styles from "./TripVIPExperiences.module.scss";

interface Props { trip: Trip; }

const STATS = [
  { value: "12,847", label: "Happy Travelers", sub: "Added these experiences in 2025", color: "blue" },
  { value: "4.9", label: "Average Rating", sub: "Across all add-on experiences", color: "orange" },
  { value: "Free", label: "Flexible Cancellation", sub: "Free cancellation up to 24hrs before", color: "green" },
];

export default function TripVIPExperiences({ trip }: Props) {
  const experiences = trip.vipExperiences ?? [];
  const [added, setAdded] = useState<Set<number>>(new Set());
  if (!experiences.length) return null;

  const toggle = (i: number) =>
    setAdded((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <section id="vip-experiences" className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.heading}>
          <span className={styles.sparkle}>✦</span>
          Make It Extraordinary
          <span className={styles.sparkle}>✦</span>
        </h2>
        <p className={styles.subtitle}>
          96% of our travelers add at least one experience. Don't miss these exclusive upgrades!
        </p>
        <span className={styles.savePill}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FF6600" opacity="0.8"/>
          </svg>
          Book now and save up to $150 on these experiences
        </span>
      </div>

      {/* 2×2 grid */}
      <div className={styles.grid}>
        {experiences.map((exp, i) => {
          const isAdded = added.has(i);
          return (
            <article key={i} className={styles.card}>
              <div className={styles.imageWrap}>
                <Image src={exp.image} alt={exp.title} fill sizes="500px" className={styles.image} />
                {exp.badge && <span className={styles.badge}>{exp.badge}</span>}
                <div className={styles.priceWrap}>
                  <span className={styles.originalPrice}>${exp.originalPrice}</span>
                  <span className={styles.discountedPrice}>${exp.discountedPrice}</span>
                </div>
                <span className={styles.saveBadge}>Save ${exp.savings}</span>
              </div>

              <div className={styles.content}>
                {/* Stars */}
                <div className={styles.stars}>
                  {Array.from({ length: 5 }).map((_, si) => (
                    <svg key={si} width="14" height="14" viewBox="0 0 20 20"
                      fill={si < Math.floor(exp.rating) ? "#FF6600" : "#DDD"}>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                  <span className={styles.ratingVal}>{exp.rating}</span>
                  <span className={styles.reviewCount}>({exp.reviewCount.toLocaleString()} reviews)</span>
                </div>
                <h3 className={styles.title}>{exp.title}</h3>
                <p className={styles.description}>{exp.description}</p>

                <div className={styles.features}>
                  {exp.features.map((f, fi) => (
                    <span key={fi} className={styles.feature}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="#2971E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </span>
                  ))}
                </div>

                <Button
                  variant={isAdded ? "primary" : "outline"}
                  fullWidth
                  className={`${styles.addBtn} ${isAdded ? styles.addBtnActive : ""}`}
                  onClick={() => toggle(i)}
                >
                  {isAdded ? (
                    <>✓ Added to My Trip</>
                  ) : (
                    <>+ Add to My Trip</>
                  )}
                </Button>
                <p className={styles.afterNote}>ⓘ Can be added after booking</p>
              </div>
            </article>
          );
        })}
      </div>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        {STATS.map((s, i) => (
          <div key={i} className={styles.statItem}>
            <div className={`${styles.statIcon} ${styles[s.color]}`}>
              {i === 0 && <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              {i === 1 && <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>}
              {i === 2 && <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <p className={styles.statValue}>{s.value}</p>
            <p className={styles.statLabel}>{s.label}</p>
            <p className={styles.statSub}>{s.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
