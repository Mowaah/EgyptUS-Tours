import React from "react";
import { InfoCard, InfoCardData } from "@/components/dashboard/shared";

interface BudgetInformationProps {
  request: {
    estimatedBudget: string;
    budgetFlexibility: string;
    source: string;
  };
}

export default function BudgetInformation({ request }: BudgetInformationProps) {
  const data: InfoCardData[] = [
    { label: "Estimated Budget In USD", value: request.estimatedBudget },
    { label: "Budget Flexibility", value: request.budgetFlexibility },
    { label: "How did you hear about us?", value: request.source },
  ];

  return (
    <InfoCard
      title="Budget Information"
      iconSrc="/images/dashboard/revenue.svg"
      data={data}
    />
  );
}
