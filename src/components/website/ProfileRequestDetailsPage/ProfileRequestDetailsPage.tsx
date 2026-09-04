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
import { COUNTRIES } from "@/data/countries";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./ProfileRequestDetailsPage.module.scss";

const getCountryName = (code: string) => {
  if (!code) return "No nationality";
  const country = COUNTRIES.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
  return country ? country.nationality : code;
};

const getCountryDisplayName = (val?: string) => {
  if (!val) return "";
  const trimmed = val.trim();
  const country = COUNTRIES.find(
    (c) => c.code.toLowerCase() === trimmed.toLowerCase() || c.name.toLowerCase() === trimmed.toLowerCase()
  );
  return country ? country.name : trimmed;
};

interface ProfileRequestDetailData {
  status?: string | null;
  company_name?: string;
  country?: string;
  contact_person?: string;
  job_title?: string;
  email?: string;
  contactEmail?: string;
  phone?: string;
  website?: string;
  request_details?: string;
  requestDetails?: string;
  trip_details_text?: string;
  description?: string;
  additional_requirements?: string;
  title?: string;
  company?: {
    company_name?: string;
    name?: string;
    country?: string;
    website?: string;
  };
  contact?: {
    full_name?: string;
    contact_person?: string;
    name?: string;
    job_title?: string;
    email?: string;
    email_address?: string;
    phone?: string;
    phone_number?: string;
    nationality?: string;
    country?: string;
    website?: string;
  };
  organization?: {
    organization_name?: string;
    industry?: string;
    country?: string;
    website?: string;
  };
  event?: {
    event_type?: string;
    event_name?: string;
    expected_attendees?: string | number;
    preferred_city?: string;
    start_date?: string;
    end_date?: string;
    venue_type?: string;
    additional_services?: string[];
    estimated_budget_range?: string;
  };
  preferences?: {
    hotel_category?: string;
    room_type?: string | string[];
    transportation_type?: string;
    experiences?: string[];
  };
  details?: {
    destination?: string;
    trip_category?: string;
    duration_label?: string;
    travel_dates?: string;
    budget?: string;
    travelers_label?: string;
    company_name?: string;
    companyName?: string;
    country?: string;
    contact_person?: string;
    job_title?: string;
    email?: string;
    email_address?: string;
    phone?: string;
    phone_number?: string;
    website?: string;
    request_details?: string;
  };
  companyInfo?: {
    companyName?: string;
    country?: string;
    contactPerson?: string;
    jobTitle?: string;
    email?: string;
    phone?: string;
    website?: string;
    requestDetails?: string;
  };
  applicantName?: string;
}

type RequestStatus = Extract<TripBookingStatus, "proposal_in_progress" | "proposal_sent" | "confirmed">;

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
  if (value === "proposal_sent") return "proposal_sent";
  if (value === "closed" || value === "converted" || value === "fully_paid" || value === "paid" || value === "confirmed" || value === "approved") {
    return "confirmed";
  }
  return "proposal_in_progress";
}

export default function ProfileRequestDetailsPage() {
  const { t } = useTranslation("common");
  const searchParams = useSearchParams();
  const requestId = searchParams.get("id");
  const requestType = searchParams.get("type") || "events";
  
  const isPlanYourTrip = requestType === "plan_your_trip";
  const isB2B = requestType === "b2b";

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProfileRequestDetailData | null>(null);

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
          { label: "Nationality", value: getCountryName(data.contact?.nationality || "") },
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
    const companyName =
      data.company_name ||
      data.company?.company_name ||
      data.company?.name ||
      data.companyInfo?.companyName ||
      data.details?.company_name ||
      data.details?.companyName ||
      data.title ||
      "";

    const countryRaw =
      data.country ||
      data.company?.country ||
      data.contact?.country ||
      data.companyInfo?.country ||
      data.details?.country ||
      "";
    const country = getCountryDisplayName(countryRaw);

    const contactPerson =
      data.contact?.contact_person ||
      data.contact_person ||
      data.contact?.name ||
      data.companyInfo?.contactPerson ||
      data.applicantName ||
      data.details?.contact_person ||
      "";

    const jobTitle =
      data.contact?.job_title ||
      data.job_title ||
      data.companyInfo?.jobTitle ||
      data.details?.job_title ||
      "";

    const email =
      data.contact?.email ||
      data.contact?.email_address ||
      data.email ||
      data.contactEmail ||
      data.companyInfo?.email ||
      data.details?.email ||
      data.details?.email_address ||
      "";

    const phone =
      data.contact?.phone ||
      data.contact?.phone_number ||
      data.phone ||
      data.companyInfo?.phone ||
      data.details?.phone ||
      data.details?.phone_number ||
      "";

    const website =
      data.website ||
      data.company?.website ||
      data.contact?.website ||
      data.companyInfo?.website ||
      data.details?.website ||
      "";

    const requestDetails =
      data.request_details ||
      data.requestDetails ||
      data.details?.request_details ||
      data.companyInfo?.requestDetails ||
      "";

    sections = [
      {
        title: t("profile.details.companyInformation", "Company Information"),
        icon: "/images/profile/detail/company-info.svg",
        fieldsColumns: 3,
        fields: [
          { label: t("profile.card.companyName", "Company Name"), value: companyName },
          { label: t("profile.card.country", "Country"), value: country },
          { label: t("profile.card.contactPerson", "Contact Person"), value: contactPerson },
          { label: t("profile.details.jobTitle", "Job Title"), value: jobTitle },
          { label: t("profile.details.email", "Email Address"), value: email },
          { label: t("profile.details.phone", "Phone Number"), value: phone },
          { label: t("profile.card.website", "Website"), value: website },
        ],
        descriptionLabel: t("profile.details.requestDetails", "Request Details"),
        description: requestDetails,
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
          { label: t("userMenu.profile", "Profile"), href: "/profile?tab=requests" },
          { label: t("userMenu.requests", "Requests Details"), isCurrent: true },
        ]}
        title={t("profile.headerTitle", "Your Travel Space")}
        subtitle={t("profile.headerSubtitle", "Easily access all your travel bookings and submitted requests in one organized place, with clear details about your trips, hotel stays, transportation, and upcoming plans.")}
      />

      <div className={styles.container}>
        <section className={styles.card}>
          <header className={styles.header}>
            <div>
              <h2>
                {isPlanYourTrip
                  ? "Your Custom Trip Request"
                  : isB2B
                    ? t("profile.details.corporateRequestTitle", "Your Corporate Request Details")
                    : "Your Event Request"}
              </h2>
              <p>
                {isPlanYourTrip
                  ? "Track your custom trip request, review your travel details, and stay updated on your request status."
                  : isB2B
                    ? t("profile.details.corporateRequestSubtitle", "Here’s a summary of your submitted request.")
                    : "Here are the details of your submitted event and its current status"}
              </p>
            </div>
            <span className={`${styles.statusBadge} ${currentStatus === "proposal_sent" || currentStatus === "confirmed" ? styles.sent : styles.inProgress}`}>
              <span className={styles.statusIcon}>
                {currentStatus === "proposal_sent" || currentStatus === "confirmed" ? "✓" : <LoadingGlyph />}
              </span>
              {currentStatus === "proposal_sent" ? t("profile.card.proposalSent", "Proposal Sent") : currentStatus === "confirmed" ? t("profile.details.status.confirmed", "Confirmed") : t("profile.card.proposalInProgress", "Proposal in progress")}
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
