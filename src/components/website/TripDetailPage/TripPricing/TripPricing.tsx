"use client";

import { useState } from "react";
import Image from "next/image";
import { Trip } from "@/types";
import styles from "./TripPricing.module.scss";

interface TripPricingProps {
  trip: Trip;
}

export default function TripPricing({ trip }: TripPricingProps) {
  const [pricingType, setPricingType] = useState<"private" | "group">("private");
  const allPricing = trip.pricing ?? [];

  // Filter pricing by tourType matching the selected tab
  const matchingPricing = allPricing.filter(
    (col) => col.tourType?.toLowerCase() === pricingType
  );

  const displayPricing = matchingPricing.length > 0
    ? matchingPricing
    : allPricing.length > 0
    ? allPricing
    : [];

  if (!displayPricing.length) return null;

  return (
    <section id="prices-accommodation" className={styles.section}>
      <div className={styles.decoration} aria-hidden>
        <Image
          src="/images/myteneltayara.svg"
          alt=""
          width={376}
          height={207}
          className={styles.decorationImg}
        />
      </div>

      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Prices &amp; Accommodation</h2>
          <p className={styles.subtitle}>
            Explore detailed pricing and accommodation options tailored to your selected trip
          </p>
        </div>

        <div className={styles.toggleWrapper}>
          <button
            type="button"
            className={`${styles.toggleBtn} ${pricingType === "private" ? styles.toggleBtnActive : ""}`}
            onClick={() => setPricingType("private")}
          >
            Private Tour
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${pricingType === "group" ? styles.toggleBtnActive : ""}`}
            onClick={() => setPricingType("group")}
          >
            Group Tour
          </button>
        </div>

        <div className={styles.grid}>
          {displayPricing.map((col, ci) => (
            <div key={ci} className={styles.column}>
              <h3 className={styles.season}>{col.season}</h3>
              {col.tiers.map((tier, ti) => (
                <div key={ti} className={styles.tier}>
                  <div className={styles.tierHeader}>
                    <div className={styles.tierIconWrap}>
                      <Image src="/images/currency.svg" alt="" width={22} height={22} />
                    </div>
                    <p className={styles.tierPrice}>US$ {tier.price.toLocaleString()}</p>
                  </div>
                  <p className={styles.tierLabel}>{tier.label}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
