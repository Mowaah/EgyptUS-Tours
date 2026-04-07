import React from "react";
import Image from "next/image";
import { Trip } from "@/types";
import { BookingData } from "@/types";
import styles from "./BookingSidebar.module.scss";

interface BookingSidebarProps {
  trip: Trip;
  formData: BookingData;
  totalAmount: number;
  depositAmount: number;
}

export default function BookingSidebar({
  trip,
  formData,
  totalAmount,
  depositAmount,
}: BookingSidebarProps) {
  const remainingAmount = totalAmount - depositAmount;

  return (
    <aside>
      <div className={styles.sidebarCard}>
        {/* Trip image */}
        <Image
          src={trip.image || "/images/cruise.jpg"}
          width={400}
          height={180}
          alt=""
          className={styles.sidebarImage}
        />

        {/* Title + rating row */}
        <div className={styles.titleRow}>
          <h3 className={styles.sidebarTitle}>{trip.title}</h3>
          <div className={styles.ratingPill}>
            <svg width="18" height="18" viewBox="0 0 28 28" fill="none" className={styles.starIcon}>
              <path d="M16.0182 4.09313L18.0716 8.19979C18.3516 8.77146 19.0982 9.31979 19.7282 9.42479L23.4499 10.0431C25.8299 10.4398 26.3899 12.1665 24.6749 13.8698L21.7816 16.7631C21.2916 17.2531 21.0232 18.1981 21.1749 18.8748L22.0032 22.4565C22.6566 25.2915 21.1516 26.3881 18.6432 24.9065L15.1549 22.8415C14.5249 22.4681 13.4866 22.4681 12.8449 22.8415L9.35656 24.9065C6.85989 26.3881 5.34323 25.2798 5.99656 22.4565L6.82489 18.8748C6.97656 18.1981 6.70823 17.2531 6.21823 16.7631L3.32489 13.8698C1.62156 12.1665 2.16989 10.4398 4.54989 10.0431L8.27156 9.42479C8.88989 9.31979 9.63656 8.77146 9.91656 8.19979L11.9699 4.09313C13.0899 1.86479 14.9099 1.86479 16.0182 4.09313Z" fill="#FDC700" />
            </svg>
            <span className={styles.ratingValue}>4.9</span>
            <span className={styles.reviewCount}>(248)</span>
          </div>
        </div>

        {/* Your Stay */}
        <div className={styles.sidebarSectionLabel}>Your Stay</div>
        <div className={styles.datesRow}>
          <div className={styles.dateBlock}>
            <div className={styles.dateHeader}>
              <div className={styles.dateIconPill}>
                <Image src="/images/summary/clock.svg" width={24} height={24} alt="" />
              </div>
              <span className={styles.dateLabel}>Start Date</span>
            </div>
            <div className={styles.dateTextBlock}>
              <strong className={styles.dateValue}>{formData.startDate || "Sun, Mar 15"}</strong>
              <small className={styles.dateTime}>From 15:00</small>
            </div>
          </div>
          <div className={styles.dateBlock}>
            <div className={styles.dateHeader}>
              <div className={styles.dateIconPill}>
                <Image src="/images/summary/clock.svg" width={24} height={24} alt="" />
              </div>
              <span className={styles.dateLabel}>End Date</span>
            </div>
            <div className={styles.dateTextBlock}>
              <strong className={styles.dateValue}>{formData.endDate || "Sun, Mar 15"}</strong>
              <small className={styles.dateTime}>From 15:00</small>
            </div>
          </div>
        </div>

        {/* Guest pills */}
        <div className={styles.guestsPills}>
          <span className={styles.guestPill}>
            <Image src="/images/summary/adults.svg" width={16} height={16} alt="" />
            {formData.adults} Adults
          </span>
          <span className={styles.guestPill}>
            <Image src="/images/summary/children.svg" width={16} height={16} alt="" />
            {formData.children} Children
          </span>
          <span className={styles.guestPill}>
            <Image src="/images/summary/infants.svg" width={16} height={16} alt="" />
            {formData.infants} Infants
          </span>
        </div>

        <div className={styles.divider} />

        {/* Price Details */}
        <div className={styles.sidebarSectionLabel}>Price Details</div>
        <div className={styles.priceRows}>
          {formData.rooms.single > 0 && (
            <div className={styles.priceRow}>
              <span>{formData.rooms.single} × Single Room - Garden View</span>
              <strong>$50.00</strong>
            </div>
          )}
          {formData.rooms.double > 0 && (
            <div className={styles.priceRow}>
              <span>{formData.rooms.double} × Double Room - Sea View</span>
              <strong>$50.00</strong>
            </div>
          )}
          {formData.rooms.triple > 0 && (
            <div className={styles.priceRow}>
              <span>{formData.rooms.triple} × Triple Room - Garden View</span>
              <strong>$50.00</strong>
            </div>
          )}
          <div className={styles.priceRow}>
            <span>Special Discount</span>
            <strong className={styles.discount}>-$5.00</strong>
          </div>
        </div>

        <div className={styles.dividerSolid} />

        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Total</span>
          <span className={styles.totalValue}>${totalAmount.toLocaleString()}.00</span>
        </div>

        {/* Deposit card */}
        <div className={styles.depositCard}>
          <div className={styles.depositTopRow}>
            <span className={styles.depositLabel}>Pay now (30% deposit)</span>
            <span className={styles.depositAmount}>${depositAmount.toLocaleString()}</span>
          </div>
          <div className={styles.depositBottomRow}>
            <span className={styles.depositNote}>Remaining 70% due one month before your trip</span>
            <span className={styles.remainingAmount}>${remainingAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Features */}
        <div className={styles.featuresList}>
          <div className={styles.featureItem}>
            <Image src="/images/summary/checkmark-green.svg" width={16} height={16} alt="" />
            Free cancellation
          </div>
          <div className={styles.featureItem}>
            <Image src="/images/summary/checkmark-green.svg" width={16} height={16} alt="" />
            24/7 support
          </div>
          <div className={styles.featureItem}>
            <Image src="/images/summary/checkmark-green.svg" width={16} height={16} alt="" />
            Secure Payment
          </div>
        </div>
      </div>
    </aside>
  );
}
