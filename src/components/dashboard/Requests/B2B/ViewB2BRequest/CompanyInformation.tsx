import React from "react";
import InfoCard from "@/components/dashboard/shared/InfoCard/InfoCard";

interface CompanyInformationProps {
  request: {
    company_name: string;
    country: string;
    contact_person: string;
    job_title: string;
    email: string;
    phone: string;
    website: string;
    request_details: string;
  };
}

export default function CompanyInformation({ request }: CompanyInformationProps) {
  const data = [
    { label: "Company Name", value: request.company_name },
    { label: "Country", value: request.country },
    { label: "Contact Person", value: request.contact_person },
    { label: "Job Title", value: request.job_title },
    { label: "Email Address", value: request.email },
    { label: "Phone Number", value: request.phone },
    { label: "Website", value: request.website },
    { label: "Request Details:", value: request.request_details, isColumn: true },
  ];

  return (
    <InfoCard
      title="Company Information"
      iconSrc="/images/dashboard/requests/plan-your-trip/trip-details.svg"
      data={data}
    />
  );
}
