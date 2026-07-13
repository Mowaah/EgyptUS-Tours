"use client";

import Image from "next/image";
import StarRating from "@/components/shared/StarRating/StarRating";
import styles from "./page.module.scss";

const MOCK_VEHICLE = {
  name: "Mercedes S-Class",
  model: "2024",
  category: "Sedan",
  rate: 4,
  passengerCapacity: "3 passengers",
  luggageCapacity: "3 bags",
  duration: "7-8 hours",
  description:
    "Nestled in the heart of Cairo along the iconic Nile Corniche, the Nile Palace Hotel & Spa offers panoramic Nile views and direct access to the city's vibrant center. Ideally located near the Egyptian Museum, Khan El Khalili, and the Great Pyramids of Giza, guests can easily explore Egypt's most iconic landmarks.",
  features: [
    "Henna Painting",
    "Restaurant",
    "Luxury Transport",
    "Luxury Transport",
    "Archaeological Guides",
    "Gym",
    "Private Nile Cruises",
    "Private Nile Cruises",
    "WiFi",
    "Cultural Workshops",
  ],
};

export default function TransportationOverviewPage() {
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
            <span className={styles.value}>{MOCK_VEHICLE.name}</span>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Model</span>
            <span className={styles.value}>{MOCK_VEHICLE.model}</span>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Category</span>
            <span className={styles.value}>{MOCK_VEHICLE.category}</span>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Rate</span>
            <div className={styles.starRatingWrap}>
              <div className={styles.stars}>
                <StarRating filled={MOCK_VEHICLE.rate} showValue={false} size={18} />
              </div>
              <span className={styles.ratingText}>( {MOCK_VEHICLE.rate} )</span>
            </div>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Passenger Capacity</span>
            <span className={styles.value}>{MOCK_VEHICLE.passengerCapacity}</span>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Luggage Capacity</span>
            <span className={styles.value}>{MOCK_VEHICLE.luggageCapacity}</span>
          </div>

          <div className={styles.horizontalBorder} style={{ borderBottom: "none" }}>
            <span className={styles.label}>Duration</span>
            <span className={styles.value}>{MOCK_VEHICLE.duration}</span>
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
                <p className={styles.specText}>{MOCK_VEHICLE.description}</p>
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
            {MOCK_VEHICLE.features.map((feature, index) => (
              <div key={index} className={styles.facilityTag}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z" stroke="#7A7A7A" strokeWidth="1.125" />
                  <path d="M5.8125 9L7.9375 11.125L12.1875 6.875" stroke="#7A7A7A" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
