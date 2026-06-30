import { BookingStepFooter, BookingDetailsSections } from "@/components/shared";
import pageStyles from "../../PlanYourTripPage.module.scss";
import type { TripData } from "../../planYourTripTypes";

interface StepReviewProps {
  tripData: TripData;
  onPrevious: () => void;
  onContinue: () => void;
}

function formatTravelDates(start: string, end: string) {
  if (!start && !end) return "Flexible";
  if (!start) return end;
  if (!end) return start;

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return `${start} -> ${end}`;
  }

  const startMonth = startDate.toLocaleDateString("en-US", { month: "short" });
  const startDay = startDate.getDate();
  const startYear = startDate.getFullYear();

  const endMonth = endDate.toLocaleDateString("en-US", { month: "short" });
  const endDay = endDate.getDate();
  const endYear = endDate.getFullYear();

  if (startYear === endYear) {
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} -> ${endDay}, ${startYear}`;
    }
    return `${startMonth} ${startDay} -> ${endMonth} ${endDay}, ${startYear}`;
  }
  return `${startMonth} ${startDay}, ${startYear} -> ${endMonth} ${endDay}, ${endYear}`;
}

const formatHotelCategory = (cat: string) => {
  if (cat === "5.0") return "5-Star Hotels";
  if (cat === "4.0") return "4-Star Hotels";
  if (cat === "3.0") return "3-Star Hotels";
  return cat;
};

export default function StepReview({
  tripData,
  onPrevious,
  onContinue,
}: StepReviewProps) {
  const { travelerInfo, preferences, destinations } = tripData;

  const destinationLabel = destinations
    .map((id) => id.charAt(0).toUpperCase() + id.slice(1))
    .join(", ");

  const travelersParts = [];
  if (travelerInfo.adults > 0) {
    travelersParts.push(`${travelerInfo.adults} ${travelerInfo.adults === 1 ? 'Adult' : 'Adults'}`);
  }
  if (travelerInfo.children > 0) {
    travelersParts.push(`${travelerInfo.children} ${travelerInfo.children === 1 ? 'Child' : 'Children'}`);
  }
  if (travelerInfo.infants > 0) {
    travelersParts.push(`${travelerInfo.infants} ${travelerInfo.infants === 1 ? 'Infant' : 'Infants'}`);
  }
  const travelersValue = travelersParts.join(" â€¢ ") || "None";

  const sections = [
    {
      title: "Destination",
      icon: "/images/summary/trip.svg",
      fields: [
        { label: "Selected Destinations", value: destinationLabel || "None Selected" },
      ],
      fieldsColumns: 1 as const,
    },
    {
      title: "Traveler Information",
      icon: "/images/summary/contact.svg",
      fields: [
        { label: "Full Name", value: travelerInfo.name || "N/A" },
        { label: "Email", value: travelerInfo.email || "N/A" },
        { label: "Phone Number", value: travelerInfo.phone || "N/A" },
        { label: "Nationality", value: travelerInfo.nationality || "N/A" },
        { label: "Travel Dates", value: formatTravelDates(travelerInfo.startDate, travelerInfo.endDate) },
        { label: "Travelers", value: travelersValue },
      ],
      fieldsColumns: 3 as const,
    },
    {
      title: "Trip Details & Preferences",
      icon: "/images/summary/special.svg",
      fields: [
        { label: "Trip Category", value: preferences.tripCategory.join(", ") || "None Selected" },
        { label: "Number of Days", value: preferences.duration || "N/A" },
        { label: "Budget", value: preferences.budget || "N/A" },
        { label: "Hotel Category", value: formatHotelCategory(preferences.hotelCategory) || "N/A" },
        { label: "Room Type", value: preferences.roomType.join(", ") || "None Selected" },
        { label: "Transportation", value: preferences.transportation || "N/A" },
        { label: "Additional Experiences", value: preferences.experiences.join(", ") || "None Selected" },
        { label: "Activities", value: preferences.activities.join(", ") || "None Selected" },
        { label: "Contact Method", value: preferences.contactMethod || "N/A" },
      ],
      fieldsColumns: 3 as const,
      descriptionLabel: "Special Requests",
      description: travelerInfo.tripDetails || "None provided",
    },
  ];

  return (
    <div className={pageStyles.stepFormCard}>
      <header className={pageStyles.stepFormCardHeader}>
        <div className={pageStyles.formHeaderColumn}>
          <h2 className={pageStyles.formTitle}>Review & Submit</h2>
          <p className={pageStyles.formSubtitle}>
            Hereâ€™s a summary of your personalized trip request.
          </p>
        </div>
      </header>

      <div className={pageStyles.stepFormCardScroll}>
        <BookingDetailsSections sections={sections} />
      </div>

      <BookingStepFooter
        onPrevious={onPrevious}
        onContinue={onContinue}
        continueLabel="Submit Trip Request"
      />
    </div>
  );
}
