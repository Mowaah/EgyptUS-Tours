import React from "react";
import planPage from "../../../PlanYourTripPage/PlanYourTripPage.module.scss";
import localStyles from "../../BookPrivateTripPage.module.scss";
import stepStyles from "./StepBookingSummary.module.scss";
import { BookingData } from "../../BookPrivateTripPage";
import { Trip } from "@/types";
import RightSidebar from "@/components/shared/BookingSidebar/BookingSidebar";
import { BookingDetailsSections, BookingStepFooter, CheckboxIndicator } from "@/components/shared";

interface StepBookingSummaryProps {
  trip: Trip;
  formData: BookingData;
  onChange: (patch: Partial<BookingData>) => void;
  onPrevious: () => void;
  onContinue: () => void;
  totalAmount: number;
  depositAmount: number;
}

export default function StepBookingSummary({
  trip,
  formData,
  onChange,
  onPrevious,
  onContinue,
  totalAmount,
  depositAmount
}: StepBookingSummaryProps) {
  const specialRequestItems = formData.specialRequests
    ? formData.specialRequests.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const rooms = [
    formData.rooms.single > 0 ? `${formData.rooms.single} × Single Room - Garden View` : null,
    formData.rooms.double > 0 ? `${formData.rooms.double} × Double Room - Sea View` : null,
    formData.rooms.triple > 0 ? `${formData.rooms.triple} × Triple Room - Garden View` : null,
  ].filter((room): room is string => Boolean(room));

  const sections = [
    {
      title: "Contact Info",
      icon: "/images/summary/contact.svg",
      fields: [
        { label: "Name", value: formData.name },
        { label: "Email", value: formData.email },
        { label: "Phone Number", value: formData.phone },
        { label: "Nationality", value: formData.nationality },
      ],
    },
    {
      title: "Trip Info",
      icon: "/images/summary/trip.svg",
      fields: [
        { label: "Trip Name", value: trip.title },
        { label: "Destination", value: "Santorini, Greece" },
        { label: "Travel Type", value: "Private" },
        { label: "Duration", value: "7 Nights / 8 Days" },
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
        <span>I have read and agree to the <a href="#">Terms & Conditions and Cancellation</a> Policy.</span>
      </label>

      <BookingStepFooter
        onPrevious={onPrevious}
        onContinue={onContinue}
        continueLabel="Continue To Payment"
        continueDisabled={!formData.termsAccepted}
        showMoneyIcon
      />
    </div>
  );
}
