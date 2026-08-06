"use client";

import Image from "next/image";
import StarRating from "@/components/shared/StarRating/StarRating";
import { useVehicleDetailContext } from "../layout";
import styles from "./page.module.scss";

export default function TransportationOverviewPage() {
  const { vehicle, loading } = useVehicleDetailContext();

  if (loading) {
    return <div className={styles.viewLayout}>Loading overview...</div>;
  }

  if (!vehicle) {
    return <div className={styles.viewLayout}>Vehicle not found.</div>;
  }

  const english = vehicle.translations?.en || {};
  const rate = vehicle.rating_avg || 0;
  const features = vehicle.features || [];

  return (
    <div className={styles.viewLayout}>
      {/* Column 1: Vehicle Details */}
      <div className={styles.leftColumn}>
        <div className={styles.titleRow}>
          <div className={styles.iconWrap}>
            <Image src="/images/dashboard/catalog/hotels/basic.svg" alt="" width={20} height={20} />
          </div>
          <h2>Vehicle Details</h2>
        </div>

        <div className={styles.infoContainer}>
          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Name</span>
            <span className={styles.value}>{english.name || vehicle.name || "-"}</span>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Model</span>
            <span className={styles.value}>{vehicle.model_year || "-"}</span>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Category</span>
            <span className={styles.value}>{vehicle.category?.name || "-"}</span>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Rate</span>
            <div className={styles.starRatingWrap}>
              <div className={styles.stars}>
                <StarRating filled={rate} showValue={false} size={18} />
              </div>
              {rate > 0 && <span className={styles.ratingText}>( {rate} )</span>}
            </div>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Passenger Capacity</span>
            <span className={styles.value}>{vehicle.passengers || "-"} passengers</span>
          </div>

          <div className={styles.horizontalBorder} style={{ borderBottom: "none" }}>
            <span className={styles.label}>Luggage Capacity</span>
            <span className={styles.value}>{vehicle.luggage_capacity || "-"} bags</span>
          </div>
        </div>
      </div>

      {/* Column 2: Content & Features */}
      <div className={styles.rightColumn}>
        <div className={styles.contentCard}>
          <div className={styles.titleRow}>
            <div className={styles.iconWrap}>
              <Image src="/images/dashboard/catalog/hotels/hotel_content.svg" alt="" width={20} height={20} />
            </div>
            <h2>Vehicle Content</h2>
          </div>

          <div className={styles.specsContainer}>
            <div className={styles.specItem}>
              <p className={styles.specLabel}>Overview</p>
              <div className={styles.specBox}>
                <p className={styles.specText}>{english.description || vehicle.description || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.facilitiesCard}>
          <div className={styles.titleRow}>
            <div className={styles.iconWrap}>
              <Image src="/images/dashboard/catalog/hotels/facilities.svg" alt="" width={20} height={20} />
            </div>
            <h2>Features &amp; Amenities</h2>
          </div>

          <div className={styles.facilitiesContainer}>
            {features.map((feature: string, index: number) => (
              <div key={index} className={styles.facilityTag}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z" stroke="#7A7A7A" strokeWidth="1.125" />
                  <path d="M5.8125 9L7.9375 11.125L12.1875 6.875" stroke="#7A7A7A" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{feature}</span>
              </div>
            ))}
            {features.length === 0 && <span className={styles.value}>No features added.</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
