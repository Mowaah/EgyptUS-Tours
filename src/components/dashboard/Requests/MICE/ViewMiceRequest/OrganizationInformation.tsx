import React from "react";
import { InfoCard, InfoCardData } from "@/components/dashboard/shared";

interface OrganizationInformationProps {
  request: {
    organizationName: string;
    industry: string;
    country: string;
    website: string;
    contactPerson: string;
    jobTitle: string;
    email: string;
    phone: string;
  };
}

export default function OrganizationInformation({ request }: OrganizationInformationProps) {
  const data: InfoCardData[] = [
    { label: "Organization Name", value: request.organizationName },
    { label: "Industry", value: request.industry },
    { label: "Country", value: request.country },
    { label: "Website", value: request.website },
    { label: "Contact Person", value: request.contactPerson },
    { label: "Job Title", value: request.jobTitle },
    { label: "Email Address", value: request.email },
    { label: "Phone Number", value: request.phone },
  ];

  return (
    <InfoCard
      title="Organization Information"
      iconSrc="/images/dashboard/sidebar/dashboard.svg"
      data={data}
    />
  );
}
