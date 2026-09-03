import type { ReactNode } from "react";
import Image from "next/image";
import Button from "@/components/shared/Button/Button";
import { bookingCardIcons } from "@/data/bookingCardIcons";
import { useTranslation } from "@/hooks/useTranslation";
import { useCurrency } from "@/contexts/CurrencyContext";
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

/** Hotel booking grid (3Ã—2) â€” check-in/out, nights, room, guests */
export interface HotelBookingDetails {
  checkIn: string;
  checkOut: string;
  nights: string;
  roomType: string;
  roomExtraCount?: number;
  roomNumber: string;
  guests: string;
}

/** Transportation booking grid (4Ã—2) */
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

/** MICE request grid (4Ã—2) */
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

/** B2B request grid (3Ã—2) */
export interface B2BRequestDetails {
  companyName: string;
  country: string;
  contactPerson: string;
  emailAddress: string;
  phoneNumber: string;
  website: string;
}

/** Plan Your Trip request grid (3Ã—2) */
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
    primaryHref = "/egypttours",
  } = props;
  const { t, language } = useTranslation("common");
  const { formatCurrency } = useCurrency();
  const localeCode = language === "it" ? "it-IT" : language === "es" ? "es-ES" : "en-US";

  const showTimer = Boolean(timerLabel) && status !== "cancelled";
  const sectionLabel =
    props.variant === "hotel"
      ? t("profile.card.hotelBooking", "Hotel Booking")
      : props.variant === "transport"
        ? t("profile.card.transportBooking", "Transportation Booking")
        : props.variant === "mice" || props.variant === ("events" as any)
          ? t("profile.card.miceEvent", "MICE Event")
          : props.variant === "b2b"
            ? t("profile.card.b2bEvent", "B2B Event")
            : props.variant === "plan_your_trip"
              ? t("profile.categories.planYourTrip", "Plan Your Trip")
              : t("profile.card.tripBooking", "Trip Booking");

  const localizedTimerLabel = (() => {
    if (!timerLabel) return "";
    const low = timerLabel.toLowerCase();
    if (low === "in the past") return t("profile.card.inThePast", "In the past");
    if (low === "upcoming") return t("profile.card.upcoming", "Upcoming");
    return timerLabel;
  })();

  const formatLocalizedDuration = (raw: string | undefined | null) => {
    if (!raw) return "";
    const match = raw.match(/(\d+)\s*Nights?\s*\/\s*(\d+)\s*Days?/i);
    if (match) {
      const n = parseInt(match[1], 10);
      const d = parseInt(match[2], 10);
      const nLabel = n === 1 ? t("units.night", "Night") : t("units.nights", "Nights");
      const dLabel = d === 1 ? t("units.day", "Day") : t("units.days", "Days");
      return `${n} ${nLabel} / ${d} ${dLabel}`;
    }
    return raw;
  };

  const getLocalizedRoomTitle = (tName: string) => {
    if (!tName) return "";
    const raw = tName.toLowerCase();
    if (raw.includes("single")) return t("rooms.singleRoom", "Single Room");
    if (raw.includes("double") || raw.includes("twin")) return t("rooms.doubleRoom", "Double Room");
    if (raw.includes("triple")) return t("rooms.tripleRoom", "Triple Room");
    return tName;
  };

  const formatLocalizedTravelers = (raw: string | undefined | null) => {
    if (!raw) return "";
    return raw.replace(/(\d+)\s*(Adults?|Children|Infants?)/gi, (m, count, word) => {
      const num = parseInt(count, 10);
      const w = word.toLowerCase();
      if (w.startsWith("adult")) {
        return `${num} ${num === 1 ? t("units.adult", "Adult") : t("units.adults", "Adults")}`;
      }
      if (w.startsWith("child")) {
        return `${num} ${num === 1 ? t("units.child", "Child") : t("units.children", "Children")}`;
      }
      if (w.startsWith("infant")) {
        return `${num} ${num === 1 ? t("units.infant", "Infant") : t("units.infants", "Infants")}`;
      }
      return m;
    });
  };

  const formatLocalizedDate = (dateStr: string | undefined | null) => {
    if (!dateStr || dateStr === "—") return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return new Intl.DateTimeFormat(localeCode, { month: "long", day: "numeric", year: "numeric" }).format(d);
    } catch {
      return dateStr;
    }
  };

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
                  {timerLabel !== "In the past" && <span className={styles.timerDot} aria-hidden />}
                  <span className={styles.timerText}>{localizedTimerLabel}</span>
                </span>
              )}
              {(status === "partially_paid" || status === "proposal_in_progress") && (
                <span className={styles.statusPartial}>
                  <LoadingGlyph />
                  <span>
                    {status === "proposal_in_progress"
                      ? t("profile.card.proposalInProgress", "Proposal In progress")
                      : t("profile.details.status.partially_paid", "Partially Paid")}
                  </span>
                </span>
              )}
              {(status === "confirmed" || status === "proposal_sent") && (
                <span className={styles.statusConfirmed}>
                  ✓ {status === "proposal_sent"
                    ? t("profile.card.proposalSent", "Proposal Sent")
                    : t("profile.details.status.confirmed", "Confirmed")}
                </span>
              )}
              {status === "cancelled" && (
                <span className={styles.statusCancelled}>
                  <span className={styles.cancelX}>✕</span>
                  <span>{t("profile.details.status.cancelled", "Cancelled")}</span>
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
                label={t("profile.card.checkIn", "Check-In")}
                value={formatLocalizedDate(props.details.checkIn)}
                iconSize={16}
              />
              <DetailCell
                icon={HOTEL_ICONS.nights}
                label={t("profile.card.checkOut", "Check-Out")}
                value={formatLocalizedDate(props.details.checkOut)}
                iconSize={16}
              />
              <DetailCell
                icon={TRIP_ICONS.returnDate}
                label={t("profile.card.nights", "Nights")}
                value={props.details.nights}
                iconSize={16}
              />
              <DetailCell
                icon={HOTEL_ICONS.roomType}
                label={t("profile.card.roomType", "Room Type")}
                value={
                  <span className={styles.roomRow}>
                    <span>{getLocalizedRoomTitle(props.details.roomType)}</span>
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
                label={t("profile.card.roomNumber", "Room Number")}
                value={props.details.roomNumber}
                iconSize={16}
              />
              <DetailCell
                icon={HOTEL_ICONS.guests}
                label={t("profile.card.guests", "Guests")}
                value={formatLocalizedTravelers(props.details.guests)}
                iconSize={16}
              />
            </div>
          ) : props.variant === "transport" ? (
            <div className={styles.detailGrid}>
              <DetailCell
                icon={TRANSPORT_ICONS.location}
                label={t("profile.details.pickupLocation", "Pick up Location")}
                value={props.details.pickupLocation}
                iconSize={16}
              />
              <DetailCell
                icon={TRANSPORT_ICONS.location}
                label={t("profile.details.dropoffLocation", "Drop off Location")}
                value={props.details.dropoffLocation}
                iconSize={16}
              />
              <DetailCell
                icon={TRANSPORT_ICONS.calendar}
                label={t("profile.details.pickupDate", "Pickup Date")}
                value={formatLocalizedDate(props.details.pickupDate)}
                iconSize={16}
              />
              <DetailCell
                icon={TRANSPORT_ICONS.clock}
                label={t("profile.details.pickupTime", "Pickup time")}
                value={props.details.pickupTime}
                iconSize={16}
              />
              <DetailCell
                icon={TRANSPORT_ICONS.duration}
                label={t("profile.details.duration", "Duration")}
                value={formatLocalizedDuration(props.details.durationLabel)}
                iconSize={16}
              />
              <DetailCell
                icon={TRANSPORT_ICONS.passengers}
                label={t("profile.details.passengers", "Passengers")}
                value={props.details.passengersLabel}
                iconSize={16}
              />
              <DetailCell
                icon={TRANSPORT_ICONS.clock}
                label={t("profile.details.tripType", "Trip Type")}
                value={props.details.tripType}
                iconSize={16}
              />
              <DetailCell
                icon={TRANSPORT_ICONS.luggage}
                label={t("profile.details.luggage", "Luggage")}
                value={props.details.luggageLabel}
                iconSize={16}
              />
            </div>
          ) : props.variant === "mice" || props.variant === ("events" as any) ? (() => {
            const d = props.details as MiceRequestDetails;
            return (
              <div className={styles.detailGrid}>
                <DetailCell
                  icon={MICE_ICONS.organization}
                  label={t("profile.card.organization", "Organization")}
                  value={d.organization}
                />
                <DetailCell
                  icon={MICE_ICONS.city}
                  label={t("profile.card.preferredCity", "Preferred City")}
                  value={d.preferredCity}
                />
                <DetailCell
                  icon={MICE_ICONS.eventType}
                  label={t("profile.card.eventType", "Event Type")}
                  value={d.eventType}
                />
                <DetailCell
                  icon={MICE_ICONS.attendees}
                  label={t("profile.card.expectedAttendees", "Expected Attendees")}
                  value={d.expectedAttendees}
                />
                <DetailCell
                  icon={MICE_ICONS.startDate}
                  label={t("profile.card.startDate", "Start Date")}
                  value={formatLocalizedDate(d.startDate)}
                />
                <DetailCell
                  icon={MICE_ICONS.endDate}
                  label={t("profile.card.endDate", "End Date")}
                  value={formatLocalizedDate(d.endDate)}
                />
                <DetailCell
                  icon={MICE_ICONS.eventTime}
                  label={t("profile.card.eventTime", "Event Time")}
                  value={d.eventTime}
                />
                <DetailCell
                  icon={MICE_ICONS.duration}
                  label={t("profile.details.duration", "Duration")}
                  value={formatLocalizedDuration(d.durationLabel)}
                />
              </div>
            );
          })() : props.variant === "b2b" ? (
            <div className={styles.detailGridHotel}>
              <DetailCell
                icon={B2B_ICONS.companyName}
                label={t("profile.card.companyName", "Company Name")}
                value={props.details.companyName}
              />
              <DetailCell
                icon={B2B_ICONS.country}
                label={t("profile.card.country", "Country")}
                value={props.details.country}
              />
              <DetailCell
                icon={B2B_ICONS.contactPerson}
                label={t("profile.card.contactPerson", "Contact Person")}
                value={props.details.contactPerson}
              />
              <DetailCell
                icon={B2B_ICONS.email}
                label={t("profile.details.email", "Email Address")}
                value={props.details.emailAddress}
              />
              <DetailCell
                icon={B2B_ICONS.phone}
                label={t("profile.details.phone", "Phone Number")}
                value={props.details.phoneNumber}
              />
              <DetailCell
                icon={B2B_ICONS.website}
                label={t("profile.card.website", "Website")}
                value={props.details.website}
              />
            </div>
          ) : props.variant === "plan_your_trip" ? (
            <div className={styles.detailGridHotel}>
              <DetailCell
                icon={bookingCardIcons.trip.destination}
                label={t("profile.details.destination", "Destination")}
                value={props.details.destination}
              />
              <DetailCell
                icon="/images/summary/trip.svg"
                label={t("profile.card.tripCategory", "Trip Category")}
                value={props.details.tripCategory}
              />
              <DetailCell
                icon={bookingCardIcons.trip.duration}
                label={t("profile.details.duration", "Duration")}
                value={formatLocalizedDuration(props.details.durationLabel)}
              />
              <DetailCell
                icon={bookingCardIcons.trip.returnDate}
                label={t("profile.card.travelDates", "Travel Dates")}
                value={props.details.travelDates}
              />
              <DetailCell
                icon="/images/profile/booking/budget-orange.svg"
                label={t("profile.card.budget", "Budget")}
                value={props.details.budget}
              />
              <DetailCell
                icon={bookingCardIcons.trip.travelers}
                label={t("profile.card.travelers", "Travelers")}
                value={formatLocalizedTravelers(props.details.travelersLabel)}
              />
            </div>
          ) : (
            <div className={styles.detailGrid}>
              <DetailCell
                icon={TRIP_ICONS.tripName}
                iconClass={styles.iconBgPlane}
                label={t("profile.details.tripName", "Trip Name")}
                value={props.details.tripName}
              />
              <DetailCell
                icon={TRIP_ICONS.destination}
                label={t("profile.details.destination", "Destination")}
                value={props.details.destination}
              />
              <DetailCell
                icon={TRIP_ICONS.returnDate}
                label={t("profile.card.return", "Return")}
                value={formatLocalizedDate(props.details.returnDate)}
              />
              <DetailCell
                icon={TRIP_ICONS.departureDate}
                label={t("profile.card.departure", "Departure")}
                value={formatLocalizedDate(props.details.departureDate)}
              />
              <DetailCell
                icon={TRIP_ICONS.travelType}
                label={t("profile.card.travelType", "Travel Type")}
                value={props.details.travelType}
              />
              <DetailCell
                icon={TRIP_ICONS.duration}
                label={t("profile.details.duration", "Duration")}
                value={formatLocalizedDuration(props.details.durationLabel)}
              />
              <DetailCell
                icon={TRIP_ICONS.roomType}
                label={t("profile.card.roomType", "Room Type")}
                value={
                  <span className={styles.roomRow}>
                    <span>{getLocalizedRoomTitle(props.details.roomType)}</span>
                    {props.details.roomExtraCount != null &&
                      props.details.roomExtraCount > 0 && (
                        <span className={styles.roomTag}>+{props.details.roomExtraCount}</span>
                      )}
                  </span>
                }
              />
              <DetailCell
                icon={TRIP_ICONS.travelers}
                label={t("profile.card.travelers", "Travelers")}
                value={formatLocalizedTravelers(props.details.travelersLabel)}
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
                    <span className={styles.metaMuted}>{t("profile.card.paid", "Paid")} {formatCurrency(paidAmount)}</span>
                    <span className={styles.metaBullet}>•</span>
                    <span className={styles.metaStrong}>
                      {t("profile.card.remaining", "Remaining")} {formatCurrency(remainingAmount)}
                    </span>
                  </p>
                )}
              {status === "confirmed" && totalAmount != null && (
                <p className={styles.metaConfirmed}>
                  <span className={styles.metaMuted}>{t("profile.card.fullyPaid", "Fully Paid")}</span>
                  <span className={styles.metaBullet}>•</span>
                  <span className={styles.metaPrice}>{formatCurrency(totalAmount)}</span>
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
              {primaryLabel === "Complete Payment"
                ? t("profile.card.completePayment", "Complete Payment")
                : primaryLabel === "View Details"
                  ? t("buttons.viewDetails", "View Details")
                  : primaryLabel}
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
  /** Some asset SVGs are 24Ã—24 */
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
