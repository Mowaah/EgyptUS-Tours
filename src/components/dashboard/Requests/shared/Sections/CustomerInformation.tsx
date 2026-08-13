import React from "react";
import { InfoCard, InfoCardData } from "@/components/dashboard/shared";
import { COUNTRIES } from "@/data/countries";

const getCountryName = (code: string) => {
  if (!code) return "No nationality";
  const country = COUNTRIES.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
  return country ? country.nationality : code;
};

interface CustomerInformationProps {
  request: {
    name: string;
    email: string;
    phone: string;
    nationality: string;
  };
}

export default function CustomerInformation({ request }: CustomerInformationProps) {
  const data: InfoCardData[] = [
    { label: "Name", value: request.name },
    { label: "Email", value: request.email },
    { label: "Phone", value: request.phone },
    { label: "Nationality", value: getCountryName(request.nationality) },
  ];

  return (
    <InfoCard
      title="Customer Information"
      iconSrc="/images/dashboard/requests/plan-your-trip/customer-info.svg"
      data={data}
    />
  );
}
