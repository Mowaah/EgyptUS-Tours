import type { DataTableColumn } from "@/components/dashboard/DataTable";
import type { TransportationBooking } from "../transportationData";
import styles from "./TransportationPanel.module.scss";

import Image from "next/image";

export const getPillStyle = (status: string) => {
  const map: Record<string, string> = {
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

export const transportationColumns: DataTableColumn<TransportationBooking>[] = [
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
    id: "vehicleClass",
    header: "Vehicle Class",
    render: (row) => row.vehicleClass,
  },
  {
    id: "dateTime",
    header: "Date / Time",
    render: (row) => row.dateTime,
  },
  {
    id: "route",
    header: "Route",
    render: (row) => row.route,
  },
  {
    id: "tripType",
    header: "Trip Type",
    render: (row) => row.tripType,
  },
  {
    id: "depositStatus",
    header: "Remaining 70%",
    render: (row) => (
      <span className={getPillStyle(row.depositStatus)}>
        <i aria-hidden />
        {row.depositStatus}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    render: (row) => (
      <span className={getPillStyle(row.status)}>
        <i aria-hidden />
        {row.status}
      </span>
    ),
  },
  {
    id: "source",
    header: "Source",
    render: (row) => (
      <span className={getPillStyle(row.source)}>
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
    id: "assignedTo",
    header: "Assigned",
    render: (row) => (
      <div className={styles.assignedToCell}>
        <Image src={row.assignedTo.avatarUrl} alt={row.assignedTo.name} width={24} height={24} className={styles.avatar} />
        <span>{row.assignedTo.name}</span>
      </div>
    ),
  },
];

export const transportationRowActions = (onAction: (action: string, row: TransportationBooking) => void) => [
  { label: "View", iconSrc: "/images/dashboard/view.svg", onClick: (row: TransportationBooking) => onAction("View", row) },
  { label: "Re-Assign To", iconSrc: "/images/dashboard/assign.svg", onClick: (row: TransportationBooking) => onAction("Re-Assign To", row) },
  { label: "Send Email Reminder", iconSrc: "/images/dashboard/booking/trips/notification-bing.svg", onClick: (row: TransportationBooking) => onAction("Send Email Reminder", row) },
];
