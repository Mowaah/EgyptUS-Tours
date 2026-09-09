import type { ReactNode } from "react";
import Image from "next/image";
import Button from "@/components/shared/Button/Button";
import StatusPill from "@/components/shared/StatusPill/StatusPill";
import type { StatusPillVariant, StatusPillIconType } from "@/components/shared/StatusPill/StatusPill";
import { getStatusConfig } from "@/utils/statusUtils";
import { bookingCardIcons } from "@/data/bookingCardIcons";
import { useTranslation } from "@/hooks/useTranslation";
import { useCurrency } from "@/contexts/CurrencyContext";
import type { MultiCurrencyPrice } from "@/constants/currency";
import styles from "./TripBookingCard.module.scss";

export type TripBookingStatus =
  | "partially_paid"
  | "confirmed"
  | "cancelled"
  | "canceled"
  | "rejected"
  | "pending"
  | "paid"
  | "fully_paid"
  | "deposit_paid"
  | "upcoming"
  | "on_trip"
  | "in_stay"
  | "in_transit"
  | "completed"
  | "refunded"
  | "new"
  | "in_progress"
  | "proposal_in_progress"
  | "proposal_ready"
  | "proposal_sent"
  | "negotiation"
  | "approved"
  | "awaiting_deposit"
  | "awaiting_payment"
  | string;

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
  imageSrc?: string;
  imageAlt?: string;
  showImage?: boolean;
  /** Trip package title or hotel name */
  tripTitle: string;
  /** Shown in gradient pill; omit when cancelled */
  timerLabel?: string | null;
  status: TripBookingStatus;
  statusLabel?: string;
  statusVariant?: StatusPillVariant;
  secondaryStatusLabel?: string;
  secondaryStatusVariant?: StatusPillVariant;
  secondaryStatusIconType?: StatusPillIconType;
  paidAmount?: number | MultiCurrencyPrice;
  remainingAmount?: number | MultiCurrencyPrice;
  totalAmount?: number | MultiCurrencyPrice;
  currency?: string;
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

export default function TripBookingCard(props: TripBookingCardProps) {
  const {
    imageSrc,
    imageAlt = "",
    showImage = true,
    tripTitle,
    timerLabel,
    status,
    paidAmount,
    remainingAmount,
    totalAmount,
    currency: cardCurrency,
    cancelledLabel,
    infoMessage,
    primaryLabel,
    primaryHref = "/egypttours",
  } = props;
  const { t, language } = useTranslation("common");
  const { formatCurrency } = useCurrency();
  const localeCode = language === "it" ? "it-IT" : language === "es" ? "es-ES" : "en-US";

  const resolveAmount = (amt?: number | MultiCurrencyPrice | null): MultiCurrencyPrice | number | undefined => {
    if (amt == null) return undefined;
    if (typeof amt === "object") return amt;
    const curr = (cardCurrency || "USD").toUpperCase();
    if (curr === "EGP" || curr === "£") return { egp: amt };
    if (curr === "EUR" || curr === "€") return { eur: amt };
    return { usd: amt };
  };

  const isRequestVariant =
    props.variant === "plan_your_trip" ||
    props.variant === "mice" ||
    (props.variant as string) === "events" ||
    props.variant === "b2b";
  const hasImage = Boolean(imageSrc && showImage && !isRequestVariant);

  const isTerminalNegative =
    status === "cancelled" ||
    status === "canceled" ||
    status === "rejected";
  const showTimer = Boolean(timerLabel) && !isTerminalNegative;
  const statusConfig = getStatusConfig(status);
  const primaryStatusLabel = props.statusLabel || statusConfig.label;
  const primaryStatusVariant = props.statusVariant || statusConfig.variant;
  const primaryStatusIconType = statusConfig.iconType;
  const sectionLabel =
    props.variant === "hotel"
      ? t("profile.card.hotelBooking", "Hotel Booking")
      : props.variant === "transport"
        ? t("profile.card.transportBooking", "Transportation Booking")
        : props.variant === "mice" || (props.variant as string) === "events"
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

  const formatLocalizedDateRange = (raw: string | undefined | null) => {
    if (!raw || raw === "—") return "";
    const parts = raw.split(/\s*[-–—]\s*|\s+to\s+/i);
    if (parts.length === 2) {
      const d1 = new Date(parts[0].trim());
      const d2 = new Date(parts[1].trim());
      if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
        const fmt = new Intl.DateTimeFormat(localeCode, { month: "long", day: "numeric", year: "numeric" });
        return `${fmt.format(d1)} – ${fmt.format(d2)}`;
      }
    }
    return formatLocalizedDate(raw);
  };

  const formatLocalizedInfoMessage = (msg: string | undefined | null) => {
    if (!msg) return "";
    const clean = msg.replace(/^•\s*/, "").trim();
    const low = clean.toLowerCase();
    if (low === "your trip is in progress" || low === "your trip is in progress.") {
      return t("profile.card.tripInProgress", "Your trip is in progress");
    }
    if (low === "your stay is in progress" || low === "your stay is in progress.") {
      return t("profile.card.stayInProgress", "Your stay is in progress");
    }
    if (low === "your transit is in progress" || low === "your transit is in progress.") {
      return t("profile.card.transitInProgress", "Your transit is in progress");
    }
    if (low.includes("proposal expected within 24-48 hrs") || low.includes("proposal expected within 24-48")) {
      return t("profile.card.proposalExpected", "Proposal expected within 24-48 hrs");
    }
    if (low === "proposal in progress") {
      return t("profile.card.proposalInProgress", "Proposal In progress");
    }
    if (low === "proposal sent") {
      return t("profile.card.proposalSent", "Proposal Sent");
    }
    if (low === "proposal ready") {
      return t("profile.card.proposalReady", "Proposal Ready");
    }
    if (low === "trip completed" || low === "booking completed") {
      return t("profile.card.tripCompleted", "Trip Completed");
    }
    if (low === "stay completed") {
      return t("profile.card.stayCompleted", "Stay Completed");
    }
    if (low === "transit completed" || low === "ride completed") {
      return t("profile.card.transitCompleted", "Transit Completed");
    }
    if (low === "event completed") {
      return t("profile.card.eventCompleted", "Event Completed");
    }
    if (low === "request rejected" || low === "rejected") {
      return t("profile.card.rejectedByAdmin", "Request Rejected");
    }
    return clean;
  };

  const footerStatusMessage = (() => {
    if (infoMessage) return formatLocalizedInfoMessage(infoMessage);
    const norm = (status || "").toLowerCase().replace(/[-_]/g, " ").trim();
    if (norm === "in trip" || norm === "on trip") {
      return props.variant === "hotel"
        ? t("profile.card.stayInProgress", "Your stay is in progress")
        : props.variant === "transport"
          ? t("profile.card.transitInProgress", "Your transit is in progress")
          : t("profile.card.tripInProgress", "Your trip is in progress");
    }
    if (norm === "in stay") {
      return t("profile.card.stayInProgress", "Your stay is in progress");
    }
    if (norm === "in transit") {
      return t("profile.card.transitInProgress", "Your transit is in progress");
    }
    if (norm === "completed") {
      return props.variant === "hotel"
        ? t("profile.card.stayCompleted", "Stay Completed")
        : props.variant === "transport"
          ? t("profile.card.transitCompleted", "Transit Completed")
          : props.variant === "mice" || props.variant === "b2b"
            ? t("profile.card.eventCompleted", "Event Completed")
            : t("profile.card.tripCompleted", "Trip Completed");
    }
    if (norm === "proposal in progress") {
      return t("profile.card.proposalInProgress", "Proposal In progress");
    }
    if (norm === "proposal sent") {
      return t("profile.card.proposalSent", "Proposal Sent");
    }
    if (norm === "proposal ready") {
      return t("profile.card.proposalReady", "Proposal Ready");
    }
    if (norm === "new" || norm === "submitted" || norm === "pending") {
      return t("profile.card.proposalExpected", "Proposal expected within 24-48 hrs");
    }
    if (norm === "awaiting deposit") {
      return t("profile.card.awaitingDeposit", "30% Pending Payment");
    }
    if (norm === "awaiting payment") {
      return t("profile.card.awaitingPayment", "100% Pending Payment");
    }
    if (norm.includes("refund")) {
      return t("profile.card.refundCompleted", "Refund Completed");
    }
    return primaryStatusLabel || t("profile.card.tripBooking", "Trip Booking");
  })();

  const formatLocalizedBudget = (raw: string | undefined | null) => {
    if (!raw) return "";
    const trimmed = raw.trim();
    if (trimmed.toLowerCase() === "not specified") {
      return t("profile.card.notSpecified", "Not Specified");
    }

    const resolveSymbol = (c?: string) => {
      const u = (c || cardCurrency || "USD").toUpperCase();
      if (u === "EUR" || u === "€") return "€";
      if (u === "GBP" || u === "£") return "£";
      if (u === "EGP") return "EGP ";
      return "$";
    };

    // Case 1: Range like "3000.00-5000.00 usd" or "$3000 - $5000" or "3000 – 5000"
    const rangeMatch = trimmed.match(/^([$€£])?\s*([\d.,]+)\s*[-–—]\s*([$€£])?\s*([\d.,]+)\s*([a-zA-Z$€£]+)?$/i);
    if (rangeMatch) {
      const symbol = resolveSymbol(rangeMatch[1] || rangeMatch[3] || rangeMatch[5]);
      const minVal = parseFloat(rangeMatch[2].replace(/,/g, ""));
      const maxVal = parseFloat(rangeMatch[4].replace(/,/g, ""));
      const fmtMin = isNaN(minVal) ? rangeMatch[2] : minVal.toLocaleString("en-US", { maximumFractionDigits: 0 });
      const fmtMax = isNaN(maxVal) ? rangeMatch[4] : maxVal.toLocaleString("en-US", { maximumFractionDigits: 0 });
      return `${symbol}${fmtMin} – ${symbol}${fmtMax}`;
    }

    // Case 2: "Up to 5000.00 usd" or "From 3000.00 usd" or "5000.00 usd"
    const singleMatch = trimmed.match(/^(up to|from)?\s*([$€£])?\s*([\d.,]+)\s*([a-zA-Z$€£]+)?$/i);
    if (singleMatch) {
      const prefix = singleMatch[1] ? (singleMatch[1].toLowerCase() === "up to" ? "Up to " : "From ") : "";
      const symbol = resolveSymbol(singleMatch[2] || singleMatch[4]);
      const val = parseFloat(singleMatch[3].replace(/,/g, ""));
      const fmtVal = isNaN(val) ? singleMatch[3] : val.toLocaleString("en-US", { maximumFractionDigits: 0 });
      return `${prefix}${symbol}${fmtVal}`;
    }

    return trimmed;
  };

  const formatLocalizedCategory = (raw: string | undefined | null) => {
    if (!raw) return "";
    const low = raw.trim().toLowerCase();
    if (low.includes("honeymoon")) {
      return language === "it" ? "Luna di Miele" : language === "es" ? "Luna de Miel" : raw;
    }
    if (low.includes("family")) {
      return language === "it" ? "Famiglia" : language === "es" ? "Familia" : raw;
    }
    if (low.includes("adventure")) {
      return language === "it" ? "Avventura" : language === "es" ? "Aventura" : raw;
    }
    if (low.includes("cultural") || low.includes("culture")) {
      return language === "it" ? "Culturale" : language === "es" ? "Cultural" : raw;
    }
    if (low.includes("luxury")) {
      return language === "it" ? "Lusso" : language === "es" ? "Lujo" : raw;
    }
    return raw;
  };

  const formatLocalizedTravelType = (raw: string | undefined | null) => {
    if (!raw) return "";
    const low = raw.trim().toLowerCase();
    if (low.includes("group")) {
      return t("profile.card.group", "Group");
    }
    if (low.includes("private") || low === "tour") {
      return t("profile.card.private", "Private");
    }
    return raw;
  };

  return (
    <article className={`${styles.card} ${!hasImage ? styles.noImage : ""}`}>
      {hasImage && imageSrc && (
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
      )}

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
              <StatusPill
                label={primaryStatusLabel}
                variant={primaryStatusVariant}
                iconType={primaryStatusIconType}
                size="sm"
              />
              {props.secondaryStatusLabel && (
                <StatusPill
                  label={props.secondaryStatusLabel}
                  variant={props.secondaryStatusVariant || "gray"}
                  iconType={props.secondaryStatusIconType || "dot"}
                  size="sm"
                />
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
                label={t("profile.card.checkIn", "Check-In")}
                value={formatLocalizedDate(props.details.checkIn)}
                iconSize={16}
              />
              <DetailCell
                icon={HOTEL_ICONS.clock}
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
          ) : props.variant === "mice" || (props.variant as string) === "events" ? (() => {
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
                value={props.details.website?.trim() ? props.details.website : "-"}
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
                value={formatLocalizedCategory(props.details.tripCategory)}
              />
              <DetailCell
                icon={bookingCardIcons.trip.duration}
                label={t("profile.details.duration", "Duration")}
                value={formatLocalizedDuration(props.details.durationLabel)}
              />
              <DetailCell
                icon={bookingCardIcons.trip.returnDate}
                label={t("profile.card.travelDates", "Travel Dates")}
                value={formatLocalizedDateRange(props.details.travelDates)}
              />
              <DetailCell
                icon="/images/profile/booking/budget-orange.svg"
                label={t("profile.card.budget", "Budget")}
                value={formatLocalizedBudget(props.details.budget)}
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
                icon={TRIP_ICONS.departureDate}
                label={t("profile.card.departure", "Departure")}
                value={formatLocalizedDate(props.details.departureDate)}
              />
              <DetailCell
                icon={TRIP_ICONS.returnDate}
                label={t("profile.card.return", "Return")}
                value={formatLocalizedDate(props.details.returnDate)}
              />
              <DetailCell
                icon={TRIP_ICONS.travelType}
                label={t("profile.card.travelType", "Travel Type")}
                value={formatLocalizedTravelType(props.details.travelType)}
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
                    <span className={styles.metaMuted}>{t("profile.card.paid", "Paid")} {formatCurrency(resolveAmount(paidAmount))}</span>
                    <span className={styles.metaBullet}>•</span>
                    <span className={styles.metaStrong}>
                      {t("profile.card.remaining", "Remaining")} {formatCurrency(resolveAmount(remainingAmount))}
                    </span>
                  </p>
                )}
              {status !== "partially_paid" && status !== "cancelled" && status !== "rejected" && totalAmount != null && (
                <p className={styles.metaConfirmed}>
                  <span className={styles.metaMuted}>{t("profile.card.fullyPaid", "Fully Paid")}</span>
                  <span className={styles.metaBullet}>•</span>
                  <span className={styles.metaPrice}>{formatCurrency(resolveAmount(totalAmount))}</span>
                </p>
              )}
              {status === "cancelled" && (
                <p className={styles.metaCancelled}>{cancelledLabel || t("profile.card.cancelledByYou", "Cancelled by You — Apr 1, 2026")}</p>
              )}
              {status === "rejected" && (
                <p className={styles.metaCancelled}>{cancelledLabel || t("profile.card.rejectedByAdmin", "Request Rejected")}</p>
              )}
              {status !== "cancelled" &&
                status !== "rejected" &&
                (status !== "partially_paid" || paidAmount == null || remainingAmount == null) &&
                totalAmount == null && (
                  <p className={styles.metaInfo}>
                    <span className={styles.metaBullet}>•</span>{" "}
                    {footerStatusMessage}
                  </p>
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
