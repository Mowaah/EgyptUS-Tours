"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Trip } from "@/types";
import { BookingData, INITIAL_BOOKING_DATA } from "@/types";
import { PageHeader, SuccessModal, StepIndicator } from "@/components/shared";
import { BASE_URL, extractApiError, submitTripBooking } from "@/lib/api";
import { formatPhoneE164 } from "@/utils/validators";
import { useCurrency } from "@/contexts/CurrencyContext";

import planPageStyles from "../PlanYourTripPage/PlanYourTripPage.module.scss";

import StepYourDetails from "./steps/YourDetails/StepYourDetails";
import StepBookingSummary from "./steps/BookingSummary/StepBookingSummary";

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

interface SavedTripBookingInfo {
  id?: number | string;
  tripSlug?: string;
  tripTitle?: string;
  startDate?: string;
  endDate?: string;
  isGroupTrip?: boolean;
  totalAmount?: number;
  depositAmount?: number;
  timestamp?: number;
}

function formatDateForBooking(dateStr?: string) {
  if (!dateStr) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const [month, day, year] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  return dateStr;
}

function resolvePaymentUrl(paymentUrl: string) {
  const trimmed = paymentUrl.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return new URL(trimmed, BASE_URL).toString();
}

function saveBookingInfo(info: SavedTripBookingInfo) {
  try {
    const data = JSON.stringify({ ...info, timestamp: Date.now() });
    localStorage.setItem("last_trip_booking", data);
    sessionStorage.setItem("last_trip_booking", data);
  } catch (e) {
    console.error("Failed to save trip booking info", e);
  }
}

function getBookingInfo(): SavedTripBookingInfo | null {
  try {
    const raw = localStorage.getItem("last_trip_booking") || sessionStorage.getItem("last_trip_booking");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const savedAt = Number(parsed.timestamp || 0);
    // Allow up to 2 hours expiration
    if (savedAt && Date.now() - savedAt > 2 * 60 * 60 * 1000) {
      clearBookingInfo();
      return null;
    }
    return parsed;
  } catch (e) {
    console.error("Failed to read trip booking info", e);
  }
  return null;
}

function clearBookingInfo() {
  try {
    localStorage.removeItem("last_trip_booking");
    sessionStorage.removeItem("last_trip_booking");
  } catch {}
}

export default function BookPrivateTripPage({ trip, isGroupTrip }: BookPrivateTripPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<SavedTripBookingInfo | null>(null);
  const stepIndicatorRef = useRef<HTMLDivElement | null>(null);
  const { formatCurrency } = useCurrency();

  const [formData, setFormData] = useState<BookingData>(INITIAL_BOOKING_DATA);

  // Calculate pricing based on trip rates
  const baseRate = isGroupTrip
    ? trip.groupPrice || trip.price || 0
    : trip.privatePrice || trip.price || 0;
  const roomPrices = { single: 5500, double: 4100, triple: 3500 };
  const roomsTotal = Object.entries(formData.rooms || {}).reduce((acc, [key, count]) => {
    const k = key.toLowerCase();
    const c = count as number || 0;
    if (k.includes("single")) return acc + c * roomPrices.single;
    if (k.includes("double")) return acc + c * roomPrices.double;
    if (k.includes("triple")) return acc + c * roomPrices.triple;
    return acc + c * roomPrices.double; // fallback to double
  }, 0);
  const totalAmount = baseRate + roomsTotal;
  
  let depositAmount = totalAmount * 0.3;
  if (formData.startDate) {
    const startDate = new Date(formData.startDate);
    const today = new Date();
    const daysUntil = (startDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
    if (daysUntil <= 30) {
      depositAmount = totalAmount;
    }
  }

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
      const savedInfo = getBookingInfo();
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
        tripTitle: savedInfo?.tripTitle || trip.title,
        startDate: savedInfo?.startDate || formData.startDate,
        endDate: savedInfo?.endDate || formData.endDate,
        isGroupTrip: savedInfo?.isGroupTrip ?? isGroupTrip,
        totalAmount: savedInfo?.totalAmount || totalAmount,
        depositAmount: savedInfo?.depositAmount || depositAmount,
      });
      setShowSuccessModal(true);

      // Clean query parameters from URL without page reload
      try {
        window.history.replaceState({}, "", window.location.pathname);
      } catch {}
    }
  }, [searchParams, trip.title, isGroupTrip, totalAmount, depositAmount, formData.startDate, formData.endDate]);

  const handleChange = (patch: Partial<BookingData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleStartCheckout = async () => {
    setIsStartingCheckout(true);
    try {
      const hasFixedAvailability = Boolean(trip.availability && trip.availability.length > 0);
      const isFixedDates = Boolean(isGroupTrip || hasFixedAvailability);

      let singleCount = 0;
      let doubleCount = 0;
      let tripleCount = 0;
      Object.entries(formData.rooms || {}).forEach(([key, count]) => {
        const k = key.toLowerCase();
        const c = count as number || 0;
        if (k.includes("single")) singleCount += c;
        else if (k.includes("double") || k.includes("twin")) doubleCount += c;
        else if (k.includes("triple")) tripleCount += c;
        else doubleCount += c; // fallback
      });

      const payload = {
        name: formData.name.trim(),
        trip_slug: trip.id,
        email: formData.email.trim(),
        phone: formatPhoneE164(formData.phone),
        nationality: formData.nationality,
        start_date: formatDateForBooking(formData.startDate),
        end_date: formatDateForBooking(formData.endDate),
        adults: formData.adults,
        children: formData.children,
        infants: formData.infants,
        rooms: {
          single: singleCount,
          double: doubleCount,
          triple: tripleCount,
        },
        departure_month: isFixedDates ? formData.departureMonth : undefined,
        departure_date_id: isFixedDates && formData.departureDateId ? Number(formData.departureDateId) || undefined : undefined,
        special_requests: formData.specialRequests,
        terms_accepted: formData.termsAccepted,
        tour_type: isGroupTrip ? "group" : "private",
      };

      const booking = await submitTripBooking(payload);

      if (!booking.payment_url) {
        throw new Error("The booking was created, but no Paymob checkout URL was returned.");
      }

      // Save context to storage so we can display details upon returning
      saveBookingInfo({
        id: booking.id,
        tripSlug: trip.id,
        tripTitle: trip.title,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isGroupTrip: isGroupTrip,
        totalAmount: parseFloat(booking.total_amount || booking.total_price || booking.price_breakdown?.total) || totalAmount,
        depositAmount: parseFloat(booking.deposit_amount || booking.payment?.amount_due) || depositAmount,
      });

      window.location.assign(resolvePaymentUrl(booking.payment_url));
    } catch (error) {
      console.error("Failed to start trip checkout", error);
      alert(extractApiError(error, "Something went wrong while starting Paymob checkout. Please try again."));
      setIsStartingCheckout(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    clearBookingInfo();
    router.push("/trips");
  };

  const handlePrimaryModal = () => {
    setShowSuccessModal(false);
    clearBookingInfo();
    router.push("/profile");
  };

  return (
    <div className={planPageStyles.page}>
      <PageHeader
        breadcrumbs={[
          { label: "Trips", href: "/trips" },
          { label: "Trip Details", href: `/trips/${trip.id}` },
          { label: "Booking", isCurrent: true },
        ]}
        title={trip.title}
        subtitle="Provide your details to customize and secure your reservation."
        backButton={{ text: "Back To Trip Details", href: `/trips/${trip.id}` }}
        decorationSrc="/images/dotted-line3.svg"
      />

      <div ref={stepIndicatorRef}>
        <StepIndicator steps={STEPS} currentStep={currentStep} />
      </div>

      <main className={planPageStyles.mainContent}>
        <div className={planPageStyles.content}>
          {currentStep === 1 && (
            <StepYourDetails
              trip={trip}
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
              onContinue={handleStartCheckout}
              totalAmount={totalAmount}
              depositAmount={depositAmount}
              isGroupTrip={isGroupTrip}
              isSubmitting={isStartingCheckout}
            />
          )}
        </div>
      </main>

      {showSuccessModal && (
        <SuccessModal
          title="Booking Confirmed!"
          message="Your trip reservation has been successfully booked. Confirmation details have been sent to your email."
          primaryButtonText="View My Bookings"
          buttonText="Back to Trips"
          onPrimaryClick={handlePrimaryModal}
          onClose={handleCloseModal}
          metadata={[
            { label: "Booking Reference", value: `BK-${String(confirmedBooking?.id || "1024").padStart(6, "0")}` },
            { label: "Trip Name", value: confirmedBooking?.tripTitle || trip.title },
            { label: "Travel Type", value: isGroupTrip ? "Group Tour" : "Private Tour" },
            { label: "Date", value: confirmedBooking?.startDate || formData.startDate || "—" },
            { label: "Total Price", value: confirmedBooking?.totalAmount ? formatCurrency(Number(confirmedBooking.totalAmount)) : formatCurrency(totalAmount), valueColor: "#FF6600" },
            { label: "Paid Now", value: confirmedBooking?.depositAmount ? formatCurrency(Number(confirmedBooking.depositAmount)) : formatCurrency(depositAmount), valueColor: "#FF6600" },
          ]}
        />
      )}
    </div>
  );
}
