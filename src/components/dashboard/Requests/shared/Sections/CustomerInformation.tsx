import React from "react";
import { InfoCard, InfoCardData } from "@/components/dashboard/shared";

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
    { label: "Nationality", value: request.nationality },
  ];

  return (
    <InfoCard
      title="Customer Information"
      iconSrc="/images/dashboard/sidebar/user.svg"
      data={data}
    />
  );
}
