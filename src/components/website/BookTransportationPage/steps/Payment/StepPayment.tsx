"use client";

import { PaymentForm } from "@/components/shared";
import { TransportationBookingData, Vehicle } from "@/types";
import { submitTransportationBooking } from "@/lib/api";
import { useState } from "react";

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
  const numericPrice = parseFloat((vehicle.price ?? "0").replace(/[^0-9.]/g, ""));
  const deposit = (numericPrice * 0.3).toFixed(2);

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
        additional_service_ids: [],
        services: {
          child_seat: formData.services.childSeat,
          extra_luggage: formData.services.extraLuggage,
          meet_and_greet: formData.services.meetAndGreet,
        },
        email: formData.email,
        phone: formData.phone,
        nationality: formData.nationality,
        special_requests: formData.specialRequests,
        terms_accepted: formData.termsAccepted,
      };

      await submitTransportationBooking(payload);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onContinue();
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
      confirmLabel={`Confirm & Pay $${deposit} Deposit`}
      onPrevious={onPrevious}
      onConfirm={handleSubmit}
      isLoading={isSubmitting}
    />
  );
}
