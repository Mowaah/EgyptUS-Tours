import React from "react";
import { InfoCard, InfoCardData } from "@/components/dashboard/shared";

interface TripPreferencesProps {
  request: {
    destinations: string;
    startDate: string;
    endDate: string;
    travelers: string;
  };
}

export default function TripPreferences({ request }: TripPreferencesProps) {
  const data: InfoCardData[] = [
    { label: "Destinations", value: request.destinations },
    { label: "Start Date", value: request.startDate },
    { label: "End Date", value: request.endDate },
    { label: "Travelers", value: request.travelers },
  ];

  return (
    <InfoCard
      title="Trip Preferences"
      iconSrc="/images/dashboard/requests/plan-your-trip/trip-pref.svg"
      data={data}
    />
  );
}
