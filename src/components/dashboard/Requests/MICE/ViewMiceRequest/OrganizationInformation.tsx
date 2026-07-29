import React from "react";
import { InfoCard, InfoCardData } from "@/components/dashboard/shared";

interface OrganizationInformationProps {
  request: {
    organization_name: string;
    industry: string;
    country: string;
    website: string;
    contact_person: string;
    job_title: string;
    email: string;
    phone: string;
  };
}

export default function OrganizationInformation({ request }: OrganizationInformationProps) {
  const data: InfoCardData[] = [
    { label: "Organization Name", value: request.organization_name },
    { label: "Industry", value: request.industry },
    { label: "Country", value: request.country },
    { label: "Website", value: request.website },
    { label: "Contact Person", value: request.contact_person },
    { label: "Job Title", value: request.job_title },
    { label: "Email Address", value: request.email },
    { label: "Phone Number", value: request.phone },
  ];

  return (
    <InfoCard
      title="Organization Information"
      iconSrc="/images/dashboard/requests/plan-your-trip/trip-details.svg"
      data={data}
    />
  );
}
