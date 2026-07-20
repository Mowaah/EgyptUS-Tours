import React from "react";
import InfoCard from "@/components/dashboard/shared/InfoCard/InfoCard";

interface CompanyInformationProps {
  request: {
    companyName: string;
    country: string;
    contactPerson: string;
    jobTitle: string;
    email: string;
    phone: string;
    website: string;
    requestDetails: string;
  };
}

export default function CompanyInformation({ request }: CompanyInformationProps) {
  const data = [
    { label: "Company Name", value: request.companyName },
    { label: "Country", value: request.country },
    { label: "Contact Person", value: request.contactPerson },
    { label: "Job Title", value: request.jobTitle },
    { label: "Email Address", value: request.email },
    { label: "Phone Number", value: request.phone },
    { label: "Website", value: request.website },
    { label: "Request Details:", value: request.requestDetails, isColumn: true },
  ];

  return (
    <InfoCard
      title="Company Information"
      iconSrc="/images/dashboard/requests/plan-your-trip/trip-details.svg"
      data={data}
    />
  );
}
