"use client";

import { useState } from "react";
import Image from "next/image";
import { Trip } from "@/types";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./TripPricing.module.scss";

interface TripPricingProps {
  trip: Trip;
}

export default function TripPricing({ trip }: TripPricingProps) {
  const { formatCurrency } = useCurrency();
  const { t } = useTranslation("trips");
  const allPricing = trip.pricing ?? [];
  const hasValidTiers = (col: any) => col.tiers && col.tiers.some((t: any) => (t.price || 0) > 0);

  const hasPrivate = allPricing.some((col) => col.tourType?.toLowerCase() === "private" && hasValidTiers(col));
  const hasGroup = allPricing.some((col) => col.tourType?.toLowerCase() === "group" && hasValidTiers(col));

  const [pricingType, setPricingType] = useState<"private" | "group">(hasPrivate ? "private" : "group");

  // Filter pricing by tourType matching the selected tab and only include valid columns
  const matchingPricing = allPricing.filter(
    (col) => col.tourType?.toLowerCase() === pricingType && hasValidTiers(col)
  );

  const validAllPricing = allPricing.filter(hasValidTiers);

  const displayPricing = matchingPricing.length > 0
    ? matchingPricing
    : validAllPricing.length > 0
    ? validAllPricing
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
          <h2 className={styles.heading}>{t("pricing.heading", "Prices & Accommodation")}</h2>
          <p className={styles.subtitle}>
            {t("pricing.subtitle", "Explore detailed pricing and accommodation options tailored to your selected trip")}
          </p>
        </div>

        {hasPrivate && hasGroup && (
          <div className={styles.toggleWrapper}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${pricingType === "private" ? styles.toggleBtnActive : ""}`}
              onClick={() => setPricingType("private")}
            >
              {t("pricing.privateTour", "Private Tour")}
            </button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${pricingType === "group" ? styles.toggleBtnActive : ""}`}
              onClick={() => setPricingType("group")}
            >
              {t("pricing.groupTour", "Group Tour")}
            </button>
          </div>
        )}

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
                    <p className={styles.tierPrice}>{formatCurrency(tier.price)}</p>
                  </div>
                  <p className={styles.tierLabel}>
                    {t("pricing.perPersonIn", "Per Person in {label}").replace("{label}", tier.label)}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
