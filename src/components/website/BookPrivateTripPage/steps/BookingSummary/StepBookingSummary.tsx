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
import { useTranslation } from "@/hooks/useTranslation";

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
  const { t } = useTranslation("booking");

  const specialRequestItems = formData.specialRequests
    ? formData.specialRequests.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const rooms = (() => {
    const roomGroupsMap: Record<string, { count: number; name: string; view: string }> = {};
    const roomEntries = Object.entries(formData.rooms || {}).filter(([_, count]) => (count as number) > 0);

    roomEntries.forEach(([type, count]) => {
      const totalCount = count as number;
      const typeName = type.charAt(0).toUpperCase() + type.slice(1);
      const roomTitle = typeName.toLowerCase().endsWith("room") ? typeName : `${typeName} Room`;
      const customizations = formData.roomCustomizations?.[type] || [];

      for (let i = 0; i < totalCount; i++) {
        const opt = customizations[i] || "garden";
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
          };
        }
        roomGroupsMap[groupKey].count += 1;
      }
    });

    return Object.values(roomGroupsMap).map((g) => `${g.count} × ${g.name} - ${g.view}`);
  })();

  const formattedDuration = (() => {
    if (!trip.duration) return "N/A";
    if (typeof trip.duration === "string") return trip.duration;
    const { days, nights } = trip.duration;
    if (days && nights) return `${nights} Nights / ${days} Days`;
    if (days) return `${days} Days`;
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
    ...(rooms.length > 0
      ? [
        {
          title: t("sidebar.rooms", "Rooms"),
          icon: "/images/summary/rooms.svg",
          listItems: rooms,
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
            Terms &amp; Conditions and Cancellation
          </button>{" "}
          Policy.
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
