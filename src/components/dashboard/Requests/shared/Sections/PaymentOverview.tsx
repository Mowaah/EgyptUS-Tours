import React from "react";
import { InfoCard, InfoCardData } from "@/components/dashboard/shared";

interface PaymentOverviewProps {
  request: {
    payment_plan: string;
    payment_method: string;
    total_price: string;
    deposit_amount: string;
    remaining_balance: string;
    currency: string;
    deposit_percentage: number;
  };
}

export default function PaymentOverview({ request }: PaymentOverviewProps) {
  const formatMoney = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return "0";
    return num.toLocaleString();
  };

  const data: InfoCardData[] = [
    { label: "Payment Plan", value: request.payment_plan },
    { label: "Payment Method", value: request.payment_method },
    { 
      label: "Total Package", 
      value: (
        <span style={{ color: "#0066FF", fontWeight: "700" }}>
          ${formatMoney(request.total_price)}
        </span>
      ) 
    },
    { label: `Deposit (${request.deposit_percentage}%)`, value: `$${formatMoney(request.deposit_amount)}` },
    { label: `Remaining (${100 - request.deposit_percentage}%)`, value: `$${formatMoney(request.remaining_balance)}` },
  ];

  return (
    <InfoCard
      title="Payment Overview"
      iconSrc="/images/dashboard/requests/payment-overview.svg"
      data={data}
    />
  );
}
