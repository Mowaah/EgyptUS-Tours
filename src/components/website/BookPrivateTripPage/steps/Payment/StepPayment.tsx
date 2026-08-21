import React from "react";
import { PaymentForm } from "@/components/shared";
import BookingSidebar from "@/components/shared/BookingSidebar/BookingSidebar";
import { BookingData } from "../../BookPrivateTripPage";
import { Trip } from "@/types";
import { submitTripBooking } from "@/lib/api";
import { formatPhoneE164 } from "@/utils/validators";
import { useState } from "react";

interface StepPaymentProps {
  trip: Trip;
  formData: BookingData;
  onChange: (patch: Partial<BookingData>) => void;
  onPrevious: () => void;
  onContinue: () => void;
  totalAmount: number;
  depositAmount: number;
  isGroupTrip?: boolean;
}

export default function StepPayment({
  trip, formData, onChange, onPrevious, onContinue,
  totalAmount, depositAmount, isGroupTrip,
}: StepPaymentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      const payload = {
        name: formData.name,
        trip_slug: trip.id,
        email: formData.email,
        phone: formatPhoneE164(formData.phone),
        nationality: formData.nationality,
        start_date: formatDate(formData.startDate),
        end_date: formatDate(formData.endDate),
        adults: formData.adults,
        children: formData.children,
        infants: formData.infants,
        rooms: {
          single: formData.rooms?.single || 0,
          double: formData.rooms?.double || 0,
          triple: formData.rooms?.triple || 0,
        },
        departure_month: formData.departureMonth,
        special_requests: formData.specialRequests,
        terms_accepted: formData.termsAccepted,
        tour_type: isGroupTrip ? "group" : "private",
      };

      await submitTripBooking(payload);
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
      confirmLabel={`Confirm & Pay $${depositAmount.toLocaleString()} Deposit`}
      onPrevious={onPrevious}
      onConfirm={handleSubmit}
      isLoading={isSubmitting}
      sidebar={
        <BookingSidebar
          trip={trip}
          formData={formData}
          totalAmount={totalAmount}
          depositAmount={depositAmount}
        />
      }
    />
  );
}
