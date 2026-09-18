import React from "react";
import { InfoCard, InfoCardData } from "@/components/dashboard/shared";
import { formatBudgetRangeLabel, formatBudgetFlexibility, formatSource } from "@/utils/formatMetric";

interface BudgetInformationProps {
  request: {
    estimated_budget_range: string;
    budget_flexibility: string;
    hear_about_us: string;
  };
}

export default function BudgetInformation({ request }: BudgetInformationProps) {
  const data: InfoCardData[] = [
    { label: "Estimated Budget In USD", value: formatBudgetRangeLabel(request.estimated_budget_range) },
    { label: "Budget Flexibility", value: formatBudgetFlexibility(request.budget_flexibility) },
    { label: "How did you hear about us?", value: formatSource(request.hear_about_us) },
  ];

  return (
    <InfoCard
      title="Budget Information"
      iconSrc="/images/dashboard/revenue.svg"
      data={data}
    />
  );
}
