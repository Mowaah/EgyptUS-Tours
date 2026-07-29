import React from "react";
import { InfoCard, InfoCardData } from "@/components/dashboard/shared";

interface EventDetailsProps {
  request: {
    event_type: string;
    event_name: string;
    expected_attendees: string;
    preferred_city: string;
    start_date: string;
    end_date: string;
    description: string;
  };
}

export default function EventDetails({ request }: EventDetailsProps) {
  const data: InfoCardData[] = [
    { label: "Event Type", value: request.event_type },
    { label: "Event Name", value: request.event_name },
    { label: "Expected Attendees", value: request.expected_attendees },
    { label: "Preferred City", value: request.preferred_city },
    { label: "Start Date", value: request.start_date },
    { label: "End Date", value: request.end_date },
    { label: "Event Description", value: request.description, isColumn: true },
  ];

  return (
    <InfoCard
      title="Event Details"
      iconSrc="/images/dashboard/sidebar/plan-your-trip.svg"
      data={data}
    />
  );
}
