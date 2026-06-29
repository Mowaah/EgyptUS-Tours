import React from "react";
import Image from "next/image";
import styles from "./StepBookingSummary.module.scss";
import { AddTripBookingData } from "../../AddTripBookingModal";

interface StepBookingSummaryProps {
  formData?: AddTripBookingData;
}

export default function StepBookingSummary({ formData }: StepBookingSummaryProps) {
  // We can use formData to dynamically show guest counts, etc. if available, 
  // but we'll stick to the mockup's structure for now.
  const numGuests = formData ? (formData.adults + formData.children + formData.infants) || 2 : 2;
  const numRooms = formData ? (formData.rooms.single + formData.rooms.double + formData.rooms.triple) || 3 : 3;

  return (
    <div className={styles.container}>
      {/* Left Panel: Trip Details */}
      <div className={`${styles.panel} ${styles.leftPanel}`}>
        <div className={styles.leftInner}>
          <div className={styles.titleWrap}>
            <h3 className={styles.tripTitle}>Aswan Nile Cruise Experience</h3>
          </div>

          <div className={styles.middleSection}>
          <div className={styles.staySection}>
            <span className={styles.stayLabel}>Your Stay</span>
            
            <div className={styles.datesRow}>
              {/* Check-in */}
              <div className={styles.dateItem}>
                <div className={styles.dateHeader}>
                  <Image src="/images/summary/clock.svg" alt="" width={24} height={24} />
                  <span>Check-in</span>
                </div>
                <div className={styles.dateValuesWrap}>
                  <div className={styles.dateValues}>
                    <span className={styles.dateDay}>Sun, Mar 15</span>
                    <span className={styles.dateTime}>From 15:00</span>
                  </div>
                </div>
              </div>

              {/* Check-Out */}
              <div className={styles.dateItem}>
                <div className={styles.dateHeader}>
                  <Image src="/images/summary/clock.svg" alt="" width={24} height={24} />
                  <span>Check-Out</span>
                </div>
                <div className={styles.dateValuesWrap}>
                  <div className={styles.dateValues}>
                    <span className={styles.dateDay}>Sun, Mar 15</span>
                    <span className={styles.dateTime}>From 15:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.badgesRow}>
            <div className={styles.badge}>
              <Image src="/images/night.svg" alt="" width={16} height={16} />
              <span>3 Night</span>
            </div>
            <div className={styles.badge}>
              <Image src="/images/room.svg" alt="" width={16} height={16} />
              <span>{numRooms} Room</span>
            </div>
            <div className={styles.badge}>
              <Image src="/images/summary/adults.svg" alt="" width={16} height={16} />
              <span>{numGuests} Guests</span>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Price Details */}
      <div className={`${styles.panel} ${styles.rightPanel}`}>
        <div className={styles.rightInner}>
          <div className={styles.priceListSection}>
            <div className={styles.priceTitleWrap}>
              <span className={styles.priceTitle}>Price Details</span>
            </div>
            
            <div className={styles.priceItemsContainer}>
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>2 × Double Room – Garden View</span>
                <span className={styles.priceValue}>$85.42</span>
              </div>
              
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>1 × Triple Room – Garden View</span>
                <span className={styles.priceValue}>$85.42</span>
              </div>
              
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Special Discount</span>
                <span className={styles.discountValue}>-$5.00</span>
              </div>
              
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>VAT</span>
                <span className={styles.priceValue}>$10.00</span>
              </div>
            </div>
          
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalValue}>$100.42</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
