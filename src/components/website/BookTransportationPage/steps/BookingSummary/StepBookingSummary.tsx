"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { TransportationBookingData, Vehicle } from "@/types";
import {
  BookingDetailsSections,
  BookingStepFooter,
  CheckboxIndicator,
  type BookingDetailsSection,
} from "@/components/shared";
import BookingSummary from "../../BookingSummary/BookingSummary";
import ImportantLinksModal from "@/components/website/TripDetailPage/TripImportantLinks/ImportantLinksModal";
import { getNationalityName } from "@/utils/nationality";
import { formatDateDDMMYYYY, formatDisplayTime } from "@/utils/dateFormat";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./StepBookingSummary.module.scss";

interface StepBookingSummaryProps {
  vehicle: Vehicle;
  formData: TransportationBookingData;
  onChange: (patch: Partial<TransportationBookingData>) => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export default function StepBookingSummary({
  vehicle,
  formData,
  onChange,
  onPrevious,
  onSubmit,
  isSubmitting = false,
}: StepBookingSummaryProps) {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const { t } = useTranslation("booking");

  const specialRequestItems = useMemo(() => {
    if (!formData.specialRequests?.trim()) return [];
    return formData.specialRequests
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [formData.specialRequests]);

  const sections: BookingDetailsSection[] = [
    {
      title: t("transportBooking.summary.contactInfo", "Contact Info"),
      icon: "/images/summary/contact.svg",
      fields: [
        { label: t("transportBooking.contactDetails.name", "Name"), value: formData.name || "—" },
        { label: t("transportBooking.contactDetails.email", "Email"), value: formData.email || "—" },
        { label: t("transportBooking.contactDetails.phone", "Phone Number"), value: formData.phone || "—" },
        { label: t("transportBooking.contactDetails.nationality", "Nationality"), value: getNationalityName(formData.nationality) || formData.nationality || "—" },
      ],
      fieldsColumns: 2,
    },
    {
      title: t("transportBooking.summary.tripInfo", "Trip Info"),
      icon: "/images/summary/trip.svg",
      fields: [
        { label: t("transportBooking.rideDetails.pickupLocation", "Pickup Location"), value: formData.pickupLocation || "—" },
        { label: t("transportBooking.rideDetails.dropoffLocation", "Drop-off Location"), value: formData.dropoffLocation || "—" },
        { label: t("transportBooking.rideDetails.pickupDate", "Pickup Date"), value: formatDateDDMMYYYY(formData.pickupDate) || "—" },
        { label: t("transportBooking.rideDetails.pickupTime", "Pickup Time"), value: formatDisplayTime(formData.pickupTime) },
        {
          label: t("transportBooking.rideDetails.passengers", "Passengers"),
          value: `${formData.passengers} ${formData.passengers === 1 ? t("transportBooking.rideDetails.passenger", "Passenger") : t("transportBooking.rideDetails.passengers", "Passengers")}`,
        },
        {
          label: t("transportBooking.rideDetails.luggage", "Luggage"),
          value: `${formData.luggage} ${formData.luggage === 1 ? t("transportBooking.rideDetails.bag", "Bag") : t("transportBooking.rideDetails.bags", "Bags")}`,
        },
      ],
      fieldsColumns: 2,
    },
    {
      title: t("transportBooking.contactDetails.specialRequests", "Special Requests"),
      icon: "/images/summary/special.svg",
      listItems: specialRequestItems.length > 0 ? specialRequestItems : [t("transportBooking.summary.noSpecialRequests", "No special requests specified.")],
    },
  ];

  return (
    <div className={styles.stepCard}>
      <header className={styles.header}>
        <h2 className={styles.title}>{t("transportBooking.summary.title", "Review & Confirm Your Booking")}</h2>
        <p className={styles.subtitle}>
          {t("transportBooking.summary.subtitle", "Please review your trip details carefully before confirming your reservation.")}
        </p>
      </header>

      <div className={styles.contentRow}>
        <div className={styles.leftColumn}>
          <BookingDetailsSections sections={sections} />
        </div>

        <div className={styles.rightColumn}>
          <BookingSummary vehicle={vehicle} formData={formData} />
        </div>
      </div>

      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={formData.termsAccepted}
          onChange={(e) => onChange({ termsAccepted: e.target.checked })}
          className={styles.checkboxInputHidden}
        />
        <CheckboxIndicator
          variant="square"
          size="md"
          selected={formData.termsAccepted}
          aria-hidden
        />
        <span>
          {t("terms.agreePrefix", "I have read and agree to the")}{" "}
          <button
            type="button"
            className={styles.linkBtn}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowTermsModal(true);
            }}
          >
            {t("terms.termsAndCancellation", "Terms & Conditions and Cancellation Policy")}
          </button>
          .
        </span>
      </label>

      <BookingStepFooter
        onPrevious={onPrevious}
        onContinue={onSubmit}
        continueLabel={isSubmitting ? t("transportBooking.checkoutStarting", "Starting Checkout...") : t("buttons.continueToPayment", "Continue To Payment")}
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
