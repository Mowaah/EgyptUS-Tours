import React from "react";
import { InfoCard, InfoCardData } from "@/components/dashboard/shared";

interface EventDetailsProps {
  request: {
    eventType: string;
    eventName: string;
    expectedAttendees: string;
    preferredCity: string;
    startDate: string;
    endDate: string;
    eventDescription: string;
  };
}

export default function EventDetails({ request }: EventDetailsProps) {
  const data: InfoCardData[] = [
    { label: "Event Type", value: request.eventType },
    { label: "Event Name", value: request.eventName },
    { label: "Expected Attendees", value: request.expectedAttendees },
    { label: "Preferred City", value: request.preferredCity },
    { label: "Start Date", value: request.startDate },
    { label: "End Date", value: request.endDate },
    { label: "Event Description", value: request.eventDescription, isColumn: true },
  ];

  return (
    <InfoCard
      title="Event Details"
      iconSrc="/images/dashboard/sidebar/plan-your-trip.svg"
      data={data}
    />
  );
}
