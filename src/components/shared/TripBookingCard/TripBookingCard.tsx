"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Button from "@/components/shared/Button/Button";
import styles from "./TripBookingCard.module.scss";

export type TripBookingStatus = "partially_paid" | "confirmed" | "cancelled";

export interface TripBookingDetails {
  tripName: string;
  destination: string;
  returnDate: string;
  departureDate: string;
  travelType: string;
  durationLabel: string;
  roomType: string;
  /** e.g. +3 badge next to room type */
  roomExtraCount?: number;
  travelersLabel: string;
}

/** Hotel booking grid (3×2) — check-in/out, nights, room, guests */
export interface HotelBookingDetails {
  checkIn: string;
  checkOut: string;
  nights: string;
  roomType: string;
  roomExtraCount?: number;
  roomNumber: string;
  guests: string;
}

/** Transportation booking grid (4×2) */
export interface TransportBookingDetails {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  durationLabel: string;
  passengersLabel: string;
  tripType: string;
  luggageLabel: string;
}

type BookingCardShared = {
  imageSrc: string;
  imageAlt?: string;
  /** Trip package title or hotel name */
  tripTitle: string;
  /** Shown in gradient pill; omit when cancelled */
  timerLabel?: string | null;
  status: TripBookingStatus;
  paidAmount?: number;
  remainingAmount?: number;
  totalAmount?: number;
  cancelledLabel?: string;
  primaryLabel: string;
  primaryHref?: string;
};

export type TripBookingCardProps =
  | (BookingCardShared & {
      variant?: "trip";
      details: TripBookingDetails;
    })
  | (BookingCardShared & {
      variant: "hotel";
      details: HotelBookingDetails;
    })
  | (BookingCardShared & {
      variant: "transport";
      details: TransportBookingDetails;
    });

const TRIP_ICONS = {
  tripName: "/images/profile/booking/trip-name.svg",
  destination: "/images/profile/booking/destination.svg",
  returnDate: "/images/profile/booking/return.svg",
  departureDate: "/images/profile/booking/return.svg",
  travelType: "/images/profile/booking/travel-type.svg",
  duration: "/images/profile/booking/duration.svg",
  roomType: "/images/profile/booking/room-type.svg",
  travelers: "/images/profile/booking/travelers.svg",
} as const;

/** Icons for hotel variant — clock/building from shared assets */
const HOTEL_ICONS = {
  clock: "/images/summary/clock.svg",
  nights: "/images/profile/booking/duration.svg",
  roomType: "/images/profile/booking/room-type.svg",
  roomNumber: "/images/profile/booking/room-number.svg",
  guests: "/images/profile/booking/travelers.svg",
} as const;

/** Transportation detail icons — booking set + luggage asset */
const TRANSPORT_ICONS = {
  location: "/images/profile/booking/destination.svg",
  calendar: "/images/profile/booking/return.svg",
  clock: "/images/profile/booking/duration.svg",
  duration: "/images/profile/booking/timer.svg",
  passengers: "/images/profile/booking/passengers.svg",
  tripType: "/images/profile/booking/travel-type.svg",
  luggage: "/images/profile/booking/luggage.svg",
} as const;

function formatUsd(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

function LoadingGlyph() {
  return (
    <span className={styles.loadingGlyph} aria-hidden>
      <svg className={styles.spinnerSvg} width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.25"
        />
        <path
          fill="none"
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export default function TripBookingCard(props: TripBookingCardProps) {
  const {
    imageSrc,
    imageAlt = "",
    tripTitle,
    timerLabel,
    status,
    paidAmount,
    remainingAmount,
    totalAmount,
    cancelledLabel,
    primaryLabel,
    primaryHref = "/trips",
  } = props;
  const showTimer = Boolean(timerLabel) && status !== "cancelled";
  const sectionLabel =
    props.variant === "hotel"
      ? "Hotel Booking"
      : props.variant === "transport"
        ? "Transportation Booking"
        : "Trip Booking";

  return (
    <article className={styles.card}>
      <div className={styles.imageCol}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, 263px"
        />
        <div className={styles.imageOverlay} aria-hidden />
      </div>

      <div className={styles.body}>
        <header className={styles.cardHeader}>
          <div className={styles.headerTop}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionDot} aria-hidden />
              <span>{sectionLabel}</span>
            </div>
            <div className={styles.badges}>
              {showTimer && (
                <span className={styles.timerBadge}>
                  <span className={styles.timerDot} aria-hidden />
                  <span className={styles.timerText}>{timerLabel}</span>
                </span>
              )}
              {status === "partially_paid" && (
                <span className={styles.statusPartial}>
                  <LoadingGlyph />
                  <span>Partially Paid</span>
                </span>
              )}
              {status === "confirmed" && (
                <span className={styles.statusConfirmed}>✓ Confirmed</span>
              )}
              {status === "cancelled" && (
                <span className={styles.statusCancelled}>
                  <span className={styles.cancelX}>✕</span>
                  <span>Cancelled</span>
                </span>
              )}
            </div>
          </div>
        </header>

        <div className={styles.divider} />

        <div className={styles.main}>
          <h3 className={styles.tripTitle}>{tripTitle}</h3>

          {props.variant === "hotel" ? (
            <div className={styles.detailGridHotel}>
              <DetailCell
                icon={HOTEL_ICONS.clock}
                label="Check-In"
                value={props.details.checkIn}
                iconSize={16}
              />
              <DetailCell
                icon={HOTEL_ICONS.clock}
                label="Check-Out"
                value={props.details.checkOut}
                iconSize={16}
              />
              <DetailCell
                icon={HOTEL_ICONS.nights}
                label="Nights"
                value={props.details.nights}
                iconSize={16}
              />
              <DetailCell
                icon={HOTEL_ICONS.roomType}
                label="Room Type"
                value={
                  <span className={styles.roomRow}>
                    <span>{props.details.roomType}</span>
                    {props.details.roomExtraCount != null &&
                      props.details.roomExtraCount > 0 && (
                        <span className={styles.roomTag}>
                          +{props.details.roomExtraCount}
                        </span>
                      )}
                  </span>
                }
                iconSize={16}
              />
              <DetailCell
                icon={HOTEL_ICONS.roomNumber}
                label="Room Number"
                value={props.details.roomNumber}
                iconSize={16}
              />
              <DetailCell
                icon={HOTEL_ICONS.guests}
                label="Guests"
                value={props.details.guests}
                iconSize={16}
              />
            </div>
          ) : props.variant === "transport" ? (
            <div className={styles.detailGrid}>
              <DetailCell
                icon={TRANSPORT_ICONS.location}
                label="Pick up Location"
                value={props.details.pickupLocation}
                iconSize={16}
              />
              <DetailCell
                icon={TRANSPORT_ICONS.location}
                label="Drop off Location"
                value={props.details.dropoffLocation}
                iconSize={16}
              />
              <DetailCell
                icon={TRANSPORT_ICONS.calendar}
                label="Pickup Date"
                value={props.details.pickupDate}
                iconSize={16}
              />
              <DetailCell
                icon={TRANSPORT_ICONS.clock}
                label="Pickup time"
                value={props.details.pickupTime}
                iconSize={16}
              />
              <DetailCell
                icon={TRANSPORT_ICONS.duration}
                label="Duration"
                value={props.details.durationLabel}
                iconSize={16}
              />
              <DetailCell
                icon={TRANSPORT_ICONS.passengers}
                label="Passengers"
                value={props.details.passengersLabel}
                iconSize={16}
              />
              <DetailCell
                icon={TRANSPORT_ICONS.clock}
                label="Trip Type"
                value={props.details.tripType}
                iconSize={16}
              />
              <DetailCell
                icon={TRANSPORT_ICONS.luggage}
                label="Luggage"
                value={props.details.luggageLabel}
                iconSize={16}
              />
            </div>
          ) : (
            <div className={styles.detailGrid}>
              <DetailCell
                icon={TRIP_ICONS.tripName}
                iconClass={styles.iconBgPlane}
                label="Trip Name"
                value={props.details.tripName}
              />
              <DetailCell
                icon={TRIP_ICONS.destination}
                label="Destination"
                value={props.details.destination}
              />
              <DetailCell
                icon={TRIP_ICONS.returnDate}
                label="Return"
                value={props.details.returnDate}
              />
              <DetailCell
                icon={TRIP_ICONS.departureDate}
                label="Departure"
                value={props.details.departureDate}
              />
              <DetailCell
                icon={TRIP_ICONS.travelType}
                label="Travel Type"
                value={props.details.travelType}
              />
              <DetailCell
                icon={TRIP_ICONS.duration}
                label="Duration"
                value={props.details.durationLabel}
              />
              <DetailCell
                icon={TRIP_ICONS.roomType}
                label="Room Type"
                value={
                  <span className={styles.roomRow}>
                    <span>{props.details.roomType}</span>
                    {props.details.roomExtraCount != null &&
                      props.details.roomExtraCount > 0 && (
                        <span className={styles.roomTag}>+{props.details.roomExtraCount}</span>
                      )}
                  </span>
                }
              />
              <DetailCell
                icon={TRIP_ICONS.travelers}
                label="Travelers"
                value={props.details.travelersLabel}
              />
            </div>
          )}
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerMeta}>
              {status === "partially_paid" &&
                paidAmount != null &&
                remainingAmount != null && (
                  <p className={styles.metaPartial}>
                    <span className={styles.metaMuted}>Paid {formatUsd(paidAmount)}</span>
                    <span className={styles.metaBullet}>•</span>
                    <span className={styles.metaStrong}>
                      Remaining {formatUsd(remainingAmount)}
                    </span>
                  </p>
                )}
              {status === "confirmed" && totalAmount != null && (
                <p className={styles.metaConfirmed}>
                  <span className={styles.metaMuted}>Fully Paid</span>
                  <span className={styles.metaBullet}>•</span>
                  <span className={styles.metaPrice}>{formatUsd(totalAmount)}</span>
                </p>
              )}
              {status === "cancelled" && cancelledLabel && (
                <p className={styles.metaCancelled}>{cancelledLabel}</p>
              )}
            </div>
            <Button
              variant="primary"
              size="sm"
              href={primaryHref}
              className={styles.cta}
            >
              {primaryLabel}
            </Button>
          </div>
        </footer>
      </div>
    </article>
  );
}

function DetailCell({
  icon,
  iconClass,
  label,
  value,
  iconSize = 16,
}: {
  icon: string;
  iconClass?: string;
  label: string;
  value: ReactNode;
  /** Some asset SVGs are 24×24 */
  iconSize?: number;
}) {
  return (
    <div className={styles.detailCell}>
      <div className={`${styles.iconWrap} ${iconClass ?? ""}`}>
        <Image
          src={icon}
          alt=""
          width={iconSize}
          height={iconSize}
          className={styles.detailIcon}
        />
      </div>
      <div className={styles.detailText}>
        <span className={styles.detailLabel}>{label}</span>
        <span className={styles.detailValue}>{value}</span>
      </div>
    </div>
  );
}
