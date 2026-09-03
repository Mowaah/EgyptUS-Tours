"use client";

import { BookingStepFooter, BookingDetailsSections } from "@/components/shared";
import pageStyles from "../../PlanYourTripPage.module.scss";
import type { TripData, PlanDestination } from "../../planYourTripTypes";
import { getNationalityName } from "@/utils/nationality";
import { useTranslation } from "@/hooks/useTranslation";

interface StepReviewProps {
  tripData: TripData;
  availableDestinations?: PlanDestination[];
  isSubmitting?: boolean;
  submitError?: string | null;
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
  availableDestinations,
  isSubmitting,
  submitError,
  onPrevious,
  onContinue,
}: StepReviewProps) {
  const { t } = useTranslation("booking");
  const { travelerInfo, preferences, destinations } = tripData;

  const destinationLabel = destinations
    .map((id) => {
      if (availableDestinations) {
        const dest = availableDestinations.find(d => String(d.id) === String(id));
        if (dest) return dest.name;
      }
      return typeof id === 'string' ? id.charAt(0).toUpperCase() + id.slice(1) : String(id);
    })
    .join(", ");

  const travelersParts = [];
  if (travelerInfo.adults > 0) {
    travelersParts.push(`${travelerInfo.adults} ${travelerInfo.adults === 1 ? t("sidebar.adults", "Adult") : t("sidebar.adults", "Adults")}`);
  }
  if (travelerInfo.children > 0) {
    travelersParts.push(`${travelerInfo.children} ${travelerInfo.children === 1 ? t("sidebar.children", "Child") : t("sidebar.children", "Children")}`);
  }
  if (travelerInfo.infants > 0) {
    travelersParts.push(`${travelerInfo.infants} ${travelerInfo.infants === 1 ? t("sidebar.infants", "Infant") : t("sidebar.infants", "Infants")}`);
  }
  const travelersValue = travelersParts.join(" • ") || "None";

  const sections = [
    {
      title: t("planYourTrip.destination.title", "Destination"),
      icon: "/images/summary/trip.svg",
      fields: [
        { label: t("planYourTrip.review.selectedDestinations", "Selected Destinations"), value: destinationLabel || "None Selected" },
      ],
      fieldsColumns: 1 as const,
    },
    {
      title: t("planYourTrip.travelerInfo.title", "Traveler Information"),
      icon: "/images/summary/contact.svg",
      fields: [
        { label: t("planYourTrip.travelerInfo.name", "Full Name"), value: travelerInfo.name || "N/A" },
        { label: t("planYourTrip.travelerInfo.email", "Email"), value: travelerInfo.email || "N/A" },
        { label: t("planYourTrip.travelerInfo.phone", "Phone Number"), value: travelerInfo.phone || "N/A" },
        { label: t("planYourTrip.travelerInfo.nationality", "Nationality"), value: travelerInfo.nationality ? getNationalityName(travelerInfo.nationality) : "N/A" },
        { label: t("planYourTrip.travelerInfo.tripDates", "Travel Dates"), value: formatTravelDates(travelerInfo.startDate, travelerInfo.endDate) },
        { label: t("planYourTrip.travelerInfo.travelers", "Travelers"), value: travelersValue },
      ],
      fieldsColumns: 3 as const,
    },
    {
      title: t("planYourTrip.preferences.title", "Trip Details & Preferences"),
      icon: "/images/summary/special.svg",
      fields: [
        { label: t("planYourTrip.preferences.tripCategory", "Trip Category"), value: preferences.tripCategory.join(", ") || "None Selected" },
        { label: t("planYourTrip.preferences.duration", "Number of Days"), value: preferences.duration ? t(`planYourTrip.options.duration.${preferences.duration}`, preferences.duration) : "N/A" },
        { label: t("planYourTrip.preferences.budget", "Budget"), value: preferences.budget ? t(`planYourTrip.options.budget.${preferences.budget}`, preferences.budget) : "N/A" },
        { label: t("planYourTrip.preferences.hotelCategory", "Hotel Category"), value: formatHotelCategory(preferences.hotelCategory) || "N/A" },
        { label: t("planYourTrip.preferences.roomType", "Room Type"), value: preferences.roomType.map(r => t(`planYourTrip.options.roomType.${r}`, r)).join(", ") || "None Selected" },
        { label: t("planYourTrip.preferences.transportation", "Transportation"), value: preferences.transportation ? t(`planYourTrip.options.transport.${preferences.transportation}`, preferences.transportation) : "N/A" },
        { label: t("planYourTrip.preferences.experiences", "Additional Experiences"), value: preferences.experiences.map(e => t(`planYourTrip.options.experiences.${e}`, e)).join(", ") || "None Selected" },
        { label: t("planYourTrip.preferences.activities", "Activities"), value: preferences.activities.map(a => t(`planYourTrip.options.activities.${a}`, a)).join(", ") || "None Selected" },
        { label: t("planYourTrip.preferences.contactMethod", "Contact Method"), value: preferences.contactMethod ? t(`planYourTrip.options.contactMethod.${preferences.contactMethod}`, preferences.contactMethod) : "N/A" },
      ],
      fieldsColumns: 3 as const,
      descriptionLabel: t("planYourTrip.preferences.specialRequests", "Special Requests"),
      description: travelerInfo.tripDetails || "None provided",
    },
  ];

  return (
    <div className={pageStyles.stepFormCard}>
      <header className={pageStyles.stepFormCardHeader}>
        <div className={pageStyles.formHeaderColumn}>
          <h2 className={pageStyles.formTitle}>{t("planYourTrip.review.title", "Review & Submit")}</h2>
          <p className={pageStyles.formSubtitle}>
            {t("planYourTrip.review.subtitle", "Here's a summary of your personalized trip request.")}
          </p>
        </div>
      </header>

      <div className={pageStyles.stepFormCardScroll}>
        <BookingDetailsSections sections={sections} />
        
        {submitError && (
          <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginTop: '1rem', fontSize: '14px' }}>
            {submitError}
          </div>
        )}
      </div>

      <BookingStepFooter
        onPrevious={onPrevious}
        onContinue={onContinue}
        continueLabel={isSubmitting ? t("planYourTrip.review.submitting", "Submitting...") : t("planYourTrip.review.submitButton", "Submit Trip Request")}
        continueDisabled={isSubmitting}
      />
    </div>
  );
}
