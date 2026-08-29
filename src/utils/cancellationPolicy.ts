export interface RefundSummary {
  package_total: number;
  days_before_travel: number;
  policy_applied: string;
  deduction_percentage: number;
  deduction_amount: number;
  refund_amount: number;
}

export function calculateRefundSummary(
  totalPackageCost: number,
  paidAmount: number,
  travelDateStr: string,
  cancellationDateStr: string = new Date().toISOString()
): RefundSummary {
  const travelDate = new Date(travelDateStr);
  const cancelDate = new Date(cancellationDateStr);

  // Calculate difference in days (ignoring time of day)
  const tDate = new Date(travelDate.getFullYear(), travelDate.getMonth(), travelDate.getDate());
  const cDate = new Date(cancelDate.getFullYear(), cancelDate.getMonth(), cancelDate.getDate());
  const diffTime = tDate.getTime() - cDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let deductionPercent = 0;
  let policyLabel = "";

  if (diffDays >= 31) {
    deductionPercent = 10;
    policyLabel = "More than 30 days before service";
  } else if (diffDays === 30) {
    deductionPercent = 20;
    policyLabel = "30 days before service";
  } else if (diffDays >= 15 && diffDays <= 29) {
    deductionPercent = 40;
    policyLabel = "29-15 days before service";
  } else if (diffDays >= 10 && diffDays <= 14) {
    deductionPercent = 50;
    policyLabel = "14-10 days before service";
  } else if (diffDays >= 6 && diffDays <= 9) {
    deductionPercent = 60;
    policyLabel = "09-06 days before service";
  } else if (diffDays >= 3 && diffDays <= 5) {
    // 48 hrs is exactly 2 days. So > 48 hrs is 3+ days
    deductionPercent = 90;
    policyLabel = "05 days to 48 hrs before service";
  } else if (diffDays >= 0 && diffDays <= 2) {
    deductionPercent = 100;
    policyLabel = "Between 48 hours to the day of service";
  } else {
    deductionPercent = 100;
    policyLabel = "No Show / After service started";
  }

  const deductionAmount = (totalPackageCost * deductionPercent) / 100;
  const refundAmount = Math.max(0, paidAmount - deductionAmount);

  return {
    package_total: totalPackageCost,
    days_before_travel: diffDays,
    policy_applied: policyLabel,
    deduction_percentage: deductionPercent,
    deduction_amount: deductionAmount,
    refund_amount: refundAmount,
  };
}
