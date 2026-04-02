import Image from "next/image";
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
    </section>
  );
}
