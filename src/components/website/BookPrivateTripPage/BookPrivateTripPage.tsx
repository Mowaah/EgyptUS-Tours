"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trip } from "@/types";
import { BookingData, INITIAL_BOOKING_DATA } from "@/types";
import { PageHeader, SuccessModal, StepIndicator } from "@/components/shared";

import planPageStyles from "../PlanYourTripPage/PlanYourTripPage.module.scss";
import styles from "../BookPrivateTripPage/BookPrivateTripPage.module.scss";

import StepYourDetails from "./steps/YourDetails/StepYourDetails";
import StepBookingSummary from "./steps/BookingSummary/StepBookingSummary";
import StepPayment from "./steps/Payment/StepPayment";

export type { BookingData };

const STEPS = [
  { number: 1, label: "Your Details" },
  { number: 2, label: "Booking Summary" },
  { number: 3, label: "Payment" },
];

interface BookPrivateTripPageProps {
  trip: Trip;
  isGroupTrip?: boolean;
}

export default function BookPrivateTripPage({ trip, isGroupTrip }: BookPrivateTripPageProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState<BookingData>(INITIAL_BOOKING_DATA);

  const handleChange = (patch: Partial<BookingData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const totalAmount = trip.privatePrice ? trip.privatePrice * formData.adults : 145.00;
  const depositAmount = totalAmount * 0.3;

  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep((s) => s + 1);
    } else {
      setShowSuccess(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };

  return (
    <div className={planPageStyles.page}>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Trips", href: "/trips" },
          { label: "Trip Details", href: `/trips/${trip.id}` },
          { label: "Booking", isCurrent: true }
        ]}
        title={trip.title}
        subtitle="Provide your details to customize and secure your reservation."
        backButton={{ text: "Trip Details", href: `/trips/${trip.id}` }}
        decorationSrc="/images/dotted-line3.svg"
      />

      <StepIndicator steps={STEPS} currentStep={currentStep} />

      <main className={planPageStyles.mainContent}>
        <div className={planPageStyles.content}>
          {currentStep === 1 && (
            <StepYourDetails
              formData={formData}
              onChange={handleChange}
              onContinue={() => setCurrentStep(2)}
              isGroupTrip={isGroupTrip}
            />
          )}

          {currentStep === 2 && (
            <StepBookingSummary
              trip={trip}
              formData={formData}
              onChange={handleChange}
              onPrevious={handlePrevious}
              onContinue={handleContinue}
              totalAmount={totalAmount}
              depositAmount={depositAmount}
            />
          )}

          {currentStep === 3 && (
            <StepPayment
              trip={trip}
              formData={formData}
              onChange={handleChange}
              onPrevious={handlePrevious}
              onContinue={handleContinue}
              totalAmount={totalAmount}
              depositAmount={depositAmount}
            />
          )}
        </div>
      </main>

      {showSuccess && (
        <SuccessModal
          title="Booking Confirmed!"
          message="Your trip has been successfully booked. Confirmation details have been sent to your email."
          primaryButtonText="View Booking"
          buttonText="Back to Home"
          onPrimaryClick={() => router.push("/")}
          onClose={() => router.push("/")}
        >
          <div style={{ background: '#F8FAFD', borderRadius: '16px', padding: '24px', margin: '24px 0', textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#666', display: 'block' }}>Booking Reference</span>
                <strong style={{ fontSize: '14px', color: '#1A1A1A' }}>#BK53602205</strong>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#666', display: 'block' }}>Trip Name</span>
                <strong style={{ fontSize: '14px', color: '#1A1A1A' }}>{trip.title}</strong>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#666', display: 'block' }}>Pickup Date</span>
                <strong style={{ fontSize: '14px', color: '#1A1A1A' }}>{formData.startDate || "2026-03-15"}</strong>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#666', display: 'block' }}>Total Paid</span>
                <strong style={{ fontSize: '14px', color: '#FF6600' }}>${depositAmount.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </SuccessModal>
      )}
    </div>
  );
}
