import type { DataTableColumn } from "@/components/dashboard/DataTable";
import type { TripBookingRow } from "../types";
import styles from "./TripsPanel.module.scss";

import Image from "next/image";

export const getTripsPillStyle = (status: string) => {
  const map: Record<string, string> = {
    private: styles.pillPrivate,
    group: styles.pillGroup,
    paid: styles.pillPaid,
    fully_paid: styles.pillPaid,
    pending: styles.pillPending,
    partially_paid: styles.pillPending,
    upcoming: styles.pillUpcoming,
    cancelled: styles.pillCanceled,
    canceled: styles.pillCanceled,
    refunded: styles.pillRefunded,
    on_trip: styles.pillOnTrip,
    completed: styles.pillCompleted,
    overdue: styles.pillOverdue,
    website: styles.pillWebsite,
    admin: styles.pillAgent,
  };
  return `${styles.pill} ${map[status?.toLowerCase()] || ""}`;
};

const getImageUrl = (path?: string | null) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  return `${apiUrl}${path}`;
};

const formatDateRange = (start: string, end: string) => {
  if (!start) return "-";
  const sDate = new Date(start).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  if (!end) return sDate;
  const eDate = new Date(end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${sDate} - ${eDate}`;
};

export const tripsColumns: DataTableColumn<TripBookingRow>[] = [
  {
    id: "booking_code",
    header: "Booking ID",
    cellClassName: styles.idCell,
    render: (row) => row.booking_code,
  },
  {
    id: "customerName",
    header: "Customer",
    render: (row) => row.customer_name,
  },
  {
    id: "tripName",
    header: "Trip",
    render: (row) => row.trip_title,
  },
  {
    id: "dates",
    header: "Dates",
    render: (row) => formatDateRange(row.start_date, row.end_date),
  },
  {
    id: "tourType",
    header: "Tour Type",
    render: (row) => (
      <span className={getTripsPillStyle(row.tour_type)}>
        {row.tour_type === "private" ? (
          <Image src="/images/dashboard/booking/trips/private.svg" alt="" width={16} height={16} aria-hidden />
        ) : row.tour_type === "group" ? (
          <Image src="/images/dashboard/booking/trips/group.svg" alt="" width={16} height={16} aria-hidden />
        ) : (
          <i aria-hidden />
        )}
        {row.tour_type === "private" ? "Private" : row.tour_type === "group" ? "Group" : "-"}
      </span>
    ),
  },
  {
    id: "paymentStatus",
    header: "Payment",
    render: (row) => (
      <span className={getTripsPillStyle(row.remaining_payment_status)}>
        <i aria-hidden />
        {row.remaining_payment_status ? row.remaining_payment_status.charAt(0).toUpperCase() + row.remaining_payment_status.slice(1) : "-"}
      </span>
    ),
  },
  {
    id: "operationalStatus",
    header: "Status",
    render: (row) => (
      <span className={getTripsPillStyle(row.operational_status)}>
        <i aria-hidden />
        {row.operational_status ? row.operational_status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "-"}
      </span>
    ),
  },
  {
    id: "source",
    header: "Source",
    render: (row) => (
      <span className={getTripsPillStyle(row.source)}>
        {row.source === "website" ? (
          <Image src="/images/dashboard/customers/custom/website.svg" alt="" width={14} height={14} aria-hidden />
        ) : row.source === "admin" ? (
          <Image src="/images/dashboard/customers/custom/agent.svg" alt="" width={14} height={14} aria-hidden />
        ) : (
          <i aria-hidden />
        )}
        {row.source ? row.source.charAt(0).toUpperCase() + row.source.slice(1) : "-"}
      </span>
    ),
  },
  {
    id: "assignedAgent",
    header: "Assigned Agent",
    render: (row) => (
      <div className={styles.agentCell}>
        {row.assigned_to ? (
          <>
            {row.assigned_to.profile_picture ? (
              <Image src={getImageUrl(row.assigned_to.profile_picture)} alt="" width={32} height={32} style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
            ) : (
              <div className={styles.agentAvatar}>{row.assigned_to.full_name.charAt(0)}</div>
            )}
            <span>{row.assigned_to.full_name}</span>
          </>
        ) : (
          <span style={{ color: "#94a3b8" }}>Unassigned</span>
        )}
      </div>
    ),
  },
];

export const tripsRowActions = (onAction?: (action: string, row: TripBookingRow) => void): any[] => [
  { label: "View", iconSrc: "/images/dashboard/view.svg", onClick: (row: TripBookingRow) => { if (onAction) onAction("View", row); } },
  { label: "Re-Assign To", iconSrc: "/images/dashboard/assign.svg", onClick: (row: TripBookingRow) => { if (onAction) onAction("Re-Assign To", row); } },
  { label: "Send Email Reminder", iconSrc: "/images/dashboard/booking/trips/notification-bing.svg", onClick: (row: TripBookingRow) => { if (onAction) onAction("Send Email Reminder", row); } },
];
