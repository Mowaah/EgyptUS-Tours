"use client";

import Image from "next/image";
import styles from "./page.module.scss";
import { useTripDetailContext } from "../layout";

interface SeasonTier {
  id?: number | string;
  label?: string;
  price?: string;
}

interface SeasonPricing {
  id?: number | string;
  tour_type?: string;
  season_label?: string;
  start_date?: string | null;
  end_date?: string | null;
  tiers?: SeasonTier[];
}

export default function TripPricingPage() {
  const { trip, loading } = useTripDetailContext();

  if (loading || !trip) {
    return <div style={{ padding: "24px" }}>Loading...</div>;
  }

  const seasonPricings: SeasonPricing[] = trip.season_pricings || [];

  if (seasonPricings.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.titleRow}>
          <div className={styles.iconWrap}>
            <Image src="/images/dashboard/catalog/trips/pricing.svg" alt="" width={20} height={20} />
          </div>
          <h2>Pricing</h2>
        </div>
        <p style={{ color: "#9ca3af", fontSize: "14px", padding: "24px 0" }}>No pricing seasons have been added yet.</p>
      </div>
    );
  }

  // Group by tour_type
  const byTourType = seasonPricings.reduce<Record<string, SeasonPricing[]>>((acc, s) => {
    const key = s.tour_type || "General";
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <div className={styles.iconWrap}>
          <Image src="/images/dashboard/catalog/trips/pricing.svg" alt="" width={20} height={20} />
        </div>
        <h2>Pricing</h2>
      </div>

      {Object.entries(byTourType).map(([tourType, seasons]) => {
        const basePrice =
          tourType === "private"
            ? trip.private_price
            : tourType === "group"
            ? trip.group_price
            : trip.base_price;
        const tourLabel = tourType === "private" ? "Private Tour" : tourType === "group" ? "Group Tour" : tourType;
        const subtitle = tourType === "private" ? "Maximum flexibility" : tourType === "group" ? "Up to 12 travelers" : "";

        return (
          <div key={tourType} className={styles.tourSection}>
            {/* Header */}
            <div className={styles.sectionHeader}>
              <div className={styles.headerLeft}>
                <span className={styles.tourTitle}>{tourLabel}</span>
                {subtitle && <span className={styles.tourSubtitle}>{subtitle}</span>}
              </div>
              {basePrice && <div className={styles.headerPrice}>£{basePrice}</div>}
            </div>

            {/* Seasons Row */}
            <div className={styles.seasonsWrapper}>
              {seasons.map((season) => (
                <div key={season.id} className={styles.seasonColumn}>
                  <span className={styles.seasonTitle}>{season.season_label}</span>
                  {(season.tiers || []).map((tier) => (
                    <div key={tier.id} className={styles.priceRow}>
                      <div className={styles.roomInfo}>
                        <span className={styles.perPerson}>Per Person</span>
                        <span className={styles.roomType}>{tier.label}</span>
                      </div>
                      <div className={styles.priceValue}>£{tier.price}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
