"use client";

import { useState } from "react";
import Image from "next/image";
import { Vehicle, TransportationBookingData } from "@/types";
import styles from "./BookingSummary.module.scss";

interface BookingSummaryProps {
  vehicle: Vehicle;
  formData: TransportationBookingData;
}

export default function BookingSummary({ vehicle, formData }: BookingSummaryProps) {
  const [expanded, setExpanded] = useState(false);

  const basePrice = 85.42;
  const serviceFee = 5.00;
  const insurance = 10.00;
  const total = basePrice + serviceFee + insurance;

  const pickupShort = formData.pickupLocation
    ? formData.pickupLocation.split(",")[0]
    : "Pickup";
  const dropoffShort = formData.dropoffLocation
    ? formData.dropoffLocation.split(",")[0]
    : "Drop-off";

  return (
    <aside className={styles.sidebar}>
      {/* ── Compact strip (mobile only) ─────────────────────────────────────── */}
      <button
        type="button"
        className={`${styles.compactSummary} ${expanded ? styles.compactSummaryHidden : ""}`}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls="transport-summary-details"
      >
        <div className={styles.compactText}>
          <span className={styles.compactTitle}>{vehicle.type} – {vehicle.name}</span>
          <span className={styles.compactRoute}>{pickupShort} → {dropoffShort}</span>
        </div>
        <div className={styles.compactRight}>
          <span className={styles.compactTotal}>${total.toFixed(2)}</span>
          <svg
            className={`${styles.compactChevron} ${expanded ? styles.compactChevronOpen : ""}`}
            width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* ── Full details ────────────────────────────────────────────────────── */}
      <div
        id="transport-summary-details"
        className={styles.details}
        hidden={!expanded}
      >
        <div className={styles.card}>
          {/* Collapse button — only shown on mobile when expanded */}
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={() => setExpanded(false)}
            aria-label="Hide summary"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Hide summary
          </button>
          <div className={styles.inner}>
            <div className={styles.header}>
              <h2 className={styles.title}>Booking Summary</h2>
              <div className={styles.ratingBox}>
                <div className={styles.starIcon}>
                  <Image src="/images/star-yellow3.svg" alt="" width={18} height={18} />
                </div>
                <span className={styles.ratingVal}>{vehicle.rating}</span>
                <span className={styles.reviews}>({vehicle.reviews})</span>
              </div>
            </div>

            <div className={styles.mainContent}>
              <div className={styles.vehicleSection}>
                <div className={styles.vehicleImage}>
                  <Image src={vehicle.image} alt={vehicle.name} fill style={{ objectFit: 'contain' }} />
                </div>

                <div className={styles.vehicleDetails}>
                  <h3 className={styles.vehicleName}>{vehicle.type} - {vehicle.name}</h3>

                  <div className={styles.priceTable}>
                    <div className={styles.priceRow}>
                      <span className={styles.priceLabel}>Base Price</span>
                      <span className={styles.priceValue}>${basePrice.toFixed(2)}</span>
                    </div>
                    <div className={styles.priceRow}>
                      <span className={styles.priceLabel}>Service Fee</span>
                      <span className={styles.priceValue}>${serviceFee.toFixed(2)}</span>
                    </div>
                    <div className={styles.priceRow}>
                      <span className={styles.priceLabel}>Insurance</span>
                      <span className={styles.priceValue}>${insurance.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalAmount}>${total.toFixed(2)}</span>
              </div>

              <div className={styles.depositBox}>
                <div className={styles.depositRow}>
                  <span className={styles.depositLabel}>Pay now (30% deposit)</span>
                  <span className={styles.depositAmount}>$1,470</span>
                </div>
                <div className={styles.remainingRow}>
                  <span className={styles.remainingNote}>Remaining 70% due one month before your trip</span>
                  <span className={styles.remainingVal}>$3,430</span>
                </div>
              </div>

              <div className={styles.trustBadges}>
                {["Free cancellation", "24/7 support", "Secure Payment"].map((text) => (
                  <div key={text} className={styles.badge}>
                    <div className={styles.badgeIcon}>
                      <Image src="/images/check-green.svg" alt="" width={16} height={16} />
                    </div>
                    <span className={styles.badgeText}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
