import React from "react";
import { PaymentStep } from "@/components/dashboard/shared";

export default function StepPayment() {
  // Hardcoded package total for Trips for now (matches what was previously hardcoded)
  return <PaymentStep total={2500} />;
}
