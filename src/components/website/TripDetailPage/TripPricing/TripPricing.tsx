import { Trip } from "@/types";
import styles from "./TripPricing.module.scss";

interface TripPricingProps {
  trip: Trip;
}

export default function TripPricing({ trip }: TripPricingProps) {
  const pricing = trip.pricing ?? [];
  if (!pricing.length) return null;

  return (
    <section id="pricing" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Prices &amp; Accommodation</h2>
        <p className={styles.subtitle}>
          Explore detailed pricing and accommodation options tailored to your selected trip
        </p>
      </div>

      <div className={styles.grid}>
        {pricing.map((col, ci) => (
          <div key={ci} className={styles.column}>
            <h3 className={styles.season}>{col.season}</h3>
            {col.tiers.map((tier, ti) => (
              <div key={ti} className={styles.tier}>
                <div className={styles.tierIconWrap}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="5" width="20" height="14" rx="2" stroke="#FF6600" strokeWidth="1.8" />
                    <path d="M2 10h20" stroke="#FF6600" strokeWidth="1.8" />
                  </svg>
                </div>
                <div>
                  <p className={styles.tierPrice}>US$ {tier.price.toLocaleString()}</p>
                  <p className={styles.tierLabel}>{tier.label}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
