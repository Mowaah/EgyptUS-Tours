"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Vehicle, TransportationBookingData, INITIAL_TRANSPORT_BOOKING } from "@/types";
import { PageHeader, SuccessModal, StepIndicator } from "@/components/shared";

import planPageStyles from "../PlanYourTripPage/PlanYourTripPage.module.scss";
import styles from "./BookTransportationPage.module.scss";

import StepTripDetails from "./steps/TripDetails/StepTripDetails";
import StepPersonalInfo from "./steps/PersonalInfo/StepPersonalInfo";
import StepPayment from "./steps/Payment/StepPayment";
import BookingSummary from "./BookingSummary/BookingSummary";

const STEPS = [
  { number: 1, label: "Trip Details" },
  { number: 2, label: "Personal Info" },
  { number: 3, label: "Payment" },
];

interface BookTransportationPageProps {
  vehicle: Vehicle;
}

export default function BookTransportationPage({ vehicle }: BookTransportationPageProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const stepIndicatorRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState<TransportationBookingData>(INITIAL_TRANSPORT_BOOKING);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (patch: Partial<TransportationBookingData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
    setFieldErrors({});
  };

  const handleContinue = () => {
    const errs: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.pickupLocation?.trim()) errs.pickupLocation = "Pickup location is required.";
      if (!formData.dropoffLocation?.trim()) errs.dropoffLocation = "Drop-off location is required.";
      if (!formData.pickupDate?.trim()) errs.pickupDate = "Pickup date is required.";
      if (!formData.pickupTime?.trim()) errs.pickupTime = "Pickup time is required.";
    } else if (currentStep === 2) {
      if (!formData.name?.trim()) errs.name = "Full name is required.";
      if (!formData.email?.trim()) {
        errs.email = "Email address is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errs.email = "Please enter a valid email address.";
      }
      if (!formData.phone?.trim() || formData.phone.trim() === "+1" || formData.phone.trim() === "+20") {
        errs.phone = "Phone number is required.";
      }
      if (!formData.nationality?.trim()) errs.nationality = "Nationality is required.";
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setFieldErrors({});
    if (currentStep < 3) setCurrentStep((s) => s + 1);
    else setShowSuccess(true);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const sharedProps = {
    vehicle,
    formData,
    onChange: handleChange,
    onPrevious: handlePrevious,
    onContinue: handleContinue,
    errors: fieldErrors,
  };

  return (
    <div className={planPageStyles.page}>
      <PageHeader
        className={styles.header}
        breadcrumbs={[
          { label: "Transportation", href: "/transportation" },
          { label: "Details", href: `/transportation/${vehicle.id}` },
          { label: "Booking", isCurrent: true },
        ]}
        title="Your Car Awaits"
        subtitle="Enter your details to complete your car booking easily and securely"
        backButton={{ text: "Back To Transportation", href: "/transportation" }}
        decorationSrc="/images/dotted-line3.svg"
      />

      <div ref={stepIndicatorRef} className={styles.stepperWrap}>
        <StepIndicator steps={STEPS} currentStep={currentStep} />
      </div>

      <main className={planPageStyles.mainContent}>
        <div className={planPageStyles.content}>
          <div className={styles.layout}>
            <div className={styles.formArea}>
              {currentStep === 1 && <StepTripDetails {...sharedProps} />}
              {currentStep === 2 && <StepPersonalInfo {...sharedProps} />}
              {currentStep === 3 && <StepPayment {...sharedProps} />}
            </div>

            <BookingSummary vehicle={vehicle} formData={formData} />
          </div>
        </div>
      </main>

      {showSuccess && (
        <SuccessModal
          title="Booking Confirmed!"
          message="Your vehicle has been successfully booked. Confirmation details have been sent to your email."
          primaryButtonText="View Booking"
          buttonText="Back to Home"
          onPrimaryClick={() => router.push("/")}
          onClose={() => router.push("/")}
          metadata={[
            { label: "Booking Reference", value: `#BK${Math.floor(Math.random() * 90000000 + 10000000)}` },
            { label: "Vehicle", value: `${vehicle.type} - ${vehicle.name}` },
            { label: "Pickup Date", value: formData.pickupDate || "2026-01-22" },
            { label: "Total Paid", value: "$110.42", valueColor: "#FF6600" },
          ]}
        />
      )}
    </div>
  );
}
