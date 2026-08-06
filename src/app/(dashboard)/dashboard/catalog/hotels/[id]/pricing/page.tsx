"use client";

import styles from "./page.module.scss";
import Image from "next/image";
import { useHotelDetailContext } from "../layout";

export default function HotelPricingPage() {
  const { hotel, loading } = useHotelDetailContext();

  if (loading) {
    return <div className={styles.pricingLayout}>Loading pricing...</div>;
  }

  const rooms: any[] = Array.isArray(hotel?.rooms) ? hotel.rooms : [];
  const prices = rooms.map(r => parseFloat(String(r.price_per_night || r.pricePerNight || 0))).filter(p => p > 0);
  const minRoomPrice = prices.length > 0 ? Math.min(...prices) : 0;
  
  const basePrice = hotel?.pricing_summary?.base_price ? parseFloat(String(hotel.pricing_summary.base_price)) : minRoomPrice;
  const vat = hotel?.vat_amount ? parseFloat(String(hotel.vat_amount)) : 0;
  const insurance = hotel?.insurance_fee ? parseFloat(String(hotel.insurance_fee)) : 0;
  const total = basePrice + vat + insurance;

  return (
    <div className={styles.pricingLayout}>
      <div className={styles.titleRow}>
        <div className={styles.iconWrap}>
          <Image src="/images/dashboard/catalog/trips/pricing.svg" alt="" width={20} height={20} />
        </div>
        <h2>General Pricing</h2>
      </div>

      <div className={styles.pricingContent}>
        <div className={styles.pricingRow}>
          <div className={styles.priceCard}>
            <span className={styles.label}>Base Price / Night</span>
            <span className={styles.value}>${basePrice.toFixed(2)}</span>
          </div>
          <div className={styles.priceCard}>
            <span className={styles.label}>VAT</span>
            <span className={styles.value}>${vat.toFixed(2)}</span>
          </div>
          <div className={styles.priceCard}>
            <span className={styles.label}>Insurance Fee</span>
            <span className={styles.value}>${insurance.toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.totalCard}>
          <span className={styles.label}>Total Estimated Night Rate</span>
          <span className={styles.value}>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
