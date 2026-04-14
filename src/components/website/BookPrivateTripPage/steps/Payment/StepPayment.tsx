import React from "react";
import { PaymentForm } from "@/components/shared";
import BookingSidebar from "@/components/shared/BookingSidebar/BookingSidebar";
import { BookingData } from "../../BookPrivateTripPage";
import { Trip } from "@/types";

interface StepPaymentProps {
  trip: Trip;
  formData: BookingData;
  onChange: (patch: Partial<BookingData>) => void;
  onPrevious: () => void;
  onContinue: () => void;
  totalAmount: number;
  depositAmount: number;
}

export default function StepPayment({
  trip, formData, onChange, onPrevious, onContinue,
  totalAmount, depositAmount,
}: StepPaymentProps) {
  return (
    <PaymentForm
      formData={formData}
      onChange={onChange}
      confirmLabel={`Confirm & Pay $${depositAmount.toLocaleString()} Deposit`}
      onPrevious={onPrevious}
      onConfirm={onContinue}
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
