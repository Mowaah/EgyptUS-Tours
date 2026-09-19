import React from "react";
import InfoCard from "@/components/dashboard/shared/InfoCard/InfoCard";
import { parseDate } from "@/utils/dateFormat";

interface CompanyInformationProps {
  request: {
    company_name?: string;
    country?: string;
    contact_person?: string;
    job_title?: string;
    email?: string;
    phone?: string;
    website?: string;
    request_details?: string;
    start_date?: string;
    end_date?: string;
  };
  startDate?: string;
  endDate?: string;
}

const formatB2BDate = (dateStr?: string | null): string => {
  if (!dateStr || dateStr === "-" || dateStr === "—") return "-";
  try {
    const d = parseDate(dateStr);
    if (!d || isNaN(d.getTime())) return dateStr;

    const dateFormatted = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const hasTime =
      dateStr.includes("T") ||
      dateStr.includes(":") ||
      (dateStr.includes(" ") && dateStr.split(" ").length > 1);

    if (hasTime) {
      const timeObj = new Date(
        dateStr.includes(" ") && !dateStr.includes("T")
          ? dateStr.replace(" ", "T")
          : dateStr
      );
      if (
        !isNaN(timeObj.getTime()) &&
        (timeObj.getHours() !== 0 ||
          timeObj.getMinutes() !== 0 ||
          dateStr.includes(":"))
      ) {
        const timeFormatted = timeObj.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        return `${dateFormatted} · ${timeFormatted}`;
      }
    }

    return dateFormatted;
  } catch {
    return dateStr;
  }
};

export default function CompanyInformation({ request, startDate, endDate }: CompanyInformationProps) {
  const effectiveStartDate = startDate || request?.start_date;
  const effectiveEndDate = endDate || request?.end_date;

  const data = [
    { label: "Company Name", value: request?.company_name || "-" },
    { label: "Country", value: request?.country || "-" },
    { label: "Contact Person", value: request?.contact_person || "-" },
    { label: "Job Title", value: request?.job_title || "-" },
    { label: "Email Address", value: request?.email || "-" },
    { label: "Phone Number", value: request?.phone || "-" },
    { label: "Website", value: request?.website || "-" },
    { label: "Request Details:", value: request?.request_details || "-", isColumn: true },
    { label: "Start Date", value: formatB2BDate(effectiveStartDate) },
    { label: "End Date", value: formatB2BDate(effectiveEndDate) },
  ];

  return (
    <InfoCard
      title="Company Information"
      iconSrc="/images/dashboard/requests/plan-your-trip/trip-details.svg"
      data={data}
    />
  );
}
