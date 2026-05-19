"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Button from "@/components/shared/Button/Button";
import { bookingCardIcons } from "@/data/bookingCardIcons";
import styles from "./TripBookingCard.module.scss";

export type TripBookingStatus =
  | "partially_paid"
  | "confirmed"
  | "cancelled"
  | "proposal_in_progress"
  | "proposal_sent";

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

/** MICE request grid (4×2) */
export interface MiceRequestDetails {
  organization: string;
  preferredCity: string;
  eventType: string;
  expectedAttendees: string;
  startDate: string;
  endDate: string;
  eventTime: string;
  durationLabel: string;
}

/** B2B request grid (3×2) */
export interface B2BRequestDetails {
  companyName: string;
  country: string;
  contactPerson: string;
  emailAddress: string;
  phoneNumber: string;
  website: string;
}

/** Plan Your Trip request grid (3×2) */
export interface PlanYourTripRequestDetails {
  destination: string;
  tripCategory: string;
  durationLabel: string;
  travelDates: string;
  budget: string;
  travelersLabel: string;
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
  /** Optional neutral footer message for request cards */
  infoMessage?: string;
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
    })
  | (BookingCardShared & {
      variant: "mice";
      details: MiceRequestDetails;
    })
  | (BookingCardShared & {
      variant: "b2b";
      details: B2BRequestDetails;
    })
  | (BookingCardShared & {
      variant: "plan_your_trip";
      details: PlanYourTripRequestDetails;
    });

const TRIP_ICONS = bookingCardIcons.trip;
const HOTEL_ICONS = bookingCardIcons.hotel;
const TRANSPORT_ICONS = bookingCardIcons.transport;
const MICE_ICONS = bookingCardIcons.mice;
const B2B_ICONS = bookingCardIcons.b2b;

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
    infoMessage,
    primaryLabel,
    primaryHref = "/trips",
  } = props;
  const showTimer = Boolean(timerLabel) && status !== "cancelled";
  const sectionLabel =
    props.variant === "hotel"
      ? "Hotel Booking"
      : props.variant === "transport"
        ? "Transportation Booking"
        : props.variant === "mice"
          ? "MICE Event"
          : props.variant === "b2b"
            ? "B2B Event"
            : props.variant === "plan_your_trip"
              ? "Plan Your Trip"
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
              {(status === "partially_paid" || status === "proposal_in_progress") && (
                <span className={styles.statusPartial}>
                  <LoadingGlyph />
                  <span>
                    {status === "proposal_in_progress" ? "Proposal In progress" : "Partially Paid"}
                  </span>
                </span>
              )}
              {(status === "confirmed" || status === "proposal_sent") && (
                <span className={styles.statusConfirmed}>
                  ✓ {status === "proposal_sent" ? "Proposal Sent" : "Confirmed"}
                </span>
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
                icon={HOTEL_ICONS.nights}
                label="Check-In"
                value={props.details.checkIn}
                iconSize={16}
              />
              <DetailCell
                icon={HOTEL_ICONS.nights}
                label="Check-Out"
                value={props.details.checkOut}
                iconSize={16}
              />
              <DetailCell
                icon={TRIP_ICONS.returnDate}
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
          ) : props.variant === "mice" ? (
            <div className={styles.detailGrid}>
              <DetailCell
                icon={MICE_ICONS.organization}
                label="Organization"
                value={props.details.organization}
              />
              <DetailCell
                icon={MICE_ICONS.city}
                label="Preferred City"
                value={props.details.preferredCity}
              />
              <DetailCell
                icon={MICE_ICONS.eventType}
                label="Event Type"
                value={props.details.eventType}
              />
              <DetailCell
                icon={MICE_ICONS.attendees}
                label="Expected Attendees"
                value={props.details.expectedAttendees}
              />
              <DetailCell
                icon={MICE_ICONS.startDate}
                label="Start Date"
                value={props.details.startDate}
              />
              <DetailCell
                icon={MICE_ICONS.endDate}
                label="End Date"
                value={props.details.endDate}
              />
              <DetailCell
                icon={MICE_ICONS.eventTime}
                label="Event time"
                value={props.details.eventTime}
              />
              <DetailCell
                icon={MICE_ICONS.duration}
                label="Duration"
                value={props.details.durationLabel}
              />
            </div>
          ) : props.variant === "b2b" ? (
            <div className={styles.detailGridHotel}>
              <DetailCell
                icon={B2B_ICONS.companyName}
                label="Company name"
                value={props.details.companyName}
              />
              <DetailCell
                icon={B2B_ICONS.country}
                label="Country"
                value={props.details.country}
              />
              <DetailCell
                icon={B2B_ICONS.contactPerson}
                label="Contact Person"
                value={props.details.contactPerson}
              />
              <DetailCell
                icon={B2B_ICONS.email}
                label="Email Address"
                value={props.details.emailAddress}
              />
              <DetailCell
                icon={B2B_ICONS.phone}
                label="Phone Number"
                value={props.details.phoneNumber}
              />
              <DetailCell
                icon={B2B_ICONS.website}
                label="Website"
                value={props.details.website}
              />
            </div>
          ) : props.variant === "plan_your_trip" ? (
            <div className={styles.detailGridHotel}>
              <DetailCell
                icon={bookingCardIcons.trip.destination}
                label="Destination"
                value={props.details.destination}
              />
              <DetailCell
                icon="/images/summary/trip.svg"
                label="Trip Category"
                value={props.details.tripCategory}
              />
              <DetailCell
                icon={bookingCardIcons.trip.duration}
                label="Duration"
                value={props.details.durationLabel}
              />
              <DetailCell
                icon={bookingCardIcons.trip.returnDate}
                label="Travel Dates"
                value={props.details.travelDates}
              />
              <DetailCell
                icon="/images/profile/booking/budget-orange.svg"
                label="Budget"
                value={props.details.budget}
              />
              <DetailCell
                icon={bookingCardIcons.trip.travelers}
                label="Travelers"
                value={props.details.travelersLabel}
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
              {(status === "proposal_in_progress" || status === "proposal_sent") && infoMessage && (
                <p className={styles.metaInfo}>• {infoMessage}</p>
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
