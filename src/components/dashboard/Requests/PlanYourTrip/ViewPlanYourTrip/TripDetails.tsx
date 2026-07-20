import React from "react";
import { InfoCard, InfoCardData } from "@/components/dashboard/shared";
import StarRating from "@/components/shared/StarRating/StarRating";
import styles from "./ViewPlanYourTrip.module.scss";

interface TripDetailsProps {
  request: {
    category: string;
    duration: string;
    budget: string;
    hotelCategory: number;
    roomType: string;
    transportation: string;
    additionalExperience: string;
    activities: string;
    contactMethod: string;
    specialRequest: string;
  };
}

export default function TripDetails({ request }: TripDetailsProps) {
  const data: InfoCardData[] = [
    { label: "Trip Category", value: request.category },
    { label: "Number of Days", value: request.duration },
    { label: "Budget", value: request.budget },
    { 
      label: "Hotel Category", 
      value: <StarRating value={request.hotelCategory} formatDisplayValue={(v) => v.toFixed(1)} />
    },
    { label: "Ideal Room Type", value: request.roomType },
    { label: "Transportation Preferences", value: request.transportation },
    { label: "Additional Experience", value: request.additionalExperience },
    { label: "Activities", value: request.activities },
    { label: "Preferred Contact Method", value: request.contactMethod },
    { label: "Special Request :", value: request.specialRequest, isColumn: true },
  ];

  return (
    <InfoCard
      title="Trip Details"
      iconSrc="/images/dashboard/requests/plan-your-trip/trip-details.svg"
      data={data}
    />
  );
}
