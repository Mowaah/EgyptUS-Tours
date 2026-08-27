"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Trip, Hotel } from "@/types";
import { BookingData } from "@/types";
import { useCurrency } from "@/contexts/CurrencyContext";
import styles from "./BookingSidebar.module.scss";

interface BookingSidebarProps {
  formData: BookingData;
  totalAmount: number;
  depositAmount: number;
  detailsId?: string;
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
  detailsId = "booking-summary-details",
  vatAmount = 0,
  totalRooms = 0,
  totalGuests = 0,
}: BookingSidebarProps) {
  // Mobile-only: the full details collapse into a compact summary strip.
  // On desktop this state is ignored (CSS always shows the details).
  const [expanded, setExpanded] = useState(false);
  const { formatCurrency } = useCurrency();

  const finalTotal = totalAmount + vatAmount;
  const remainingAmount = finalTotal - depositAmount;
  const isHotel = !!hotel;
  const formatMoney = formatCurrency;

  const image = isHotel ? (hotel!.image || "/images/pyramids.jpg") : (trip!.image || "/images/cruise.jpg");
  const title = isHotel ? hotel!.name : trip!.title;
  const rating = isHotel ? (hotel?.rating ?? 0) : (trip?.rating ?? 0);

  const startLabel = isHotel ? "Check-in" : "Start Date";
  const endLabel = isHotel ? "Check-Out" : "End Date";

  const shortStart = formatShortDate(formData.startDate, "Start");
  const shortEnd = formatShortDate(formData.endDate, "End");
  const compactGuests = totalGuests || formData.adults + formData.children + formData.infants;

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
          aria-controls={detailsId}
        >
          <div className={styles.compactThumbWrap}>
            <Image src={image} width={92} height={92} alt="" className={styles.compactThumb} />
          </div>

          <div className={styles.compactMain}>
            <div className={styles.compactTopRow}>
              <div className={styles.compactTitle}>{title}</div>
              {rating > 0 && (
                <div className={styles.compactRating}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M8 1.5l1.9 3.85 4.25.62-3.07 2.99.72 4.23L8 11.22 4.2 13.2l.73-4.23L1.86 5.97l4.25-.62L8 1.5Z" fill="#FDC700" />
                  </svg>
                  <span>{rating}</span>
                </div>
              )}
            </div>

            <div className={styles.compactDates}>
              {shortStart} <span className={styles.compactArrow} aria-hidden="true">→</span> {shortEnd}
            </div>

            <div className={styles.compactMeta}>
              {isHotel ? `${nights} Night` : `${formData.adults} Adults`} <span aria-hidden="true">•</span> {totalRooms} Room <span aria-hidden="true">•</span> {compactGuests} Guests
            </div>
            <div className={styles.compactBottomRow}>
              <span className={styles.compactTotalValue}>Total: {formatMoney(totalAmount)}</span>
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
            </div>
          </div>
        </button>

        {/* Full details — always visible at ≥768px; on mobile only when expanded */}
        <div
          id={detailsId}
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
            {rating > 0 && (
              <div className={styles.ratingPill}>
                <svg width="18" height="18" viewBox="0 0 28 28" fill="none" className={styles.starIcon}>
                  <path d="M16.0182 4.09313L18.0716 8.19979C18.3516 8.77146 19.0982 9.31979 19.7282 9.42479L23.4499 10.0431C25.8299 10.4398 26.3899 12.1665 24.6749 13.8698L21.7816 16.7631C21.2916 17.2531 21.0232 18.1981 21.1749 18.8748L22.0032 22.4565C22.6566 25.2915 21.1516 26.3881 18.6432 24.9065L15.1549 22.8415C14.5249 22.4681 13.4866 22.4681 12.8449 22.8415L9.35656 24.9065C6.85989 26.3881 5.34323 25.2798 5.99656 22.4565L6.82489 18.8748C6.97656 18.1981 6.70823 17.2531 6.21823 16.7631L3.32489 13.8698C1.62156 12.1665 2.16989 10.4398 4.54989 10.0431L8.27156 9.42479C8.88989 9.31979 9.63656 8.77146 9.91656 8.19979L11.9699 4.09313C13.0899 1.86479 14.9099 1.86479 16.0182 4.09313Z" fill="#FDC700" />
                </svg>
                <span className={styles.ratingValue}>{rating}</span>
              </div>
            )}
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
            {isHotel ? Object.entries(formData.rooms || {}).map(([type, count]) => {
              if (!count) return null;
              
              const roomIds = formData.roomCustomizations?.[type] || [];
              const hotelRoomsOfType = (hotel!.hotelRooms || []).filter(r => r.type.toLowerCase() === type);
              const baseRoom = hotelRoomsOfType.sort((a, b) => a.pricePerNight - b.pricePerNight)[0];

              const rows = [];
              for (let i = 0; i < count; i++) {
                const roomId = roomIds[i];
                const room = (hotel!.hotelRooms || []).find(r => r.id === roomId) || baseRoom;
                if (!room) continue;

                const name = type.toLowerCase().includes("room") ? type.charAt(0).toUpperCase() + type.slice(1) : `${type.charAt(0).toUpperCase() + type.slice(1)} Room`;
                const price = room.pricePerNight * nights;

                rows.push(
                  <div key={`${type}-${i}`} className={styles.priceRow}>
                    <span>1 × {name} - {room.view} ({nights} {nights === 1 ? 'Night' : 'Nights'})</span>
                    <strong>{formatMoney(price)}</strong>
                  </div>
                );
              }
              return rows;
            }) : (
              <div className={styles.priceRow}>
                 <span>Trip Package</span>
                 <strong>{formatMoney(totalAmount)}</strong>
              </div>
            )}
            {isHotel && vatAmount > 0 && (
              <div className={styles.priceRow}>
                <span>VAT</span>
                <strong>{formatMoney(vatAmount)}</strong>
              </div>
            )}
          </div>

          <div className={styles.dividerSolid} />

          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>{formatMoney(finalTotal)}</span>
          </div>

          {/* Deposit card */}
          <div className={styles.depositCard}>
            <div className={styles.depositTopRow}>
              <span className={styles.depositLabel}>
                Pay now {depositAmount === finalTotal ? "(Full amount)" : "(30% deposit)"}
              </span>
              <span className={styles.depositAmount}>{formatMoney(depositAmount)}</span>
            </div>
            <div className={styles.depositBottomRow}>
              <span className={styles.depositNote}>Remaining 70% due one month before your trip</span>
              <span className={styles.remainingAmount}>{formatMoney(remainingAmount)}</span>
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
