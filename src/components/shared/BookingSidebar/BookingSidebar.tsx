"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Trip, Hotel } from "@/types";
import { BookingData } from "@/types";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "@/hooks/useTranslation";
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
  const { t } = useTranslation("booking");

  const finalTotal = totalAmount + vatAmount;
  const remainingAmount = finalTotal - depositAmount;
  const isHotel = !!hotel;
  const formatMoney = formatCurrency;

  const image = isHotel ? (hotel!.image || "/images/pyramids.jpg") : (trip!.image || "/images/cruise.jpg");
  const title = isHotel ? hotel!.name : trip!.title;
  const rating = isHotel ? (hotel?.rating ?? 0) : (trip?.rating ?? 0);

  const startLabel = isHotel ? t("sidebar.checkIn", "Check-in") : t("sidebar.startDate", "Start Date");
  const endLabel = isHotel ? t("sidebar.checkOut", "Check-Out") : t("sidebar.endDate", "End Date");

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

  const tripRoomRows = (() => {
    if (isHotel || !trip) return [];
    const baseSeason = trip.seasonPricing?.[0] || { single: 0, double: 0, triple: 0 };
    const poolSurcharge = trip.additionalRooms?.poolView || 0;
    const seaSurcharge = trip.additionalRooms?.seaView || 0;

    const roomGroupsMap: Record<string, { count: number; name: string; view: string; unitPrice: number }> = {};
    const roomEntries = Object.entries(formData.rooms || {}).filter(([_, count]) => (count as number) > 0);

    if (roomEntries.length === 0) return [];

    roomEntries.forEach(([type, count]) => {
      const rawType = type.toLowerCase();
      let basePrice = 0;
      if (rawType.includes("single")) {
        basePrice = baseSeason.single || trip.price || trip.privatePrice || 0;
      } else if (rawType.includes("triple")) {
        basePrice = baseSeason.triple || trip.price || trip.privatePrice || 0;
      } else {
        basePrice = baseSeason.double || trip.price || trip.privatePrice || 0;
      }

      const customizations = formData.roomCustomizations?.[type] || [];
      const totalCount = count as number;

      const typeName = type.charAt(0).toUpperCase() + type.slice(1);
      const roomTitle = typeName.toLowerCase().endsWith("room") ? typeName : `${typeName} Room`;

      for (let i = 0; i < totalCount; i++) {
        const opt = customizations[i] || "garden";
        let addon = 0;
        if (opt.toLowerCase().includes("pool")) addon = poolSurcharge;
        if (opt.toLowerCase().includes("sea")) addon = seaSurcharge;

        let viewLabel = "Garden View";
        if (opt.toLowerCase().includes("pool")) viewLabel = "Pool View";
        else if (opt.toLowerCase().includes("sea")) viewLabel = "Sea View";
        else if (opt && !opt.toLowerCase().includes("garden")) {
          viewLabel = opt.toLowerCase().includes("view") ? opt : `${opt.charAt(0).toUpperCase() + opt.slice(1)} View`;
        }

        const groupKey = `${type}_${viewLabel}`;
        if (!roomGroupsMap[groupKey]) {
          roomGroupsMap[groupKey] = {
            count: 0,
            name: roomTitle,
            view: viewLabel,
            unitPrice: basePrice + addon,
          };
        }
        roomGroupsMap[groupKey].count += 1;
      }
    });

    return Object.values(roomGroupsMap).map((g) => ({
      label: `${g.count} × ${g.name} - ${g.view}`,
      price: g.unitPrice * g.count,
    }));
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

            <div className={styles.compactMiddleRow}>
              <span>{shortStart} - {shortEnd}</span>
              <span className={styles.compactDot}>·</span>
              <span>{compactGuests} {t("sidebar.guests", "Guests")}</span>
            </div>

            <div className={styles.compactBottomRow}>
              <div className={styles.compactTotal}>
                <span className={styles.compactTotalLabel}>{t("sidebar.total", "Total")}:</span>
                <span className={styles.compactTotalValue}>{formatMoney(finalTotal)}</span>
              </div>
              <span className={styles.compactExpandText}>
                {expanded ? t("sidebar.hideDetails", "Hide Details") : t("sidebar.viewDetails", "View Details")}
              </span>
            </div>
          </div>
        </button>

        {/* Full sidebar content (always visible on desktop, toggled on mobile) */}
        <div id={detailsId} className={styles.detailsContent}>
          {/* Main card */}
          <div className={styles.thumbWrap}>
            <Image src={image} width={384} height={200} alt={title} className={styles.thumb} />
          </div>

          <div className={styles.titleRow}>
            <h3 className={styles.title}>{title}</h3>
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
          <div className={styles.sidebarSectionLabel}>{t("sidebar.yourStay", "Your Stay")}</div>
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
                <small className={styles.dateTime}>{t("sidebar.fromTime", "From 15:00")}</small>
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
                <small className={styles.dateTime}>{t("sidebar.fromTime", "From 15:00")}</small>
              </div>
            </div>
          </div>

          {/* Hotel: night/room/guest pills — Trip: adults/children/infants pills */}
          {isHotel ? (
            <div className={styles.guestsPills}>
              <span className={styles.guestPill}>
                <Image src="/images/night.svg" width={16} height={16} alt="" />
                {nights} {nights === 1 ? t("sidebar.night", "Night") : t("sidebar.nights", "Nights")}
              </span>
              <span className={styles.guestPill}>
                <Image src="/images/room.svg" width={16} height={16} alt="" />
                {totalRooms} {t("sidebar.room", "Room")}
              </span>
              <span className={styles.guestPill}>
                <Image src="/images/summary/adults.svg" width={16} height={16} alt="" />
                {totalGuests} {t("sidebar.guests", "Guests")}
              </span>
            </div>
          ) : (
            <div className={styles.guestsPills}>
              <span className={styles.guestPill}>
                <Image src="/images/summary/adults.svg" width={16} height={16} alt="" />
                {formData.adults} {t("sidebar.adults", "Adults")}
              </span>
              <span className={styles.guestPill}>
                <Image src="/images/summary/children.svg" width={16} height={16} alt="" />
                {formData.children} {t("sidebar.children", "Children")}
              </span>
              <span className={styles.guestPill}>
                <Image src="/images/summary/infants.svg" width={16} height={16} alt="" />
                {formData.infants} {t("sidebar.infants", "Infants")}
              </span>
            </div>
          )}

          <div className={styles.divider} />

          {/* Price Details */}
          <div className={styles.sidebarSectionLabel}>{t("sidebar.priceDetails", "Price Details")}</div>
          <div className={styles.priceRows}>
            {isHotel ? (
              Object.entries(formData.rooms || {}).map(([type, count]) => {
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
                      <span>1 × {name} - {room.view} ({nights} {nights === 1 ? t("sidebar.night", "Night") : t("sidebar.nights", "Nights")})</span>
                      <strong>{formatMoney(price)}</strong>
                    </div>
                  );
                }
                return rows;
              })
            ) : tripRoomRows.length > 0 ? (
              tripRoomRows.map((row, idx) => (
                <div key={`${row.label}-${idx}`} className={styles.priceRow}>
                  <span>{row.label}</span>
                  <strong>{formatMoney(row.price)}</strong>
                </div>
              ))
            ) : (
              <div className={styles.priceRow}>
                 <span>{t("sidebar.tripPackage", "Trip Package")}</span>
                 <strong>{formatMoney(totalAmount)}</strong>
              </div>
            )}
            {isHotel && vatAmount > 0 && (
              <div className={styles.priceRow}>
                <span>{t("sidebar.vat", "VAT")}</span>
                <strong>{formatMoney(vatAmount)}</strong>
              </div>
            )}
          </div>

          <div className={styles.dividerSolid} />

          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>{t("sidebar.total", "Total")}</span>
            <span className={styles.totalValue}>{formatMoney(finalTotal)}</span>
          </div>

          {/* Deposit card */}
          <div className={styles.depositCard}>
            <div className={styles.depositTopRow}>
              <span className={styles.depositLabel}>
                {t("sidebar.payNow", "Pay now")} {depositAmount === finalTotal ? t("sidebar.fullAmount", "(Full amount)") : t("sidebar.deposit30", "(30% deposit)")}
              </span>
              <span className={styles.depositAmount}>{formatMoney(depositAmount)}</span>
            </div>
            <div className={styles.depositBottomRow}>
              <span className={styles.depositNote}>{t("sidebar.remainingNote", "Remaining 70% due one month before your trip")}</span>
              <span className={styles.remainingAmount}>{formatMoney(remainingAmount)}</span>
            </div>
          </div>

          {/* Features */}
          <div className={styles.featuresList}>
            {[
              t("sidebar.freeCancellation", "Free cancellation"),
              t("sidebar.support247", "24/7 support"),
              t("sidebar.securePayment", "Secure Payment"),
            ].map((f) => (
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
