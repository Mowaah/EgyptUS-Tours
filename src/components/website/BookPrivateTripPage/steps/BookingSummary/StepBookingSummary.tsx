import React, { useState } from "react";
import planPage from "../../../PlanYourTripPage/PlanYourTripPage.module.scss";
import localStyles from "../../BookPrivateTripPage.module.scss";
import stepStyles from "./StepBookingSummary.module.scss";
import { BookingData } from "../../BookPrivateTripPage";
import { Trip } from "@/types";
import RightSidebar from "@/components/shared/BookingSidebar/BookingSidebar";
import { BookingDetailsSections, BookingStepFooter, CheckboxIndicator } from "@/components/shared";
import ImportantLinksModal from "@/components/website/TripDetailPage/TripImportantLinks/ImportantLinksModal";
import { getNationalityName } from "@/utils/nationality";

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
}: StepBookingSummaryProps) {
  const [showTermsModal, setShowTermsModal] = useState(false);

  const specialRequestItems = formData.specialRequests
    ? formData.specialRequests.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const rooms = Object.entries(formData.rooms || {})
    .filter(([_, count]) => (count as number) > 0)
    .map(([key, count]) => {
      const typeName = key.charAt(0).toUpperCase() + key.slice(1);
      const roomTitle = typeName.toLowerCase().endsWith("room") ? typeName : `${typeName} Room`;
      return `${count} × ${roomTitle}`;
    });

  const formattedDuration = (() => {
    if (!trip.duration) return "N/A";
    if (typeof trip.duration === "string") return trip.duration;
    const { days, nights } = trip.duration;
    if (days && nights) return `${nights} Nights / ${days} Days`;
    if (days) return `${days} Days`;
    return "N/A";
  })();

  const destination = trip.location || "Egypt";
  const travelType = isGroupTrip ? "Group" : "Private";

  const sections = [
    {
      title: "Contact Info",
      icon: "/images/summary/contact.svg",
      fields: [
        { label: "Name", value: formData.name },
        { label: "Email", value: formData.email },
        { label: "Phone Number", value: formData.phone },
        { label: "Nationality", value: getNationalityName(formData.nationality) },
      ],
    },
    {
      title: "Trip Info",
      icon: "/images/summary/trip.svg",
      fields: [
        { label: "Trip Name", value: trip.title },
        { label: "Destination", value: destination },
        { label: "Travel Type", value: travelType },
        { label: "Duration", value: formattedDuration },
      ],
    },
    ...(rooms.length > 0
      ? [
        {
          title: "Rooms",
          icon: "/images/summary/rooms.svg",
          listItems: rooms,
        },
      ]
      : []),
    {
      title: "Special Requests",
      icon: "/images/summary/special.svg",
      listItems: specialRequestItems,
      emptyStateText: "None",
    },
  ];

  return (
    <div className={planPage.stepFormCard}>
      <header className={planPage.stepFormCardHeader}>
        <div className={`${planPage.formHeaderColumn} ${stepStyles.headerCol}`}>
          <h2 className={planPage.formTitle}>Review & Confirm Your Booking</h2>
          <p className={`${planPage.formSubtitle} ${stepStyles.subtitle}`}>Please review your trip details carefully before confirming your reservation.</p>
        </div>
      </header>

      <div className={localStyles.twoColumnLayout}>
        <BookingDetailsSections sections={sections} className={stepStyles.leftColumnCards} />

        <RightSidebar
          trip={trip}
          formData={formData}
          totalAmount={totalAmount}
          depositAmount={depositAmount}
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
          I have read and agree to the{" "}
          <button
            type="button"
            className={stepStyles.linkBtn}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowTermsModal(true);
            }}
          >
            Terms & Conditions and Cancellation
          </button>{" "}
          Policy.
        </span>
      </label>

      <BookingStepFooter
        onPrevious={onPrevious}
        onContinue={onContinue}
        continueLabel={isSubmitting ? "Connecting to Paymob..." : "Continue To Payment"}
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
