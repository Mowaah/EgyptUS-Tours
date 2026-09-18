import React from "react";
import { InfoCard, InfoCardData } from "@/components/dashboard/shared";
import { formatVenueType, formatAdditionalServices } from "@/utils/formatMetric";

interface EventRequirementsProps {
  request: {
    venue_type: string;
    additional_services: string;
    additional_requirements: string;
  };
}

export default function EventRequirements({ request }: EventRequirementsProps) {
  const data: InfoCardData[] = [
    { label: "Venue Type", value: formatVenueType(request.venue_type) },
    { label: "Additional Services", value: formatAdditionalServices(request.additional_services) },
    { label: "Additional Requirements", value: request.additional_requirements, isColumn: true },
  ];

  return (
    <InfoCard
      title="Event Requirements"
      iconSrc="/images/dashboard/tag.svg"
      data={data}
    />
  );
}
