import React from "react";
import { InfoCard, InfoCardData } from "@/components/dashboard/shared";

interface PaymentOverviewProps {
  request: {
    paymentPlan: string;
    paymentMethod: string;
    totalPackage: number;
    depositAmount: number;
    remainingAmount: number;
  };
}

export default function PaymentOverview({ request }: PaymentOverviewProps) {
  const data: InfoCardData[] = [
    { label: "Payment Plan", value: request.paymentPlan },
    { label: "Payment Method", value: request.paymentMethod },
    { 
      label: "Total Package", 
      value: (
        <span style={{ color: "#0066FF", fontWeight: "700" }}>
          ${request.totalPackage.toLocaleString()}
        </span>
      ) 
    },
    { label: "Deposit (30%)", value: `$${request.depositAmount.toLocaleString()}` },
    { label: "Remaining (70%)", value: `$${request.remainingAmount.toLocaleString()}` },
  ];

  return (
    <InfoCard
      title="Payment Overview"
      iconSrc="/images/dashboard/requests/payment-overview.svg"
      data={data}
    />
  );
}
