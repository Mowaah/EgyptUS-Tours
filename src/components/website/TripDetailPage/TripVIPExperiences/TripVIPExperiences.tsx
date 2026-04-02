"use client";
import { useState } from "react";
import Image from "next/image";
import { Trip } from "@/types";
import Button from "@/components/shared/Button/Button";
import StarRating from "@/components/shared/StarRating/StarRating";
import styles from "./TripVIPExperiences.module.scss";

interface Props { trip: Trip; }

const STATS = [
  { value: "12,847", label: "Happy Travelers", sub: "Added these experiences in 2025", color: "blue" },
  { value: "4.9", label: "Average Rating", sub: "Across all add-on experiences", color: "orange" },
  { value: "", label: "Flexible Cancellation", sub: "Free cancellation up to 24hrs before", color: "green" },
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
          <Image
            src="/images/special-star.svg"
            alt="Sparkle"
            width={28}
            height={28}
            className={styles.sparkle}
          />
          Make It Extraordinary
          <Image
            src="/images/special-star.svg"
            alt="Sparkle"
            width={28}
            height={28}
            className={styles.sparkle}
          />
        </h2>
        <p className={styles.subtitle}>
          96% of our travelers add at least one experience. Don't miss these exclusive upgrades!
        </p>
        <span className={styles.savePill}>
          <Image src="/images/flame.svg" alt="" width={18} height={18} />
          Book now and save up to $150 on these experiences
        </span>
      </div>

      {/* 2×2 grid */}
      <div className={styles.grid}>
        {experiences.map((exp, i) => {
          const isAdded = added.has(i);
          const badgeClass = exp.badge ?
            `${styles.badge} ${exp.badge.includes("POPULAR") ? styles.badgePopular :
              exp.badge.includes("VALUE") ? styles.badgeValue :
                exp.badge.includes("SPOTS") ? styles.badgeSpots :
                  exp.badge.includes("PREMIUM") ? styles.badgePremium : ""
            }` : styles.badge;

          return (
            <article key={i} className={styles.card}>
              <div className={styles.imageWrap}>
                <Image src={exp.image} alt={exp.title} fill sizes="500px" className={styles.image} />
                {exp.badge && <span className={badgeClass}>{exp.badge}</span>}
                <div className={styles.priceWrap}>
                  <span className={styles.originalPrice}>${exp.originalPrice}</span>
                  <span className={styles.discountedPrice}>${exp.discountedPrice}</span>
                </div>
                <span className={styles.saveBadge}>Save ${exp.savings}</span>
              </div>

              <div className={styles.content}>
                {/* Stars */}
                <div className={styles.ratingBox}>
                  <StarRating
                    value={exp.rating}
                    size={14}
                    valueClassName={styles.ratingVal}
                  />
                  <span className={styles.reviewCount}>({exp.reviewCount.toLocaleString()} reviews)</span>
                </div>
                <h3 className={styles.title}>{exp.title}</h3>
                <p className={styles.description}>{exp.description}</p>

                <div className={styles.features}>
                  {exp.features.map((f, fi) => (
                    <span key={fi} className={styles.feature}>
                      <div className={styles.featureIcon}>
                        <Image src="/images/check-blue.svg" alt="" width={12.5} height={12.5} />
                      </div>
                      {f}
                    </span>
                  ))}
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  className={`${styles.addBtn} ${isAdded ? styles.addBtnActive : ""}`}
                  onClick={() => toggle(i)}
                  icon={
                    isAdded ? (
                      <Image src="/images/tick.svg" alt="" width={20} height={20} />
                    ) : (
                      <Image src="/images/plus.svg" alt="" width={20} height={20} />
                    )
                  }
                  iconPosition="left"
                >
                  {isAdded ? "Added to My Trip" : "Add to My Trip"}
                </Button>
                <p className={styles.afterNote}>
                  <Image src="/images/clock2.svg" alt="" width={12} height={12} style={{ marginTop: "1px" }} />
                  Can be added after booking
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        {STATS.map((s, i) => (
          <div key={i} className={`${styles.statItem} ${styles[s.color + "Bg"]}`}>
            <div className={`${styles.statIcon} ${styles[s.color]}`}>
              {i === 0 && (
                <Image src="/images/profile2.svg" alt="" width={24} height={24} className={styles.iconImg} />
              )}
              {i === 1 && (
                <Image src="/images/whychooseus/star.svg" alt="" width={24} height={24} className={styles.iconImg} />
              )}
              {i === 2 && (
                <Image src="/images/special-star.svg" alt="" width={24} height={24} className={styles.iconImg} />
              )}
            </div>
            <p className={styles.statLabel}>
              {s.value && `${s.value} `}{s.label}
            </p>
            <p className={styles.statSub}>{s.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
