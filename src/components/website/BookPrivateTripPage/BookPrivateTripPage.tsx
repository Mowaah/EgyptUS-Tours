"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Trip } from "@/types";
import { BookingData, INITIAL_BOOKING_DATA } from "@/types";
import { PageHeader, SuccessModal, StepIndicator } from "@/components/shared";
import { BASE_URL, extractApiError, submitTripBooking } from "@/lib/api";
import { formatPhoneE164 } from "@/utils/validators";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "@/hooks/useTranslation";
import { MultiCurrencyPrice } from "@/constants/currency";

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

  // Calculate total across all currencies based on room prices (price is already for the full trip duration)
  const nights = trip.duration?.nights || 1;
  const baseSeason = trip.seasonPricing?.[0];
  const addOns = trip.additionalRooms;

  const calculateTotalForCurrency = (curr: "usd" | "egp" | "eur") => {
    let singlePrice = curr === "egp" ? (baseSeason?.singleEgp || (baseSeason?.singlePrices?.egp ? Number(baseSeason.singlePrices.egp) : 0))
                    : curr === "eur" ? (baseSeason?.singleEur || (baseSeason?.singlePrices?.eur ? Number(baseSeason.singlePrices.eur) : 0))
                    : (baseSeason?.single || (baseSeason?.singlePrices?.usd ? Number(baseSeason.singlePrices.usd) : 0));
    let doublePrice = curr === "egp" ? (baseSeason?.doubleEgp || (baseSeason?.doublePrices?.egp ? Number(baseSeason.doublePrices.egp) : 0))
                    : curr === "eur" ? (baseSeason?.doubleEur || (baseSeason?.doublePrices?.eur ? Number(baseSeason.doublePrices.eur) : 0))
                    : (baseSeason?.double || (baseSeason?.doublePrices?.usd ? Number(baseSeason.doublePrices.usd) : 0));
    let triplePrice = curr === "egp" ? (baseSeason?.tripleEgp || (baseSeason?.triplePrices?.egp ? Number(baseSeason.triplePrices.egp) : 0))
                    : curr === "eur" ? (baseSeason?.tripleEur || (baseSeason?.triplePrices?.eur ? Number(baseSeason.triplePrices.eur) : 0))
                    : (baseSeason?.triple || (baseSeason?.triplePrices?.usd ? Number(baseSeason.triplePrices.usd) : 0));

    let poolAddon = curr === "egp" ? (addOns?.poolViewEgp || (addOns?.poolViewPrices?.egp ? Number(addOns.poolViewPrices.egp) : 0))
                  : curr === "eur" ? (addOns?.poolViewEur || (addOns?.poolViewPrices?.eur ? Number(addOns.poolViewPrices.eur) : 0))
                  : (addOns?.poolView || (addOns?.poolViewPrices?.usd ? Number(addOns.poolViewPrices.usd) : 0));

    let seaAddon = curr === "egp" ? (addOns?.seaViewEgp || (addOns?.seaViewPrices?.egp ? Number(addOns.seaViewPrices.egp) : 0))
                 : curr === "eur" ? (addOns?.seaViewEur || (addOns?.seaViewPrices?.eur ? Number(addOns.seaViewPrices.eur) : 0))
                 : (addOns?.seaView || (addOns?.seaViewPrices?.usd ? Number(addOns.seaViewPrices.usd) : 0));

    return Object.entries(formData.roomCustomizations || {}).reduce((acc, [type, optionsList]) => {
      const k = type.toLowerCase();
      let basePrice = doublePrice;
      let capacity = 2;
      if (k.includes("single")) {
        basePrice = singlePrice;
        capacity = 1;
      } else if (k.includes("triple")) {
        basePrice = triplePrice;
        capacity = 3;
      }

      const roomSum = (optionsList || []).reduce((rAcc, opt) => {
        let addon = 0;
        if (opt === "pool") addon = poolAddon;
        if (opt === "sea") addon = seaAddon;
        return rAcc + (basePrice * capacity + addon);
      }, 0);

      return acc + roomSum;
    }, 0);
  };

  const totalPrices: MultiCurrencyPrice = useMemo(() => ({
    usd: calculateTotalForCurrency("usd"),
    egp: calculateTotalForCurrency("egp"),
    eur: calculateTotalForCurrency("eur"),
  }), [formData.roomCustomizations, baseSeason, addOns]);

  const isDepositFull = useMemo(() => {
    if (!formData.startDate) return false;
    const startDate = new Date(formData.startDate);
    const today = new Date();
    const daysUntil = (startDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return daysUntil <= 30;
  }, [formData.startDate]);

  const depositPrices: MultiCurrencyPrice = useMemo(() => {
    const factor = isDepositFull ? 1 : 0.3;
    return {
      usd: Number(totalPrices.usd || 0) * factor,
      egp: Number(totalPrices.egp || 0) * factor,
      eur: Number(totalPrices.eur || 0) * factor,
    };
  }, [totalPrices, isDepositFull]);

  const totalAmount = Number(totalPrices.usd || totalPrices.egp || 0);
  const depositAmount = Number(depositPrices.usd || depositPrices.egp || 0);

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
      });
      const roomSelections: Array<{ room_type: "single" | "double" | "triple"; view_label: string; quantity: number }> = [];
      if (formData.roomCustomizations) {
        const roomMap: Record<string, { room_type: "single" | "double" | "triple"; view_label: string; quantity: number }> = {};

        for (const [type, optionsList] of Object.entries(formData.roomCustomizations)) {
          const rawType = type.toLowerCase();
          let mappedType: "single" | "double" | "triple" = "double";
          if (rawType.includes("single")) {
            mappedType = "single";
          } else if (rawType.includes("triple")) {
            mappedType = "triple";
          } else {
            mappedType = "double";
          }

          for (const opt of (optionsList as string[])) {
            let viewLabel = "Garden View";
            if (opt === "pool") {
              viewLabel = "Pool View";
            } else if (opt === "sea") {
              viewLabel = "Sea View";
            }

            const key = `${mappedType}_${viewLabel}`;
            if (!roomMap[key]) {
              roomMap[key] = {
                room_type: mappedType,
                view_label: viewLabel,
                quantity: 0,
              };
            }
            roomMap[key].quantity += 1;
          }
        }
        roomSelections.push(...Object.values(roomMap));
      }

      const calculatedSingle = (formData.roomCustomizations?.single || []).length || singleCount;
      const calculatedDouble = (formData.roomCustomizations?.double || []).length || doubleCount;
      const calculatedTriple = (formData.roomCustomizations?.triple || []).length || tripleCount;

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
          single: calculatedSingle,
          double: calculatedDouble,
          triple: calculatedTriple,
        },
        room_selections: roomSelections.length > 0 ? roomSelections : undefined,
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
    router.push("/egypttours");
  };

  const handlePrimaryModal = () => {
    setShowSuccessModal(false);
    clearBookingInfo();
    router.push("/profile");
  };

  const { t } = useTranslation("booking");

  const steps = [
    { number: 1, label: t("tripBooking.steps.dates", "Your Details") },
    { number: 2, label: t("tripBooking.steps.summary", "Booking Summary") },
    { number: 3, label: t("tripBooking.steps.payment", "Payment") },
  ];

  return (
    <div className={planPageStyles.page}>
      <PageHeader
        breadcrumbs={[
          { label: t("tripBooking.breadcrumbTours", "Egypt Tours"), href: "/egypttours" },
          { label: t("tripBooking.breadcrumbDetails", "Trip Details"), href: `/egypttours/${trip.id}` },
          { label: t("tripBooking.breadcrumb", "Booking"), isCurrent: true },
        ]}
        title={trip.title}
        subtitle={t("tripBooking.pageSubtitle", "Provide your details to customize and secure your reservation.")}
        backButton={{ text: t("tripBooking.backToTripDetails", "Back To Trip Details"), href: `/egypttours/${trip.id}` }}
        decorationSrc="/images/dotted-line3.svg"
      />

      <div ref={stepIndicatorRef}>
        <StepIndicator steps={steps} currentStep={currentStep} />
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
              totalPrices={totalPrices}
              depositPrices={depositPrices}
            />
          )}
        </div>
      </main>

      {showSuccessModal && (
        <SuccessModal
          title={t("tripBooking.success.title", "Booking Confirmed!")}
          message={t("tripBooking.success.message", "Your trip reservation has been successfully booked. Confirmation details have been sent to your email.")}
          primaryButtonText={t("tripBooking.success.viewBookings", "View My Bookings")}
          buttonText={t("tripBooking.success.backToTrips", "Back to Trips")}
          onPrimaryClick={handlePrimaryModal}
          onClose={handleCloseModal}
          metadata={[
            { label: t("tripBooking.success.reference", "Booking Reference"), value: `BK-${String(confirmedBooking?.id || "1024").padStart(6, "0")}` },
            { label: t("tripBooking.success.tripName", "Trip Name"), value: confirmedBooking?.tripTitle || trip.title },
            { label: t("tripBooking.success.travelType", "Travel Type"), value: isGroupTrip ? t("tripBooking.groupTitle", "Group Tour") : t("tripBooking.privateTitle", "Private Tour") },
            { label: t("tripBooking.success.date", "Date"), value: confirmedBooking?.startDate || formData.startDate || "—" },
            { label: t("sidebar.totalPrice", "Total Price"), value: confirmedBooking?.totalAmount ? formatCurrency(Number(confirmedBooking.totalAmount)) : formatCurrency(totalPrices), valueColor: "#FF6600" },
            { label: t("sidebar.payNow", "Paid Now"), value: confirmedBooking?.depositAmount ? formatCurrency(Number(confirmedBooking.depositAmount)) : formatCurrency(depositPrices), valueColor: "#FF6600" },
          ]}
        />
      )}
    </div>
  );
}
