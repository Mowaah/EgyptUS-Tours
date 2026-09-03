"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "@/hooks/useTranslation";
import { Vehicle, TransportationBookingData, INITIAL_TRANSPORT_BOOKING } from "@/types";
import { PageHeader, SuccessModal, StepIndicator } from "@/components/shared";

import planPageStyles from "../PlanYourTripPage/PlanYourTripPage.module.scss";
import styles from "./BookTransportationPage.module.scss";

import StepTripDetails from "./steps/TripDetails/StepTripDetails";
import StepPersonalInfo from "./steps/PersonalInfo/StepPersonalInfo";
import StepPayment from "./steps/Payment/StepPayment";
import BookingSummary from "./BookingSummary/BookingSummary";

interface BookTransportationPageProps {
  vehicle: Vehicle;
}

export default function BookTransportationPage({ vehicle }: BookTransportationPageProps) {
  const router = useRouter();
  const { formatCurrency } = useCurrency();
  const { t } = useTranslation("booking");
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const stepIndicatorRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState<TransportationBookingData>(INITIAL_TRANSPORT_BOOKING);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const steps = [
    { number: 1, label: t("transportBooking.steps.rideDetails", "Trip Details") },
    { number: 2, label: t("transportBooking.steps.contactDetails", "Personal Info") },
    { number: 3, label: t("transportBooking.steps.payment", "Payment") },
  ];

  const handleChange = (patch: Partial<TransportationBookingData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
    setFieldErrors({});
  };

  const handleContinue = () => {
    const errs: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.pickupLocation?.trim()) errs.pickupLocation = t("errors.pickupLocationRequired", "Pickup location is required.");
      if (!formData.dropoffLocation?.trim()) errs.dropoffLocation = t("errors.dropoffLocationRequired", "Drop-off location is required.");
      if (!formData.pickupDate?.trim()) errs.pickupDate = t("errors.pickupDateRequired", "Pickup date is required.");
      if (!formData.pickupTime?.trim()) errs.pickupTime = t("errors.pickupTimeRequired", "Pickup time is required.");
    } else if (currentStep === 2) {
      if (!formData.name?.trim()) errs.name = t("errors.nameRequired", "Full name is required.");
      if (!formData.email?.trim()) {
        errs.email = t("errors.emailRequired", "Email address is required.");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errs.email = t("errors.emailInvalid", "Please enter a valid email address.");
      }
      if (!formData.phone?.trim() || formData.phone.trim() === "+1" || formData.phone.trim() === "+20") {
        errs.phone = t("errors.phoneRequired", "Phone number is required.");
      }
      if (!formData.nationality?.trim()) errs.nationality = t("errors.nationalityRequired", "Nationality is required.");
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
          { label: t("transportBooking.breadcrumbTransport", "Transportation"), href: "/transportation" },
          { label: t("transportBooking.breadcrumbDetails", "Details"), href: `/transportation/${vehicle.id}` },
          { label: t("transportBooking.breadcrumb", "Booking"), isCurrent: true },
        ]}
        title={t("transportBooking.pageTitle", "Your Car Awaits")}
        subtitle={t("transportBooking.pageSubtitle", "Enter your details to complete your car booking easily and securely")}
        backButton={{ text: t("transportBooking.backToTransport", "Back To Transportation"), href: "/transportation" }}
        decorationSrc="/images/dotted-line3.svg"
      />

      <div ref={stepIndicatorRef} className={styles.stepperWrap}>
        <StepIndicator steps={steps} currentStep={currentStep} />
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
          title={t("transportBooking.success.title", "Booking Confirmed!")}
          message={t("transportBooking.success.message", "Your vehicle has been successfully booked. Confirmation details have been sent to your email.")}
          primaryButtonText={t("transportBooking.success.viewBooking", "View Booking")}
          buttonText={t("transportBooking.success.backToHome", "Back to Home")}
          onPrimaryClick={() => router.push("/")}
          onClose={() => router.push("/")}
          metadata={[
            { label: t("sidebar.bookingSummary", "Booking Reference"), value: `BK-${String(Math.floor(Math.random() * 90000000 + 10000000)).padStart(6, "0")}` },
            { label: t("transportBooking.rideDetails.vehicle", "Vehicle"), value: `${vehicle.type} - ${vehicle.name}` },
            { label: t("transportBooking.rideDetails.pickupDate", "Pickup Date"), value: formData.pickupDate || "2026-01-22" },
            { label: t("sidebar.totalPrice", "Total Paid"), value: formatCurrency(Number(vehicle.price.replace(/,/g, "")) || 0), valueColor: "#FF6600" },
          ]}
        />
      )}
    </div>
  );
}
