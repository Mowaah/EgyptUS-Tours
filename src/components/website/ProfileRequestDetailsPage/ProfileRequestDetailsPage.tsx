"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProfileRequestDetail } from "@/lib/api";
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
  const requestId = searchParams.get("id");
  const requestType = searchParams.get("type") || "events";
  
  const isPlanYourTrip = requestType === "plan_your_trip";
  const isB2B = requestType === "b2b";

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (requestId && requestType) {
      getProfileRequestDetail(requestType, requestId)
        .then(setData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [requestId, requestType]);

  const currentStatus = getStatus(data?.status || "proposal_in_progress");

  let sections: BookingDetailsSection[] = [];

  if (data && isPlanYourTrip) {
    sections = [
      {
        title: "Destination",
        icon: "/images/summary/trip.svg",
        fields: [
          { label: "Selected Destinations", value: data.details?.destination || "" },
        ],
        fieldsColumns: 1,
      },
      {
        title: "Traveler Information",
        icon: "/images/summary/contact.svg",
        fields: [
          { label: "Full Name", value: data.contact?.full_name || "" },
          { label: "Email", value: data.contact?.email || "" },
          { label: "Phone Number", value: data.contact?.phone || "" },
          { label: "Nationality", value: data.contact?.nationality || "" },
          { label: "Travel Dates", value: data.details?.travel_dates || "" },
          { label: "Travelers", value: data.details?.travelers_label || "" },
        ],
        fieldsColumns: 3,
      },
      {
        title: "Trip Details & Preferences",
        icon: "/images/summary/special.svg",
        fields: [
          { label: "Trip Category", value: data.details?.trip_category || "" },
          { label: "Number of Days", value: data.details?.duration_label || "" },
          { label: "Budget", value: data.details?.budget || "Not Specified" },
          { label: "Hotel Category", value: data.preferences?.hotel_category || "" },
          { 
            label: "Room Type", 
            value: (() => {
              const rt = data.preferences?.room_type;
              if (Array.isArray(rt)) return rt.join(", ");
              if (typeof rt === "string") {
                try {
                  const parsed = JSON.parse(rt.replace(/'/g, '"'));
                  if (Array.isArray(parsed)) return parsed.join(", ");
                } catch {
                  // ignore
                }
              }
              return rt || "";
            })()
          },
          { label: "Transportation", value: data.preferences?.transportation_type || "" },
          { label: "Additional Experiences", value: (data.preferences?.experiences || []).join(", ") },
        ],
        fieldsColumns: 3,
        descriptionLabel: "Special Requests",
        description: data.trip_details_text || "",
      },
    ];
  } else if (data && isB2B) {
    sections = [
      {
        title: "Company Information",
        icon: "/images/profile/detail/organization-info.svg",
        fieldsColumns: 3,
        fields: [
          { label: "Contact Person", value: data.contact?.contact_person || "" },
          { label: "Job Title", value: data.contact?.job_title || "" },
          { label: "Email Address", value: data.contact?.email || "" },
          { label: "Phone Number", value: data.contact?.phone || "" },
        ],
        descriptionLabel: "Request Details",
        description: data.request_details || "",
      },
    ];
  } else if (data) {
    sections = [
      {
        title: "Organization Information",
        icon: "/images/profile/detail/organization-info.svg",
        fieldsColumns: 3,
        fields: [
          { label: "Organization Name", value: data.organization?.organization_name || "" },
          { label: "Industry", value: data.organization?.industry || "" },
          { label: "Country", value: data.organization?.country || "" },
          { label: "Website", value: data.organization?.website || "" },
          { label: "Contact Person", value: data.contact?.contact_person || "" },
          { label: "Job Title", value: data.contact?.job_title || "" },
          { label: "Email Address", value: data.contact?.email || "" },
          { label: "Phone Number", value: data.contact?.phone || "" },
        ],
      },
      {
        title: "Event Details",
        icon: "/images/profile/detail/event-details.svg",
        fieldsColumns: 3,
        fields: [
          { label: "Event Type", value: data.event?.event_type || "" },
          { label: "Event Name", value: data.event?.event_name || "" },
          { label: "Expected Attendees", value: data.event?.expected_attendees || "" },
          { label: "Preferred City", value: data.event?.preferred_city || "" },
          { label: "Start Date", value: data.event?.start_date || "" },
          { label: "End Date", value: data.event?.end_date || "" },
        ],
        descriptionLabel: "Event Description",
        description: data.description || "",
      },
      {
        title: "Event Requirements",
        icon: "/images/profile/detail/event-requirements.svg",
        fieldsColumns: 2,
        fields: [
          { label: "Venue Type", value: data.event?.venue_type || "" },
          { label: "Additional Services", value: (data.event?.additional_services || []).join(" , ") },
        ],
        descriptionLabel: "Additional Requirements",
        description: data.additional_requirements || "",
      },
      {
        title: "Budget Information",
        icon: "/images/profile/detail/budget-info.svg",
        fieldsColumns: 3,
        fields: [
          { label: "Estimated Budget", value: data.event?.estimated_budget_range || "" },
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
            <span className={`${styles.statusBadge} ${currentStatus === "proposal_sent" ? styles.sent : styles.inProgress}`}>
              <span className={styles.statusIcon}>
                {currentStatus === "proposal_sent" ? "✓" : <LoadingGlyph />}
              </span>
              {currentStatus === "proposal_sent" ? "Proposal Sent" : "Proposal in progress"}
            </span>
          </header>

          {loading ? (
            <div style={{ padding: "4rem", textAlign: "center", color: "#666" }}>
              Loading request details...
            </div>
          ) : (
            <BookingDetailsSections sections={sections} className={styles.sections} />
          )}
        </section>
      </div>
    </div>
  );
}
