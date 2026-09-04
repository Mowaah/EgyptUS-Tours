"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Hotel, HotelRoom } from "@/types";
import { BookingData, INITIAL_BOOKING_DATA } from "@/types";
import { PageHeader, StepIndicator, SuccessModal } from "@/components/shared";
import { BASE_URL, extractApiError, submitHotelBooking } from "@/lib/api";
import { formatPhoneE164 } from "@/utils/validators";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "@/hooks/useTranslation";
import { MultiCurrencyPrice } from "@/constants/currency";

import planPageStyles from "../PlanYourTripPage/PlanYourTripPage.module.scss";

import StepRoomDates from "./steps/RoomDates/StepRoomDates";
import StepPersonalInfo from "./steps/PersonalInfo/StepPersonalInfo";

export type { BookingData };

const STEPS = [
  { number: 1, label: "Room & Dates" },
  { number: 2, label: "Personal Info" },
  { number: 3, label: "Payment" },
];

interface BookHotelPageProps {
  hotel: Hotel;
}

interface SavedBookingInfo {
  id?: number | string;
  hotelSlug?: string;
  hotelName?: string;
  startDate?: string;
  endDate?: string;
  totalAmount?: number;
  depositAmount?: number;
  timestamp?: number;
}

function formatDateForBooking(dateStr: string) {
  if (!dateStr) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const [month, day, year] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  return dateStr;
}

function buildRoomSelections(formData: BookingData, hotel: Hotel) {
  const selectedRoomIds = Object.values(formData.roomCustomizations || {}).flat();
  if (selectedRoomIds.length === 0) return undefined;

  const roomsById = new Map((hotel.hotelRooms || []).map((room) => [room.id, room]));
  const groupedSelections = new Map<string, { quantity: number; view_label?: string }>();

  for (const roomId of selectedRoomIds) {
    if (!roomId) continue;
    const existing = groupedSelections.get(roomId);
    const room = roomsById.get(roomId);
    groupedSelections.set(roomId, {
      quantity: (existing?.quantity || 0) + 1,
      view_label: existing?.view_label || room?.view,
    });
  }

  return Array.from(groupedSelections.entries())
    .map(([roomId, selection]) => ({
      hotel_room_id: Number(roomId),
      quantity: selection.quantity,
      view_label: selection.view_label || "Standard",
    }))
    .filter((selection) => Number.isFinite(selection.hotel_room_id) && selection.quantity > 0);
}

function resolvePaymentUrl(paymentUrl: string) {
  const trimmed = paymentUrl.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return new URL(trimmed, BASE_URL).toString();
}

function saveBookingInfo(info: SavedBookingInfo) {
  try {
    const data = JSON.stringify({ ...info, timestamp: Date.now() });
    localStorage.setItem("last_hotel_booking", data);
    sessionStorage.setItem("last_hotel_booking", data);
  } catch (e) {
    console.error("Failed to save booking info", e);
  }
}

function getBookingInfo(): SavedBookingInfo | null {
  try {
    const raw = localStorage.getItem("last_hotel_booking") || sessionStorage.getItem("last_hotel_booking");
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
    console.error("Failed to read booking info", e);
  }
  return null;
}

function clearBookingInfo() {
  try {
    localStorage.removeItem("last_hotel_booking");
    sessionStorage.removeItem("last_hotel_booking");
  } catch {}
}

export default function BookHotelPage({ hotel }: BookHotelPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formatCurrency } = useCurrency();
  const [currentStep, setCurrentStep] = useState(1);
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<SavedBookingInfo | null>(null);
  const stepIndicatorRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState<BookingData>(INITIAL_BOOKING_DATA);

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
        hotelName: savedInfo?.hotelName || hotel.name,
        startDate: savedInfo?.startDate,
        endDate: savedInfo?.endDate,
        totalAmount: savedInfo?.totalAmount,
        depositAmount: savedInfo?.depositAmount,
      });
      setShowSuccessModal(true);

      // Clean query parameters from URL without page reload
      try {
        window.history.replaceState({}, "", window.location.pathname);
      } catch {}
    }
  }, [searchParams, hotel.name]);

  const handleChange = (patch: Partial<BookingData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const nights = (() => {
    if (!formData.startDate || !formData.endDate) return 1;
    const diff = Math.round(
      (new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / 86400000
    );
    return diff > 0 ? diff : 1;
  })();

  const totalRooms = Object.values(formData.rooms || {}).reduce((acc, count) => acc + (count || 0), 0);
  const totalGuests = formData.adults + formData.children + formData.infants;
  
  const calculateHotelTotalForCurrency = (curr: "usd" | "egp" | "eur") => {
    return Object.entries(formData.rooms || {}).reduce((total, [type, count]) => {
      if (!count) return total;
      const roomIds = formData.roomCustomizations?.[type] || [];
      let typeTotal = 0;
      
      const hotelRoomsOfType = (hotel.hotelRooms || []).filter(r => r.type.toLowerCase() === type);
      const baseRoom = hotelRoomsOfType.sort((a, b) => a.pricePerNight - b.pricePerNight)[0];
      
      const getRoomPrice = (r?: HotelRoom) => {
        if (!r) return 0;
        if (curr === "egp") return r.pricePerNightEgp || (r.prices?.egp ? Number(r.prices.egp) : r.pricePerNight);
        if (curr === "eur") return r.pricePerNightEur || (r.prices?.eur ? Number(r.prices.eur) : r.pricePerNight);
        return r.prices?.usd ? Number(r.prices.usd) : r.pricePerNight;
      };

      const getHotelDefaultPrice = () => {
        if (curr === "egp") return hotel.pricePerNightEgp || (hotel.prices?.egp ? Number(hotel.prices.egp) : hotel.pricePerNight);
        if (curr === "eur") return hotel.pricePerNightEur || (hotel.prices?.eur ? Number(hotel.prices.eur) : hotel.pricePerNight);
        return hotel.prices?.usd ? Number(hotel.prices.usd) : hotel.pricePerNight;
      };

      for (let i = 0; i < count; i++) {
         const roomId = roomIds[i];
         const room = (hotel.hotelRooms || []).find(r => r.id === roomId);
         if (room) {
           typeTotal += getRoomPrice(room);
         } else if (baseRoom) {
           typeTotal += getRoomPrice(baseRoom);
         } else {
           typeTotal += getHotelDefaultPrice();
         }
      }
      return total + typeTotal;
    }, 0) * nights;
  };

  const totalPrices: MultiCurrencyPrice = useMemo(() => ({
    usd: calculateHotelTotalForCurrency("usd"),
    egp: calculateHotelTotalForCurrency("egp"),
    eur: calculateHotelTotalForCurrency("eur"),
  }), [formData.rooms, formData.roomCustomizations, hotel, nights]);

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
  const vatAmount = 0;

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleStartCheckout = async () => {
    setIsStartingCheckout(true);
    try {
      const roomSelections = buildRoomSelections(formData, hotel);
      const booking = await submitHotelBooking({
        name: formData.name.trim(),
        hotel_slug: hotel.id,
        email: formData.email.trim(),
        phone: formatPhoneE164(formData.phone),
        nationality: formData.nationality,
        start_date: formatDateForBooking(formData.startDate),
        end_date: formatDateForBooking(formData.endDate),
        adults: formData.adults,
        children: formData.children,
        infants: formData.infants,
        rooms: {
          single: formData.rooms?.single || 0,
          double: formData.rooms?.double || 0,
          triple: formData.rooms?.triple || 0,
        },
        ...(roomSelections?.length ? { room_selections: roomSelections } : {}),
        requested_room_type: "Any",
        special_requests: formData.specialRequests,
        terms_accepted: formData.termsAccepted,
      });

      if (!booking.payment_url) {
        throw new Error("The booking was created, but no Paymob checkout URL was returned.");
      }

      // Save context to storage so we can display details upon returning
      saveBookingInfo({
        id: booking.id,
        hotelSlug: hotel.id,
        hotelName: hotel.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalAmount: parseFloat((booking as any).total_amount || (booking as any).total_price || (booking as any).price_breakdown?.total) || totalAmount,
        depositAmount: parseFloat((booking as any).deposit_amount || (booking as any).payment?.amount_due) || depositAmount,
      });

      window.location.assign(resolvePaymentUrl(booking.payment_url));
    } catch (error) {
      console.error("Failed to start hotel checkout", error);
      alert(extractApiError(error, "Something went wrong while starting Paymob checkout. Please try again."));
      setIsStartingCheckout(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const sharedProps = {
    hotel,
    formData,
    onChange: handleChange,
    onPrevious: handlePrevious,
    onContinue: handleStartCheckout,
    isSubmitting: isStartingCheckout,
    totalAmount,
    vatAmount,
    depositAmount,
    totalRooms,
    totalGuests,
    totalPrices,
    depositPrices,
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    clearBookingInfo();
    router.push("/hotels");
  };

  const handlePrimaryModal = () => {
    setShowSuccessModal(false);
    clearBookingInfo();
    router.push("/profile");
  };

  const { t } = useTranslation("booking");

  const steps = [
    { number: 1, label: t("hotelBooking.steps.roomDates", "Room & Dates") },
    { number: 2, label: t("hotelBooking.steps.personalInfo", "Personal Info") },
    { number: 3, label: t("hotelBooking.steps.payment", "Payment") },
  ];

  return (
    <div className={planPageStyles.page}>
      <PageHeader
        breadcrumbs={[
          { label: t("hotelBooking.breadcrumbHotels", "Hotels"), href: "/hotels" },
          { label: t("hotelBooking.breadcrumbDetails", "Hotel Details"), href: `/hotels/${hotel.id}` },
          { label: t("hotelBooking.breadcrumb", "Booking"), isCurrent: true },
        ]}
        title={`${t("hotelBooking.pageTitle", "Book")} ${hotel.name}`}
        subtitle={t("hotelBooking.pageSubtitle", "Enter your details to complete your hotel booking easily and securely")}
        backButton={{ text: t("hotelBooking.backToHotelDetails", "Back To Hotel Details"), href: `/hotels/${hotel.id}` }}
        decorationSrc="/images/dotted-line3.svg"
      />

      <div ref={stepIndicatorRef}>
        <StepIndicator steps={steps} currentStep={currentStep} />
      </div>

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
        </div>
      </main>

      {showSuccessModal && (
        <SuccessModal
          title={t("hotelBooking.success.title", "Booking Confirmed!")}
          message={t("hotelBooking.success.message", "Your hotel reservation has been successfully booked. Confirmation details have been sent to your email.")}
          primaryButtonText={t("hotelBooking.success.viewBookings", "View My Bookings")}
          buttonText={t("hotelBooking.success.backToHotels", "Back to Hotels")}
          onPrimaryClick={handlePrimaryModal}
          onClose={handleCloseModal}
          metadata={[
            { label: t("hotelBooking.success.reference", "Booking Reference"), value: `BK-${String(confirmedBooking?.id || "1024").padStart(6, "0")}` },
            { label: t("hotelBooking.success.hotel", "Hotel"), value: confirmedBooking?.hotelName || hotel.name },
            { label: t("sidebar.checkIn", "Check-in"), value: confirmedBooking?.startDate || formData.startDate || "—" },
            { label: t("sidebar.checkOut", "Check-out"), value: confirmedBooking?.endDate || formData.endDate || "—" },
            { label: t("sidebar.totalPrice", "Total Price"), value: confirmedBooking?.totalAmount ? formatCurrency(Number(confirmedBooking.totalAmount)) : formatCurrency(totalPrices), valueColor: "#FF6600" },
            { label: t("sidebar.payNow", "Paid Now"), value: confirmedBooking?.depositAmount ? formatCurrency(Number(confirmedBooking.depositAmount)) : formatCurrency(depositPrices), valueColor: "#FF6600" },
          ]}
        />
      )}
    </div>
  );
}

