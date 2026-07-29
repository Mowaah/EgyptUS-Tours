import React from "react";
import InfoCard from "@/components/dashboard/shared/InfoCard/InfoCard";

interface InquiryDetailsProps {
  data: any;
}

export default function InquiryDetails({ data }: InquiryDetailsProps) {
  const customerData = [
    { label: "Ref", value: data.inquiry_code },
    { label: "Full Name", value: data.full_name },
    { label: "Email Address", value: data.email },
    { label: "Message", value: data.message, isColumn: true },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <InfoCard
        title="Customer Information"
        iconSrc="/images/dashboard/sidebar/user-management.svg"
        data={customerData}
      />
    </div>
  );
}
