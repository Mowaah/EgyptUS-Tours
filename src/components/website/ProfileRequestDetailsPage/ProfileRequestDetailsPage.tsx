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
  const requestType = searchParams.get("type") === "b2b" ? "b2b" : "events";
  const isB2B = requestType === "b2b";
  const sections: BookingDetailsSection[] = isB2B
    ? [
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
      ]
    : [
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

  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumbs={[
          { label: "Profile", href: "/profile?tab=requests" },
        ]}
        title="Your Travel Space"
        subtitle="Easily access all your travel bookings and submitted requests in one organized place, with clear details about your trips, hotel stays, transportation, and upcoming plans."
      />

      <div className={styles.container}>
        <section className={styles.card}>
          <header className={styles.header}>
            <div>
              <h2>{isB2B ? "Your Corporate Request Details" : "Your Event Request"}</h2>
              <p>
                {isB2B
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
