import React, { useMemo, useState } from "react";
import planPage from "../../../PlanYourTripPage/PlanYourTripPage.module.scss";
import localStyles from "../../BookPrivateTripPage.module.scss";
import stepStyles from "./StepBookingSummary.module.scss";
import { BookingData } from "../../BookPrivateTripPage";
import { Trip } from "@/types";
import RightSidebar from "@/components/shared/BookingSidebar/BookingSidebar";
import { BookingDetailsSections, BookingStepFooter, CheckboxIndicator } from "@/components/shared";
import ImportantLinksModal from "@/components/website/TripDetailPage/TripImportantLinks/ImportantLinksModal";
import { getNationalityName } from "@/utils/nationality";
import { useTranslation } from "@/hooks/useTranslation";
import { MultiCurrencyPrice } from "@/constants/currency";
import { calculateTripBookingPrice } from "@/utils/bookingPricing";

interface StepBookingSummaryProps {
  trip: Trip;
  formData: BookingData;
  onChange: (patch: Partial<BookingData>) => void;
  onPrevious: () => void;
  onContinue: () => void;
  totalAmount: number;
  depositAmount: number;
  isGroupTrip?: boolean;
  isSubmitting?: boolean;
  totalPrices?: MultiCurrencyPrice;
  depositPrices?: MultiCurrencyPrice;
}

export default function StepBookingSummary({
  trip,
  formData,
  onChange,
  onPrevious,
  onContinue,
  totalAmount,
  depositAmount,
  isGroupTrip,
  isSubmitting = false,
  totalPrices,
  depositPrices,
}: StepBookingSummaryProps) {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const { t } = useTranslation("booking");

  const specialRequestItems = formData.specialRequests
    ? formData.specialRequests.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const pricingSummary = useMemo(() => {
    return calculateTripBookingPrice(trip, formData, isGroupTrip ? "group" : "private");
  }, [trip, formData, isGroupTrip]);

  const roomItems = useMemo(() => {
    if (!pricingSummary || pricingSummary.lineItems.length === 0) return [];
    return pricingSummary.lineItems.map((item) => {
      const adultLabel = `${item.adultCount} ${item.adultCount === 1 ? t("sidebar.adult", "Adult") : t("sidebar.adults", "Adults")}`;
      const childList = item.children.map((c) => `${c.age} years`).join(", ");
      const childLabel = item.children.length > 0
        ? ` . ${item.children.length} ${item.children.length === 1 ? t("sidebar.child", "Child") : t("sidebar.children", "Children")} (${childList})`
        : "";
      const occupantText = `${adultLabel}${childLabel}`;

      return (
        <span key={`${item.roomType}-${item.viewLabel}`}>
          <strong>{item.quantity} × {item.roomName} - {item.viewLabel}</strong>{" "}
          <span className={stepStyles.occupantBreakdown}>{occupantText}</span>
        </span>
      );
    });
  }, [pricingSummary, t]);

  const formattedDuration = (() => {
    if (!trip.duration) return "N/A";
    if (typeof trip.duration === "string") return trip.duration;
    const { days, nights } = trip.duration;
    if (days && nights) {
      const nightsLabel = nights === 1 ? t("sidebar.night", "Night") : t("sidebar.nights", "Nights");
      const daysLabel = days === 1 ? t("sidebar.day", "Day") : t("sidebar.days", "Days");
      return `${nights} ${nightsLabel} / ${days} ${daysLabel}`;
    }
    if (days) {
      const daysLabel = days === 1 ? t("sidebar.day", "Day") : t("sidebar.days", "Days");
      return `${days} ${daysLabel}`;
    }
    return "N/A";
  })();

  const destination = trip.location || "Egypt";
  const travelType = isGroupTrip ? t("tripBooking.groupTitle", "Group Tour") : t("tripBooking.privateTitle", "Private Tour");

  const sections = [
    {
      title: t("tripBooking.step3.contactInfo", "Contact Info"),
      icon: "/images/summary/contact.svg",
      fields: [
        { label: t("tripBooking.step2.fullName", "Name"), value: formData.name },
        { label: t("tripBooking.step2.email", "Email"), value: formData.email },
        { label: t("tripBooking.step2.phone", "Phone Number"), value: formData.phone },
        { label: t("tripBooking.step2.nationality", "Nationality"), value: getNationalityName(formData.nationality) },
      ],
    },
    {
      title: t("tripBooking.step3.tripInfo", "Trip Info"),
      icon: "/images/summary/trip.svg",
      fields: [
        { label: t("tripBooking.success.tripName", "Trip Name"), value: trip.title },
        { label: t("sidebar.destination", "Destination"), value: destination },
        { label: t("tripBooking.success.travelType", "Travel Type"), value: travelType },
        { label: t("sidebar.duration", "Duration"), value: formattedDuration },
      ],
    },
    ...(roomItems.length > 0
      ? [
        {
          title: t("sidebar.rooms", "Rooms"),
          icon: "/images/summary/rooms.svg",
          listItems: roomItems,
        },
      ]
      : []),
    {
      title: t("hotelBooking.personalInfo.specialRequests", "Special Requests"),
      icon: "/images/summary/special.svg",
      listItems: specialRequestItems,
      emptyStateText: "None",
    },
  ];

  return (
    <div className={planPage.stepFormCard}>
      <header className={planPage.stepFormCardHeader}>
        <div className={`${planPage.formHeaderColumn} ${stepStyles.headerCol}`}>
          <h2 className={planPage.formTitle}>{t("tripBooking.step3.title", "Review & Confirm Your Booking")}</h2>
          <p className={`${planPage.formSubtitle} ${stepStyles.subtitle}`}>{t("tripBooking.step3.subtitle", "Please review your trip details carefully before confirming your reservation.")}</p>
        </div>
      </header>

      <div className={localStyles.twoColumnLayout}>
        <BookingDetailsSections sections={sections} className={stepStyles.leftColumnCards} />

        <RightSidebar
          trip={trip}
          formData={formData}
          totalAmount={totalAmount}
          depositAmount={depositAmount}
          totalPrices={totalPrices}
          depositPrices={depositPrices}
        />
      </div>

      <label className={stepStyles.checkboxRow}>
        <input
          type="checkbox"
          name="termsAccepted"
          checked={formData.termsAccepted}
          onChange={(e) => onChange({ termsAccepted: e.target.checked })}
          className={stepStyles.checkboxInputHidden}
        />
        <CheckboxIndicator variant="square" size="md" selected={formData.termsAccepted} aria-hidden />
        <span>
          {t("terms.agreePrefix", "I have read and agree to the")}{" "}
          <button
            type="button"
            className={stepStyles.linkBtn}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowTermsModal(true);
            }}
          >
            {t("terms.termsAndCancellation", "Terms & Conditions and Cancellation")}
          </button>{" "}
          {t("terms.policySuffix", "Policy.")}
        </span>
      </label>

      <BookingStepFooter
        onPrevious={onPrevious}
        onContinue={onContinue}
        continueLabel={isSubmitting ? t("tripBooking.step3.connectingPaymob", "Connecting to Paymob...") : t("tripBooking.step3.continueToPayment", "Continue To Payment")}
        continueDisabled={!formData.termsAccepted || isSubmitting}
        showMoneyIcon
      />

      <ImportantLinksModal
        open={showTermsModal}
        initialTab="terms"
        onClose={() => setShowTermsModal(false)}
      />
    </div>
  );
}
