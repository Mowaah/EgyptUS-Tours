import type { DataTableColumn } from "@/components/dashboard/DataTable";
import type { TransportationBookingRow } from "../types";
import styles from "./TransportationPanel.module.scss";

import Image from "next/image";

export const getPillStyle = (status: string) => {
  const map: Record<string, string> = {
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

const formatDateTime = (dateStr: string, timeStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  if (!timeStr) return date;
  return `${date} / ${timeStr.slice(0, 5)}`;
};

const getImageUrl = (path?: string | null) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  return `${apiUrl}${path}`;
};

export const transportationColumns: DataTableColumn<TransportationBookingRow>[] = [
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
    id: "vehicleClass",
    header: "Vehicle Class",
    render: (row) => row.vehicle_class?.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
  },
  {
    id: "dateTime",
    header: "Date / Time",
    render: (row) => formatDateTime(row.pickup_date, row.pickup_time),
  },
  {
    id: "route",
    header: "Route",
    render: (row) => row.route,
  },
  {
    id: "tripType",
    header: "Trip Type",
    render: (row) => row.trip_type === "one_way" ? "One Way" : row.trip_type === "round_trip" ? "Round Trip" : "-",
  },
  {
    id: "paymentStatus",
    header: "Payment",
    render: (row) => (
      <span className={getPillStyle(row.remaining_payment_status)}>
        <i aria-hidden />
        {row.remaining_payment_status ? row.remaining_payment_status.charAt(0).toUpperCase() + row.remaining_payment_status.slice(1) : "-"}
      </span>
    ),
  },
  {
    id: "operationalStatus",
    header: "Status",
    render: (row) => (
      <span className={getPillStyle(row.operational_status)}>
        <i aria-hidden />
        {row.operational_status ? row.operational_status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "-"}
      </span>
    ),
  },
  {
    id: "source",
    header: "Source",
    render: (row) => (
      <span className={getPillStyle(row.source)}>
        {row.source === "website" ? (
          <Image src="/images/dashboard/customers/custom/website.svg" alt="" width={14} height={14} aria-hidden />
        ) : (row.source === "admin" || row.source === "agent") ? (
          <Image src="/images/dashboard/customers/custom/agent.svg" alt="" width={14} height={14} aria-hidden />
        ) : (
          <i aria-hidden />
        )}
        {row.source ? (row.source === "admin" ? "Agent" : row.source.charAt(0).toUpperCase() + row.source.slice(1)) : "-"}
      </span>
    ),
  },
  {
    id: "assignedTo",
    header: "Assigned",
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
          <span style={{ color: "#94a3b8", fontWeight: 400 }}>Unassigned</span>
        )}
      </div>
    ),
  },
];

export const transportationRowActions = (onAction: (action: string, row: TransportationBookingRow) => void) => [
  { label: "View", iconSrc: "/images/dashboard/view.svg", onClick: (row: TransportationBookingRow) => onAction("View", row) },
  { label: "Re-Assign To", iconSrc: "/images/dashboard/assign.svg", onClick: (row: TransportationBookingRow) => onAction("Re-Assign To", row) },
  { label: "Send Email Reminder", iconSrc: "/images/dashboard/booking/trips/notification-bing.svg", onClick: (row: TransportationBookingRow) => onAction("Send Email Reminder", row) },
];
