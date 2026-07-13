"use client";

import Image from "next/image";
import styles from "./page.module.scss";

const MOCK_PRICING = {
  basePricePerPerson: "$350",
  vat: "$50",
  insurance: "$50",
  pricePerKm: "$50",
  totalPricePerPerson: "400$",
  additionalServices: [
    { label: "Child Seat", value: "+ $50" },
    { label: "Meet & Greet", value: "+ $50" },
    { label: "Extra Luggage", value: "+ $50" },
  ],
};

export default function TransportationPricingPage() {
  return (
    <div className={styles.wrapper}>
      {/* General Pricing */}
      <div className={styles.section}>
        <div className={styles.titleRow}>
          <div className={styles.iconWrap}>
            <Image src="/images/dashboard/catalog/trips/pricing.svg" alt="" width={20} height={20} />
          </div>
          <h2>General Pricing</h2>
        </div>

        <div className={styles.priceGrid}>
          {[
            { label: "Base Price / Person", value: "$350" },
            { label: "VAT (14%)", value: "$50" },
            { label: "Insurance", value: "$50" },
            { label: "Price Per KM", value: "$50" },
          ].map((item) => (
            <div key={item.label} className={styles.priceCell}>
              <span className={styles.cellLabel}>{item.label}</span>
              <span className={styles.cellValue}>{item.value}</span>
            </div>
          ))}
        </div>

        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Total Price Person</span>
          <span className={styles.totalValue}>{MOCK_PRICING.totalPricePerPerson}</span>
        </div>
      </div>

      {/* Additional Services */}
      <div className={styles.section}>
        <div className={styles.titleRow}>
          <div className={styles.iconWrap}>
            <Image src="/images/dashboard/catalog/trips/pricing.svg" alt="" width={20} height={20} />
          </div>
          <h2>Additional Services</h2>
        </div>

        <div className={styles.priceGrid}>
          {MOCK_PRICING.additionalServices.map((service) => (
            <div key={service.label} className={styles.priceCell}>
              <span className={styles.cellLabel}>{service.label}</span>
              <span className={styles.cellValue}>{service.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
