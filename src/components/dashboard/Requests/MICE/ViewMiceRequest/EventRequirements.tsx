import React from "react";
import { InfoCard, InfoCardData } from "@/components/dashboard/shared";

interface EventRequirementsProps {
  request: {
    venueType: string;
    additionalServices: string;
    additionalRequirements: string;
  };
}

export default function EventRequirements({ request }: EventRequirementsProps) {
  const data: InfoCardData[] = [
    { label: "Venue Type", value: request.venueType },
    { label: "Additional Services", value: request.additionalServices },
    { label: "Additional Requirements", value: request.additionalRequirements, isColumn: true },
  ];

  return (
    <InfoCard
      title="Event Requirements"
      iconSrc="/images/dashboard/tag.svg"
      data={data}
    />
  );
}
