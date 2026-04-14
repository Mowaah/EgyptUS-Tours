"use client";

import { PaymentForm } from "@/components/shared";
import { TransportationBookingData, Vehicle } from "@/types";

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
  const numericPrice = parseFloat((vehicle.price ?? "0").replace(/[^0-9.]/g, ""));
  const deposit = (numericPrice * 0.3).toFixed(2);

  return (
    <PaymentForm
      formData={formData}
      onChange={onChange}
      confirmLabel={`Confirm & Pay $${deposit} Deposit`}
      onPrevious={onPrevious}
      onConfirm={onContinue}
    />
  );
}
