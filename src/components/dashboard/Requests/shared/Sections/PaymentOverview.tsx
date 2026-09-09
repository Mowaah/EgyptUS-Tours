import React from "react";
import { InfoCard, InfoCardData } from "@/components/dashboard/shared";

interface PaymentOverviewProps {
  request: {
    payment_plan: string;
    payment_method: string;
    total_price: string;
    deposit_amount: string;
    remaining_balance: string;
    remaining_amount?: string;
    currency: string;
    deposit_percentage: number;
  };
}

export default function PaymentOverview({ request }: PaymentOverviewProps) {
  const formatMoney = (val: string | number) => {
    const num = typeof val === 'number' ? val : parseFloat(val);
    if (isNaN(num)) return "0";
    return num.toLocaleString();
  };

  const formatLabel = (str: string) => {
    if (!str) return "-";
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const isDeposit = !request.payment_plan || request.payment_plan.toLowerCase().includes("deposit");
  const totalPrice = parseFloat(request.total_price) || 0;
  const depositPercentage = request.deposit_percentage || 30;
  const depositAmount = request.deposit_amount ? parseFloat(request.deposit_amount) : (totalPrice * (depositPercentage / 100));
  const remaining70Percent = request.remaining_amount 
    ? parseFloat(request.remaining_amount) 
    : Math.max(0, totalPrice - depositAmount);

  const data: InfoCardData[] = [
    { label: "Payment Plan", value: formatLabel(request.payment_plan) },
    { label: "Payment Method", value: formatLabel(request.payment_method) },
    { 
      label: "Total Package", 
      value: (
        <span style={{ color: "#0066FF", fontWeight: "700" }}>
          ${formatMoney(request.total_price)}
        </span>
      ) 
    },
    ...(isDeposit ? [
      { label: `Deposit (${depositPercentage}%)`, value: `$${formatMoney(depositAmount)}` },
      { label: `Remaining (${100 - depositPercentage}%)`, value: `$${formatMoney(remaining70Percent)}` },
    ] : [
      { label: `Payment Amount (100%)`, value: `$${formatMoney(request.total_price)}` },
    ]),
  ];

  return (
    <InfoCard
      title="Payment Overview"
      iconSrc="/images/dashboard/requests/payment-overview.svg"
      data={data}
    />
  );
}
