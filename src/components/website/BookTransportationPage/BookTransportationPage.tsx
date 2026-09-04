"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function resolvePaymentUrl(paymentUrl: string) {
  const trimmed = paymentUrl.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return new URL(trimmed, BASE_URL).toString();
}

export interface SavedTransportBookingInfo {
  id: string | number;
  vehicleSlug?: string;
  vehicleName?: string;
  pickupDate?: string;
  totalAmount?: number;
  depositAmount?: number;
}

export function saveTransportBookingInfo(info: SavedTransportBookingInfo) {
  try {
    const data = JSON.stringify({ ...info, timestamp: Date.now() });
    localStorage.setItem("last_transport_booking", data);
    sessionStorage.setItem("last_transport_booking", data);
  } catch (e) {
    console.error("Failed to save transport booking info", e);
  }
}

export function getTransportBookingInfo(): SavedTransportBookingInfo | null {
  try {
    const raw = localStorage.getItem("last_transport_booking") || sessionStorage.getItem("last_transport_booking");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const savedAt = Number(parsed.timestamp || 0);
    if (!savedAt || Date.now() - savedAt > 24 * 60 * 60 * 1000) {
      clearTransportBookingInfo();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearTransportBookingInfo() {
  try {
    localStorage.removeItem("last_transport_booking");
    sessionStorage.removeItem("last_transport_booking");
  } catch {}
}

interface BookTransportationPageProps {
  vehicle: Vehicle;
}

export default function BookTransportationPage({ vehicle }: BookTransportationPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formatCurrency } = useCurrency();
  const { t } = useTranslation("booking");
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<SavedTransportBookingInfo | null>(null);
  const stepIndicatorRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState<TransportationBookingData>(INITIAL_TRANSPORT_BOOKING);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Check for successful payment redirect back to this page
  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    const isBookingSuccess =
      urlParams.get("booking_success") === "true" ||
      urlParams.get("booking_success") === "1" ||
      searchParams.get("booking_success") === "true" ||
      searchParams.get("booking_success") === "1";

    const successParam = (urlParams.get("success") || searchParams.get("success") || "").toLowerCase();
    const pendingParam = (urlParams.get("pending") || searchParams.get("pending") || "").toLowerCase();
    const isDirectPaymobSuccess =
      (successParam === "true" || successParam === "1") &&
      pendingParam !== "true";

    if (isBookingSuccess || isDirectPaymobSuccess) {
      const savedInfo = getTransportBookingInfo();
      const rawBookingId =
        urlParams.get("booking_id") ||
        searchParams.get("booking_id") ||
        urlParams.get("id") ||
        searchParams.get("id") ||
        savedInfo?.id ||
        Math.floor(Math.random() * 90000000 + 10000000);

      const bookingId = String(rawBookingId).replace(/[^a-zA-Z0-9-_]/g, "");

      setConfirmedBooking({
        id: bookingId,
        vehicleName: savedInfo?.vehicleName || `${vehicle.type} - ${vehicle.name}`,
        pickupDate: savedInfo?.pickupDate || formData.pickupDate,
        totalAmount: savedInfo?.totalAmount,
        depositAmount: savedInfo?.depositAmount,
      });
      setShowSuccess(true);

      try {
        window.history.replaceState({}, "", window.location.pathname);
      } catch {}
    }
  }, [searchParams, vehicle.name, vehicle.type]);

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
          onPrimaryClick={() => {
            clearTransportBookingInfo();
            router.push("/profile");
          }}
          onClose={() => {
            clearTransportBookingInfo();
            router.push("/");
          }}
          metadata={[
            { label: t("sidebar.bookingSummary", "Booking Reference"), value: `BK-${String(confirmedBooking?.id || Math.floor(Math.random() * 90000000 + 10000000)).padStart(6, "0")}` },
            { label: t("transportBooking.rideDetails.vehicle", "Vehicle"), value: confirmedBooking?.vehicleName || `${vehicle.type} - ${vehicle.name}` },
            { label: t("transportBooking.rideDetails.pickupDate", "Pickup Date"), value: confirmedBooking?.pickupDate || formData.pickupDate || "—" },
            { label: t("sidebar.totalPrice", "Total Paid"), value: confirmedBooking?.depositAmount ? formatCurrency(Number(confirmedBooking.depositAmount)) : formatCurrency(vehicle.prices || Number(vehicle.price.replace(/[^0-9.]/g, "")) || 0), valueColor: "#FF6600" },
          ]}
        />
      )}
    </div>
  );
}
