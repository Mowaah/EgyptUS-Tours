import React from "react";
import { PaymentForm } from "@/components/shared";
import BookingSidebar from "@/components/shared/BookingSidebar/BookingSidebar";
import { BookingData } from "../../BookHotelPage";
import { Hotel } from "@/types";

interface StepPaymentProps {
  hotel: Hotel;
  formData: BookingData;
  onChange: (patch: Partial<BookingData>) => void;
  onPrevious: () => void;
  onContinue: () => void;
  totalAmount: number;
  vatAmount: number;
  depositAmount: number;
  totalRooms: number;
  totalGuests: number;
}

export default function StepPayment({
  hotel, formData, onChange, onPrevious, onContinue,
  totalAmount, vatAmount, depositAmount, totalRooms, totalGuests,
}: StepPaymentProps) {
  return (
    <PaymentForm
      formData={formData}
      onChange={onChange}
      confirmLabel={`Confirm & Pay $${depositAmount.toFixed(2)} Deposit`}
      onPrevious={onPrevious}
      onConfirm={onContinue}
      sidebar={
        <BookingSidebar
          hotel={hotel}
          formData={formData}
          totalAmount={totalAmount}
          vatAmount={vatAmount}
          depositAmount={depositAmount}
          totalRooms={totalRooms}
          totalGuests={totalGuests}
        />
      }
    />
  );
}
