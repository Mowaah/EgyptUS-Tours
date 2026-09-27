"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import { Vehicle, TransportationBookingData, INITIAL_TRANSPORT_BOOKING } from "@/types";
import { PageHeader, SuccessModal, StepIndicator } from "@/components/shared";

import planPageStyles from "../PlanYourTripPage/PlanYourTripPage.module.scss";
import styles from "./BookTransportationPage.module.scss";

import StepTripDetails from "./steps/TripDetails/StepTripDetails";
import StepPersonalInfo from "./steps/PersonalInfo/StepPersonalInfo";
import StepBookingSummary from "./steps/BookingSummary/StepBookingSummary";
import BookingSummary from "./BookingSummary/BookingSummary";
import { submitTransportationBooking, getProfileBookingDetail } from "@/lib/api";
import { formatPhoneE164 } from "@/utils/validators";
import { formatDateToYMD, formatDateDDMMYYYY, formatDisplayTime } from "@/utils/dateFormat";
import { savePendingGuestRecord } from "@/utils/guestBookingAuth";

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
  pickupTime?: string;
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
  const { isAuthenticated } = useAuth();
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
        pickupTime: savedInfo?.pickupTime || formData.pickupTime,
        totalAmount: savedInfo?.totalAmount,
        depositAmount: savedInfo?.depositAmount,
      });
      setShowSuccess(true);

      if (bookingId) {
        getProfileBookingDetail("transport", bookingId)
          .then((res) => {
            if (res) {
              setConfirmedBooking((prev) => ({
                id: bookingId,
                vehicleName:
                  res.vehicle_name ||
                  (res.vehicle?.name ? `${res.vehicle?.type || ""} - ${res.vehicle?.name || ""}`.trim().replace(/^-\s*/, "") : null) ||
                  prev?.vehicleName ||
                  `${vehicle.type} - ${vehicle.name}`,
                pickupDate: res.pickup_date || prev?.pickupDate || formData.pickupDate,
                pickupTime: res.pickup_time || prev?.pickupTime || formData.pickupTime,
                totalAmount: parseFloat(res.total_price) || prev?.totalAmount,
                depositAmount: parseFloat(res.deposit_amount) || prev?.depositAmount,
              }));
            }
          })
          .catch(() => {});
      }

      try {
        window.history.replaceState({}, "", window.location.pathname);
      } catch {}
    }
  }, [searchParams, vehicle.name, vehicle.type]);

  const steps = [
    { number: 1, label: t("transportBooking.steps.rideDetails", "Trip Details") },
    { number: 2, label: t("transportBooking.steps.contactDetails", "Personal Info") },
    { number: 3, label: t("transportBooking.steps.summary", "Booking Summary") },
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);

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
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleSubmitBooking = async () => {
    setIsSubmitting(true);
    try {
      const formatTime = (timeStr: string) => {
        if (!timeStr) return "12:00:00";
        if (!timeStr.toLowerCase().includes("m")) {
          return timeStr.includes(":") ? timeStr : "12:00:00";
        }
        const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);
        if (!match) return "12:00:00";
        let hours = parseInt(match[1], 10);
        const minutes = match[2];
        const period = match[3].toUpperCase();
        if (period === "AM" && hours === 12) hours = 0;
        if (period === "PM" && hours < 12) hours += 12;
        return `${String(hours).padStart(2, "0")}:${minutes}:00`;
      };

      const payload: Record<string, any> = {
        name: formData.name,
        vehicle_slug: vehicle.id,
        route_id: formData.routeId,
        pickup_date: formatDateToYMD(formData.pickupDate),
        pickup_time: formatTime(formData.pickupTime),
        passengers: formData.passengers,
        luggage: String(formData.luggage),
        additional_service_ids: formData.additionalServiceIds,
        email: formData.email,
        phone: formatPhoneE164(formData.phone),
        nationality: formData.nationality,
        special_requests: formData.specialRequests,
        terms_accepted: formData.termsAccepted,
        currency: "usd",
      };

      const booking = await submitTransportationBooking(payload);
      savePendingGuestRecord({
        email: formData.email,
        name: formData.name,
        type: "transport",
        id: booking?.id,
        title: `${vehicle.type} - ${vehicle.name}`,
      });

      const totalNum = parseFloat(booking?.total_price) || formData.routePrice || parseFloat(vehicle.price.replace(/[^0-9.]/g, "")) || 0;
      const depositNum = parseFloat(booking?.deposit_amount) || totalNum * 0.3;

      if (booking?.payment_url) {
        saveTransportBookingInfo({
          id: booking.id,
          vehicleSlug: vehicle.id,
          vehicleName: `${vehicle.type} - ${vehicle.name}`,
          pickupDate: formData.pickupDate,
          pickupTime: formData.pickupTime || booking.pickup_time,
          totalAmount: totalNum,
          depositAmount: depositNum,
        });
        window.location.assign(resolvePaymentUrl(booking.payment_url));
      } else {
        setConfirmedBooking({
          id: booking?.id || Math.floor(Math.random() * 90000000 + 10000000),
          vehicleName: `${vehicle.type} - ${vehicle.name}`,
          pickupDate: formData.pickupDate,
          pickupTime: formData.pickupTime || booking?.pickup_time,
          totalAmount: totalNum,
          depositAmount: depositNum,
        });
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Failed to submit transportation booking:", error);
      alert(t("errors.bookingSubmitFailed", "Something went wrong while confirming your booking. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
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
          <div className={currentStep === 3 ? styles.fullLayout : styles.layout}>
            <div className={currentStep === 3 ? styles.fullFormArea : styles.formArea}>
              {currentStep === 1 && <StepTripDetails {...sharedProps} />}
              {currentStep === 2 && <StepPersonalInfo {...sharedProps} />}
              {currentStep === 3 && (
                <StepBookingSummary
                  vehicle={vehicle}
                  formData={formData}
                  onChange={handleChange}
                  onPrevious={handlePrevious}
                  onSubmit={handleSubmitBooking}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>

            {currentStep !== 3 && <BookingSummary vehicle={vehicle} formData={formData} />}
          </div>
        </div>
      </main>

      {showSuccess && (
        <SuccessModal
          title={t("transportBooking.success.title", "Booking Confirmed!")}
          message={t("transportBooking.success.message", "Your vehicle has been successfully booked. Confirmation details have been sent to your email.")}
          buttonText={t("transportBooking.success.backToHome", "Back to Home")}
          primaryButtonText={t("transportBooking.success.viewBooking", "View Booking")}
          onPrimaryClick={() => {
            const targetId = confirmedBooking?.id;
            clearTransportBookingInfo();
            if (!isAuthenticated) {
              router.push(`/profile?tab=bookings&type=transport&auth_prompt=true${targetId ? `&id=${targetId}` : ""}`);
            } else if (targetId) {
              router.push(`/profile/bookings-details?id=${targetId}&type=transport`);
            } else {
              router.push("/profile?tab=bookings&type=transport");
            }
          }}
          onClose={() => {
            clearTransportBookingInfo();
            router.push("/");
          }}
          metadata={[
            { label: t("transportBooking.summary.bookingReference", "Booking Reference"), value: `#BK${confirmedBooking?.id || "53602205"}` },
            { label: t("transportBooking.summary.vehicle", "Vehicle"), value: confirmedBooking?.vehicleName || `${vehicle.type} - ${vehicle.name}` },
            { label: t("transportBooking.rideDetails.pickupDate", "Pickup Date"), value: formatDateDDMMYYYY(confirmedBooking?.pickupDate || formData.pickupDate) },
            { label: t("transportBooking.rideDetails.pickupTime", "Pickup Time"), value: formatDisplayTime(confirmedBooking?.pickupTime || formData.pickupTime) },
            { label: t("sidebar.totalPrice", "Total Price"), value: formatCurrency({ usd: Number(confirmedBooking?.totalAmount || formData.routePrice || Number(vehicle.price.replace(/[^0-9.]/g, "")) || 0) }), valueColor: "#FF6600" },
            { label: t("sidebar.paidNow", "Paid Now"), value: formatCurrency({ usd: Number(confirmedBooking?.depositAmount || (Number(confirmedBooking?.totalAmount || formData.routePrice || Number(vehicle.price.replace(/[^0-9.]/g, "")) || 0) * 0.3)) }), valueColor: "#FF6600" },
          ]}
        />
      )}
    </div>
  );
}
