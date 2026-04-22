"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Trip, Hotel } from "@/types";
import { BookingData } from "@/types";
import styles from "./BookingSidebar.module.scss";

interface BookingSidebarProps {
  formData: BookingData;
  totalAmount: number;
  depositAmount: number;
  // Pass either a trip or a hotel — not both
  trip?: Trip;
  hotel?: Hotel;
  // Hotel-specific extras
  vatAmount?: number;
  totalRooms?: number;
  totalGuests?: number;
}

// "2026-03-15" → "Mar 15". Falls back to a neutral placeholder if empty/invalid.
function formatShortDate(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return fallback;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function BookingSidebar({
  trip,
  hotel,
  formData,
  totalAmount,
  depositAmount,
  vatAmount = 0,
  totalRooms = 0,
  totalGuests = 0,
}: BookingSidebarProps) {
  // Mobile-only: the full details collapse into a compact summary strip.
  // On desktop this state is ignored (CSS always shows the details).
  const [expanded, setExpanded] = useState(false);

  const remainingAmount = totalAmount - depositAmount;
  const isHotel = !!hotel;

  const image = isHotel ? (hotel!.image || "/images/pyramids.jpg") : (trip!.image || "/images/cruise.jpg");
  const title = isHotel ? hotel!.name : trip!.title;
  const rating = isHotel ? hotel!.rating : 4.9;
  const reviews = isHotel ? hotel!.reviews : 248;

  const startLabel = isHotel ? "Check-in" : "Start Date";
  const endLabel = isHotel ? "Check-Out" : "End Date";

  const shortStart = formatShortDate(formData.startDate, "Start");
  const shortEnd = formatShortDate(formData.endDate, "End");

  // Night count for hotel
  const nights = (() => {
    if (!isHotel || !formData.startDate || !formData.endDate) return 1;
    const diff = Math.round(
      (new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / 86400000
    );
    return diff > 0 ? diff : 1;
  })();

  return (
    <aside>
      <div className={`${styles.sidebarCard} ${expanded ? styles.sidebarCardExpanded : ""}`}>
        {/* Compact mobile summary — only visible below 1280px (matches the
            breakpoint where the sidebar stops sitting beside the form). */}
        <button
          type="button"
          className={`${styles.compactSummary} ${expanded ? styles.compactSummaryHidden : ""}`}
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls="booking-summary-details"
        >
          <div className={styles.compactText}>
            <div className={styles.compactTitle}>{title}</div>
            <div className={styles.compactDates}>
              {shortStart} <span className={styles.compactArrow} aria-hidden="true">→</span> {shortEnd}
            </div>
            <div className={styles.compactTotal}>
              <span className={styles.compactTotalLabel}>Total:</span>{" "}
              <span className={styles.compactTotalValue}>
                ${totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
          <span className={styles.compactChevron} aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        {/* Full details — always visible at ≥768px; on mobile only when expanded */}
        <div
          id="booking-summary-details"
          className={styles.details}
          hidden={!expanded}
        >
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
          {/* Image */}
          <Image src={image} width={400} height={180} alt="" className={styles.sidebarImage} />

          {/* Title + rating */}
          <div className={styles.titleRow}>
            <h3 className={styles.sidebarTitle}>{title}</h3>
            <div className={styles.ratingPill}>
              <svg width="18" height="18" viewBox="0 0 28 28" fill="none" className={styles.starIcon}>
                <path d="M16.0182 4.09313L18.0716 8.19979C18.3516 8.77146 19.0982 9.31979 19.7282 9.42479L23.4499 10.0431C25.8299 10.4398 26.3899 12.1665 24.6749 13.8698L21.7816 16.7631C21.2916 17.2531 21.0232 18.1981 21.1749 18.8748L22.0032 22.4565C22.6566 25.2915 21.1516 26.3881 18.6432 24.9065L15.1549 22.8415C14.5249 22.4681 13.4866 22.4681 12.8449 22.8415L9.35656 24.9065C6.85989 26.3881 5.34323 25.2798 5.99656 22.4565L6.82489 18.8748C6.97656 18.1981 6.70823 17.2531 6.21823 16.7631L3.32489 13.8698C1.62156 12.1665 2.16989 10.4398 4.54989 10.0431L8.27156 9.42479C8.88989 9.31979 9.63656 8.77146 9.91656 8.19979L11.9699 4.09313C13.0899 1.86479 14.9099 1.86479 16.0182 4.09313Z" fill="#FDC700" />
              </svg>
              <span className={styles.ratingValue}>{rating}</span>
              <span className={styles.reviewCount}>({reviews?.toLocaleString()})</span>
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
                <span className={styles.dateLabel}>{startLabel}</span>
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
                <span className={styles.dateLabel}>{endLabel}</span>
              </div>
              <div className={styles.dateTextBlock}>
                <strong className={styles.dateValue}>{formData.endDate || "Sun, Mar 15"}</strong>
                <small className={styles.dateTime}>From 15:00</small>
              </div>
            </div>
          </div>

          {/* Hotel: night/room/guest pills — Trip: adults/children/infants pills */}
          {isHotel ? (
            <div className={styles.guestsPills}>
              <span className={styles.guestPill}>
                <Image src="/images/night.svg" width={16} height={16} alt="" />
                {nights} Night
              </span>
              <span className={styles.guestPill}>
                <Image src="/images/room.svg" width={16} height={16} alt="" />
                {totalRooms} Room
              </span>
              <span className={styles.guestPill}>
                <Image src="/images/summary/adults.svg" width={16} height={16} alt="" />
                {totalGuests} Guests
              </span>
            </div>
          ) : (
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
          )}

          <div className={styles.divider} />

          {/* Price Details */}
          <div className={styles.sidebarSectionLabel}>Price Details</div>
          <div className={styles.priceRows}>
            {formData.rooms.single > 0 && (
              <div className={styles.priceRow}>
                <span>{formData.rooms.single} × Single Room - Garden View</span>
                <strong>${isHotel ? (hotel!.pricePerNight * formData.rooms.single).toFixed(2) : "50.00"}</strong>
              </div>
            )}
            {formData.rooms.double > 0 && (
              <div className={styles.priceRow}>
                <span>{formData.rooms.double} × Double Room - Garden View</span>
                <strong>${isHotel ? (hotel!.pricePerNight * 1.5 * formData.rooms.double).toFixed(2) : "50.00"}</strong>
              </div>
            )}
            {formData.rooms.triple > 0 && (
              <div className={styles.priceRow}>
                <span>{formData.rooms.triple} × Triple Room - Garden View</span>
                <strong>${isHotel ? (hotel!.pricePerNight * 2 * formData.rooms.triple).toFixed(2) : "50.00"}</strong>
              </div>
            )}
            <div className={styles.priceRow}>
              <span>Special Discount</span>
              <strong className={styles.discount}>-$5.00</strong>
            </div>
            {isHotel && vatAmount > 0 && (
              <div className={styles.priceRow}>
                <span>VAT</span>
                <strong>${vatAmount.toFixed(2)}</strong>
              </div>
            )}
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
            {["Free cancellation", "24/7 support", "Secure Payment"].map((f) => (
              <div key={f} className={styles.featureItem}>
                <Image src="/images/summary/checkmark-green.svg" width={16} height={16} alt="" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
