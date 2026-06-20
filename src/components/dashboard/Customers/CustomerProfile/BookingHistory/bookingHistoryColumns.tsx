import type { DataTableColumn } from "@/components/dashboard/DataTable";
import StatusPill from "@/components/shared/StatusPill/StatusPill";
import ViewButton from "@/components/shared/ViewButton/ViewButton";
import type { BookingHistoryItem } from "./mockBookingHistory";
import styles from "./BookingHistoryPanel.module.scss";

const getServiceVariant = (service: string) => {
  if (service === "Transportation") return "pink";
  if (service === "Trips") return "blue";
  if (service === "Hotels") return "orange";
  return "gray";
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Paid":
    case "Completed":
      return "green";
    case "Pending":
    case "On Trip":
      return "orange";
    case "Overdue":
    case "Canceled":
      return "red";
    case "Upcoming":
      return "blue";
    default:
      return "gray";
  }
};

export const bookingHistoryColumns: DataTableColumn<BookingHistoryItem>[] = [
  {
    id: "bookingId",
    header: "Booking ID",
    render: (row) => <span className={styles.idCell}>{row.bookingId}</span>,
  },
  {
    id: "service",
    header: "Service",
    render: (row) => (
      <StatusPill 
        label={row.service} 
        variant={getServiceVariant(row.service)} 
        hideDot 
      />
    ),
  },
  {
    id: "name",
    header: "Name",
    render: (row) => row.name,
  },
  {
    id: "startDate",
    header: "Dates",
    render: (row) => <span className={styles.dateCell}>{row.startDate} &rarr; {row.endDate}</span>,
  },
  {
    id: "totalPrice",
    header: "Total Price",
    render: (row) => (
      <span className={styles.priceCell}>
        $ {row.totalPrice.toLocaleString()}
      </span>
    ),
  },
  {
    id: "depositStatus",
    header: "Deposit 30%",
    render: (row) => (
      <StatusPill 
        label={row.depositStatus} 
        variant={getStatusVariant(row.depositStatus)} 
      />
    ),
  },
  {
    id: "remainingStatus",
    header: "Remaining 70%",
    render: (row) => (
      <StatusPill 
        label={row.remainingStatus} 
        variant={getStatusVariant(row.remainingStatus)} 
      />
    ),
  },
  {
    id: "status",
    header: "Status",
    render: (row) => (
      <StatusPill 
        label={row.status} 
        variant={getStatusVariant(row.status)} 
      />
    ),
  },
  {
    id: "agent",
    header: "Agent",
    render: (row) => <span className={styles.agentCell}>{row.agent}</span>,
  },
  {
    id: "actions",
    header: "",
    cellClassName: styles.actionCell,
    render: (row) => (
      <ViewButton onClick={() => console.log("View booking", row.bookingId)} />
    ),
  },
];
