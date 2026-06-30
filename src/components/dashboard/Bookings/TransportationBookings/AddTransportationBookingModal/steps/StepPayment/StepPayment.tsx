import React from "react";
import { AddTransportationBookingData } from "../../AddTransportationBookingModal";
import { PaymentStep } from "@/components/dashboard/shared";

interface StepPaymentProps {
  formData: AddTransportationBookingData;
  onChange: (patch: Partial<AddTransportationBookingData>) => void;
}

export default function StepPayment({ formData }: StepPaymentProps) {
  // Calculate dynamic prices
  const getVehicleBasePrice = (type: string) => {
    switch (type) {
      case "SUV": return 80;
      case "Van": return 120;
      case "Bus": return 200;
      case "Sedan":
      default: return 50;
    }
  };

  const basePrice = getVehicleBasePrice(formData.vehicleType);
  const tripMultiplier = formData.tripType === "Round Trip" ? 2 : 1;
  const vehicleTotal = basePrice * tripMultiplier;
  
  const childSeatPrice = formData.childSeat ? 10 : 0;
  const extraLuggagePrice = formData.extraLuggageSpace ? 15 : 0;
  const meetAndGreetPrice = formData.meetAndGreetService ? 20 : 0;
  
  const subtotal = vehicleTotal + childSeatPrice + extraLuggagePrice + meetAndGreetPrice;
  const discount = 5;
  const vat = subtotal * 0.10; // 10% VAT
  const total = subtotal - discount + vat;

  return <PaymentStep total={total} />;
}
