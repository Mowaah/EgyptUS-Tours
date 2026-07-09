import type { DataTableColumn } from "@/components/dashboard/DataTable";
import type { TripBookingRow } from "../types";
import styles from "./TripsPanel.module.scss";

import Image from "next/image";

export const getTripsPillStyle = (status: string) => {
  const map: Record<string, string> = {
    Private: styles.pillPrivate,
    Group: styles.pillGroup,
    Paid: styles.pillPaid,
    Pending: styles.pillPending,
    Overdue: styles.pillOverdue,
    Upcoming: styles.pillUpcoming,
    Canceled: styles.pillCanceled,
    Refunded: styles.pillRefunded,
    "On Trip": styles.pillOnTrip,
    Completed: styles.pillCompleted,
    Website: styles.pillWebsite,
    Agent: styles.pillAgent,
  };
  return `${styles.pill} ${map[status] || ""}`;
};

export const tripsColumns: DataTableColumn<TripBookingRow>[] = [
  {
    id: "id",
    header: "Booking ID",
    cellClassName: styles.idCell,
    render: (row) => row.id,
  },
  {
    id: "customerName",
    header: "Customer",
    render: (row) => row.customerName,
  },
  {
    id: "tripName",
    header: "Trip",
    render: (row) => row.tripName,
  },
  {
    id: "dates",
    header: "Dates",
    render: (row) => row.dates,
  },
  {
    id: "tourType",
    header: "Tour Type",
    render: (row) => (
      <span className={getTripsPillStyle(row.tourType)}>
        {row.tourType === "Private" ? (
          <Image src="/images/dashboard/booking/trips/private.svg" alt="" width={16} height={16} aria-hidden />
        ) : row.tourType === "Group" ? (
          <Image src="/images/dashboard/booking/trips/group.svg" alt="" width={16} height={16} aria-hidden />
        ) : (
          <i aria-hidden />
        )}
        {row.tourType}
      </span>
    ),
  },
  {
    id: "depositStatus",
    header: "Remaining 70%",
    render: (row) => (
      <span className={getTripsPillStyle(row.depositStatus)}>
        <i aria-hidden />
        {["Paid", "Pending", "Overdue"].includes(row.depositStatus) ? `70% ${row.depositStatus}` : row.depositStatus}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    render: (row) => (
      <span className={getTripsPillStyle(row.status)}>
        <i aria-hidden />
        {row.status}
      </span>
    ),
  },
  {
    id: "source",
    header: "Source",
    render: (row) => (
      <span className={getTripsPillStyle(row.source)}>
        {row.source === "Website" ? (
          <Image src="/images/dashboard/customers/custom/website.svg" alt="" width={14} height={14} aria-hidden />
        ) : row.source === "Agent" ? (
          <Image src="/images/dashboard/customers/custom/agent.svg" alt="" width={14} height={14} aria-hidden />
        ) : (
          <i aria-hidden />
        )}
        {row.source}
      </span>
    ),
  },
  {
    id: "assignedAgent",
    header: "Assigned",
    render: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "max-content" }}>
        <Image
          src={row.assignedAgent === "Sara M." ? "/images/dashboard/sara.jpg" : "/images/dashboard/sidebar/user-management.svg"}
          alt={row.assignedAgent}
          width={32}
          height={32}
          style={{ 
            borderRadius: "32px", 
            objectFit: "cover",
            ...(row.assignedAgent !== "Sara M." && { background: "#F0F1F3", padding: "6px" })
          }}
        />
        <span style={{ color: "#4B5563", fontSize: "14px", fontWeight: 400, whiteSpace: "nowrap" }}>{row.assignedAgent}</span>
      </div>
    ),
  },
];

export const tripsRowActions = (onAction?: (action: string, row: TripBookingRow) => void): any[] => [
  { label: "View", iconSrc: "/images/dashboard/view.svg", onClick: (row: TripBookingRow) => { if (onAction) onAction("View", row); } },
  { label: "Re-Assign To", iconSrc: "/images/dashboard/assign.svg", onClick: (row: TripBookingRow) => { if (onAction) onAction("Re-Assign To", row); } },
  { label: "Send Email Reminder", iconSrc: "/images/dashboard/booking/trips/notification-bing.svg", onClick: (row: TripBookingRow) => { if (onAction) onAction("Send Email Reminder", row); } },
];
