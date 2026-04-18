"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Hotel } from "@/types";
import { BookingData, INITIAL_BOOKING_DATA } from "@/types";
import { PageHeader, SuccessModal, StepIndicator } from "@/components/shared";

import planPageStyles from "../PlanYourTripPage/PlanYourTripPage.module.scss";

import StepRoomDates from "./steps/RoomDates/StepRoomDates";
import StepPersonalInfo from "./steps/PersonalInfo/StepPersonalInfo";
import StepPayment from "./steps/Payment/StepPayment";

export type { BookingData };

const STEPS = [
  { number: 1, label: "Room & Dates" },
  { number: 2, label: "Personal Info" },
  { number: 3, label: "Payment" },
];

interface BookHotelPageProps {
  hotel: Hotel;
}

export default function BookHotelPage({ hotel }: BookHotelPageProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<BookingData>(INITIAL_BOOKING_DATA);

  const handleChange = (patch: Partial<BookingData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const totalRooms = formData.rooms.single + formData.rooms.double + formData.rooms.triple;
  const totalGuests = formData.adults + formData.children + formData.infants;
  const totalAmount = hotel.pricePerNight * Math.max(totalRooms, 1);
  const vatAmount = totalAmount * 0.1;
  const depositAmount = (totalAmount + vatAmount) * 0.3;

  const handleContinue = () => {
    if (currentStep < 3) setCurrentStep((s) => s + 1);
    else setShowSuccess(true);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const sharedProps = {
    hotel,
    formData,
    onChange: handleChange,
    onPrevious: handlePrevious,
    onContinue: handleContinue,
    totalAmount,
    vatAmount,
    depositAmount,
    totalRooms,
    totalGuests,
  };

  return (
    <div className={planPageStyles.page}>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Hotels", href: "/hotels" },
          { label: "Hotel Details", href: `/hotels/${hotel.id}` },
          { label: "Booking", isCurrent: true },
        ]}
        title={`Book ${hotel.name}`}
        subtitle="Enter your details to complete your hotel booking easily and securely"
        backButton={{ text: "Back To Hotel Details", href: `/hotels/${hotel.id}` }}
        decorationSrc="/images/dotted-line3.svg"
      />

      <StepIndicator steps={STEPS} currentStep={currentStep} />

      <main className={planPageStyles.mainContent}>
        <div className={planPageStyles.content}>
          {currentStep === 1 && (
            <StepRoomDates
              formData={formData}
              onChange={handleChange}
              onContinue={() => setCurrentStep(2)}
              hotel={hotel}
            />
          )}
          {currentStep === 2 && <StepPersonalInfo {...sharedProps} />}
          {currentStep === 3 && <StepPayment {...sharedProps} />}
        </div>
      </main>

      {showSuccess && (
        <SuccessModal
          title="Booking Confirmed!"
          message="Your hotel reservation has been successfully booked. Confirmation details have been sent to your email."
          primaryButtonText="View Booking"
          buttonText="Back to Home"
          onPrimaryClick={() => router.push("/")}
          onClose={() => router.push("/")}
          metadata={[
            { label: "Booking Reference", value: `#HB${Math.floor(Math.random() * 90000000 + 10000000)}` },
            { label: "Hotel", value: hotel.name },
            { label: "Check-in", value: formData.startDate || "—" },
            { label: "Check-out", value: formData.endDate || "—" },
            { label: "Total Price", value: `$${totalAmount.toFixed(2)}`, valueColor: "#FF6600" },
            { label: "Paid Now", value: `$${depositAmount.toFixed(2)}`, valueColor: "#FF6600" },
          ]}
        />
      )}
    </div>
  );
}
