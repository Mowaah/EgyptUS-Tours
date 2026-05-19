"use client";

import { useSearchParams } from "next/navigation";
import {
  BookingDetailsSections,
  PageHeader,
  type BookingDetailsSection,
  type TripBookingStatus,
} from "@/components/shared";
import styles from "./ProfileRequestDetailsPage.module.scss";

type RequestStatus = Extract<TripBookingStatus, "proposal_in_progress" | "proposal_sent">;

function LoadingGlyph() {
  return (
    <span className={styles.loadingGlyph} aria-hidden>
      <svg className={styles.spinnerSvg} width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25" />
        <path
          fill="none"
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function getStatus(value: string | null): RequestStatus {
  return value === "proposal_sent" ? "proposal_sent" : "proposal_in_progress";
}

export default function ProfileRequestDetailsPage() {
  const searchParams = useSearchParams();
  const status = getStatus(searchParams.get("status"));
  const requestType = searchParams.get("type") || "events";
  
  const isPlanYourTrip = requestType === "plan_your_trip";
  const isB2B = requestType === "b2b";

  let sections: BookingDetailsSection[] = [];

  if (isPlanYourTrip) {
    sections = [
      {
        title: "Destination",
        icon: "/images/summary/trip.svg",
        fields: [
          { label: "Selected Destinations", value: "Egypt, Dubai, Greece" },
        ],
        fieldsColumns: 1,
      },
      {
        title: "Traveler Information",
        icon: "/images/summary/contact.svg",
        fields: [
          { label: "Full Name", value: "Mohamed Hassan" },
          { label: "Email", value: "mohamed.hassan@gmail.com" },
          { label: "Phone Number", value: "+20 100 123 4567" },
          { label: "Nationality", value: "Egyptian" },
          { label: "Travel Dates", value: "May 10 -> May 17, 2026" },
          { label: "Travelers", value: "2 Adults • 1 Child" },
        ],
        fieldsColumns: 3,
      },
      {
        title: "Trip Details & Preferences",
        icon: "/images/summary/special.svg",
        fields: [
          { label: "Trip Category", value: "Luxury Tour" },
          { label: "Number of Days", value: "7-10 Days" },
          { label: "Budget", value: "$3,000 - $5,000" },
          { label: "Hotel Category", value: "5-Star Hotels" },
          { label: "Room Type", value: "Deluxe , Single & Sea view Rooms" },
          { label: "Transportation", value: "Private Transport" },
          { label: "Additional Experiences", value: "Private Tour Guide, VIP Airport Pickup" },
          { label: "Activities", value: "Snorkeling, Desert Safari, Food Tours" },
          { label: "Contact Method", value: "Whatsup" },
        ],
        fieldsColumns: 3,
        descriptionLabel: "Special Requests",
        description: "Honeymoon room setup, vegetarian meals, and airport fast-track assistance.",
      },
    ];
  } else if (isB2B) {
    sections = [
      {
        title: "Company Information",
        icon: "/images/profile/detail/organization-info.svg",
        fieldsColumns: 3,
        fields: [
          { label: "Company Name", value: "NileTech Solutions" },
          { label: "Country", value: "Egypt" },
          { label: "Contact Person", value: "Ahmed Hassan" },
          { label: "Job Title", value: "Event Manager" },
          { label: "Email Address", value: "ahmed.hassan@bluehorizonevents.com" },
          { label: "Phone Number", value: "+20 100 123 4567" },
          { label: "Website", value: "www.bluehorizonevents.com" },
        ],
        descriptionLabel: "Request Details",
        description:
          "We are planning a corporate event for approximately 120 attendees. We are looking for a full-service package including venue booking, accommodation, transportation, and event management. Preferred location is Cairo or El Gouna, with tentative dates in early May 2026.",
      },
    ];
  } else {
    sections = [
      {
        title: "Organization Information",
        icon: "/images/profile/detail/organization-info.svg",
        fieldsColumns: 3,
        fields: [
          { label: "Organization Name", value: "Blue Horizon Events" },
          { label: "Industry", value: "Event Management" },
          { label: "Country", value: "Egypt" },
          { label: "Website", value: "www.bluehorizonevents.com" },
          { label: "Contact Person", value: "Ahmed Hassan" },
          { label: "Job Title", value: "Event Manager" },
          { label: "Email Address", value: "ahmed.hassan@bluehorizonevents.com" },
          { label: "Phone Number", value: "+20 100 123 4567" },
        ],
      },
      {
        title: "Event Details",
        icon: "/images/profile/detail/event-details.svg",
        fieldsColumns: 3,
        fields: [
          { label: "Event Type", value: "Corporate Conference" },
          { label: "Event Name", value: "Annual Sales Conference 2026" },
          { label: "Expected Attendees", value: "150 - 200 Attendees" },
          { label: "Preferred City", value: "Cairo, Egypt" },
          { label: "Start Date", value: "March 15, 2026" },
          { label: "End Date", value: "March 18, 2026" },
        ],
        descriptionLabel: "Event Description",
        description:
          "A 4-day corporate conference focused on annual performance review, strategy alignment, and team-building activities. The event will include keynote presentations, breakout sessions, workshops, and networking opportunities. Accommodation, transportation, and full event management services are required.",
      },
      {
        title: "Event Requirements",
        icon: "/images/profile/detail/event-requirements.svg",
        fieldsColumns: 2,
        fields: [
          { label: "Venue Type", value: "Conference Hotel / Resort" },
          { label: "Additional Services", value: "Hotel Accommodation , Transportation , Technical Support" },
        ],
        descriptionLabel: "Additional Requirements",
        description:
          "We require a 5-star conference hotel with a main hall for 200 attendees and 3 breakout rooms. High-speed internet, AV equipment, and on-site technical support are essential. Airport transfers and daily transportation should be arranged for all attendees.",
      },
      {
        title: "Budget Information",
        icon: "/images/profile/detail/budget-info.svg",
        fieldsColumns: 3,
        fields: [
          { label: "Estimated Budget", value: "$5,000 - $10,000" },
          { label: "Budget Flexibility", value: "Fixed Budget" },
          { label: "How did you hear about us?", value: "Facebook , Instagram" },
        ],
      },
    ];
  }

  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumbs={[
          { label: "Profile", href: "/profile?tab=requests" },
          { label: "Requests Details", isCurrent: true },
        ]}
        title="Your Travel Space"
        subtitle="Easily access all your travel bookings and submitted requests in one organized place, with clear details about your trips, hotel stays, transportation, and upcoming plans."
      />

      <div className={styles.container}>
        <section className={styles.card}>
          <header className={styles.header}>
            <div>
              <h2>
                {isPlanYourTrip
                  ? "Your Custom Trip Request"
                  : isB2B
                    ? "Your Corporate Request Details"
                    : "Your Event Request"}
              </h2>
              <p>
                {isPlanYourTrip
                  ? "Track your custom trip request, review your travel details, and stay updated on your request status."
                  : isB2B
                    ? "Here's a summary of your submitted request."
                    : "Here are the details of your submitted event and its current status"}
              </p>
            </div>
            <span className={`${styles.statusBadge} ${status === "proposal_sent" ? styles.sent : styles.inProgress}`}>
              <span className={styles.statusIcon}>
                {status === "proposal_sent" ? "✓" : <LoadingGlyph />}
              </span>
              {status === "proposal_sent" ? "Proposal Sent" : "Proposal in progress"}
            </span>
          </header>

          <BookingDetailsSections sections={sections} className={styles.sections} />
        </section>
      </div>
    </div>
  );
}
