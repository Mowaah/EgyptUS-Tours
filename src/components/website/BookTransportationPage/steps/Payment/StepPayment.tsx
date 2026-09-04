"use client";

import { PaymentForm } from "@/components/shared";
import { TransportationBookingData, Vehicle } from "@/types";
import { submitTransportationBooking } from "@/lib/api";
import { useCurrency } from "@/contexts/CurrencyContext";
import { MultiCurrencyPrice } from "@/constants/currency";
import { useTranslation } from "@/hooks/useTranslation";
import { formatPhoneE164 } from "@/utils/validators";
import { useState, useMemo } from "react";
import { saveTransportBookingInfo, resolvePaymentUrl } from "../../BookTransportationPage";

interface StepPaymentProps {
  formData: TransportationBookingData;
  onChange: (patch: Partial<TransportationBookingData>) => void;
  onPrevious: () => void;
  onContinue: () => void;
  vehicle: Vehicle;
}

export default function StepPayment({
  formData, onChange, onPrevious, onContinue, vehicle,
}: StepPaymentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { formatCurrency } = useCurrency();
  const { t } = useTranslation("booking");

  const basePrice = parseFloat((vehicle.price ?? "0").replace(/[^0-9.]/g, "")) || 0;

  const isDepositFull = useMemo(() => {
    if (!formData.pickupDate) return false;
    const start = new Date(formData.pickupDate);
    const today = new Date();
    const daysUntil = (start.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return daysUntil <= 30;
  }, [formData.pickupDate]);

  const depositFactor = isDepositFull ? 1 : 0.3;

  const depositPrices: MultiCurrencyPrice = useMemo(() => {
    const usdBase = vehicle.prices?.usd ? Number(vehicle.prices.usd) : basePrice;
    const egpBase = vehicle.prices?.egp ? Number(vehicle.prices.egp) : basePrice;
    const eurBase = vehicle.prices?.eur ? Number(vehicle.prices.eur) : basePrice;
    return {
      usd: usdBase * depositFactor,
      egp: egpBase * depositFactor,
      eur: eurBase * depositFactor,
    };
  }, [vehicle.prices, basePrice, depositFactor]);

  const handleSubmit = async () => {
    if (!formData.cardNumber || !formData.cardName || !formData.expiry || !formData.cvv) {
      alert("Please fill in all payment details.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Helper to convert MM/DD/YYYY to YYYY-MM-DD
      const formatDate = (dateStr: string) => {
        if (!dateStr) return null;
        const parts = dateStr.split("/");
        if (parts.length === 3) {
          return `${parts[2]}-${parts[0]}-${parts[1]}`;
        }
        return dateStr;
      };

      // Helper to convert 12-hour time (e.g. "12:42 AM") to 24-hour time for DRF (e.g. "00:42:00")
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

      const payload = {
        name: formData.name,
        vehicle_slug: vehicle.id,
        pickup_location: formData.pickupLocation,
        dropoff_location: formData.dropoffLocation,
        trip_type: formData.tripType,
        distance_km: "25.00",
        pickup_date: formatDate(formData.pickupDate),
        pickup_time: formatTime(formData.pickupTime),
        passengers: formData.passengers,
        luggage: String(formData.luggage),
        additional_service_ids: formData.additionalServiceIds,
        email: formData.email,
        phone: formatPhoneE164(formData.phone),
        nationality: formData.nationality,
        special_requests: formData.specialRequests,
        terms_accepted: formData.termsAccepted,
      };

      const booking = await submitTransportationBooking(payload);
      if (booking?.payment_url) {
        saveTransportBookingInfo({
          id: booking.id,
          vehicleSlug: vehicle.id,
          vehicleName: `${vehicle.type} - ${vehicle.name}`,
          pickupDate: formData.pickupDate,
          totalAmount: parseFloat(booking.total_price) || Number(depositPrices.egp) || Number(depositPrices.usd) || 0,
          depositAmount: parseFloat(booking.deposit_amount) || Number(depositPrices.egp) || Number(depositPrices.usd) || 0,
        });
        window.location.assign(resolvePaymentUrl(booking.payment_url));
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        onContinue();
      }
    } catch (error) {
      console.error("Failed to submit booking", error);
      alert("Something went wrong while confirming your booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PaymentForm
      formData={formData}
      onChange={onChange}
      confirmLabel={`${t("payment.confirmAndPay", "Confirm & Pay")} ${formatCurrency(depositPrices)} ${depositFactor === 1 ? t("sidebar.fullAmount", "(Full amount)") : t("sidebar.deposit30", "(30% deposit)")}`}
      onPrevious={onPrevious}
      onConfirm={handleSubmit}
      isLoading={isSubmitting}
    />
  );
}
