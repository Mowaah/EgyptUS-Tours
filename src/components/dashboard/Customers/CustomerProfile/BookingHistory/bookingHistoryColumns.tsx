import type { DataTableColumn } from "@/components/dashboard/DataTable";
import StatusPill from "@/components/shared/StatusPill/StatusPill";
import ViewButton from "@/components/shared/ViewButton/ViewButton";

import styles from "./BookingHistoryPanel.module.scss";

const formatLabel = (str: string) => {
  if (!str) return "";
  return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

const getServiceVariant = (service: string) => {
  const s = service?.toLowerCase() || "";
  if (s === "transportation") return "pink";
  if (s === "trip") return "blue";
  if (s === "hotel") return "orange";
  return "gray";
};

const getStatusVariant = (status: string) => {
  const s = status?.toLowerCase() || "";
  switch (s) {
    case "paid":
    case "completed":
    case "confirmed":
      return "green";
    case "pending":
    case "deposit_paid":
    case "on_trip":
      return "orange";
    case "overdue":
    case "canceled":
    case "cancelled":
    case "refunded":
      return "red";
    case "upcoming":
      return "blue";
    default:
      return "gray";
  }
};

export const bookingHistoryColumns: DataTableColumn<any>[] = [
  {
    id: "bookingId",
    header: "Booking ID",
    render: (row: any) => <span className={styles.idCell}>{row.id}</span>,
  },
  {
    id: "service",
    header: "Service",
    render: (row: any) => (
      <StatusPill 
        label={formatLabel(row.booking_type)} 
        variant={getServiceVariant(row.booking_type)} 
        hideDot 
      />
    ),
  },
  {
    id: "name",
    header: "Name",
    render: (row: any) => row.title,
  },
  {
    id: "startDate",
    header: "Dates",
    render: (row: any) => <span className={styles.dateCell}>{row.start_date} &rarr; {row.end_date}</span>,
  },
  {
    id: "totalPrice",
    header: "Total Price",
    render: (row: any) => (
      <span className={styles.priceCell}>
        {row.currency?.toLowerCase() === 'usd' ? '£' : row.currency?.toUpperCase()} {Number(row.total_price || 0).toLocaleString()}
      </span>
    ),
  },
  {
    id: "depositStatus",
    header: "Payment",
    render: (row: any) => (
      <StatusPill 
        label={formatLabel(row.payment_status)} 
        variant={getStatusVariant(row.payment_status)} 
      />
    ),
  },
  {
    id: "status",
    header: "Status",
    render: (row: any) => (
      <StatusPill 
        label={formatLabel(row.status)} 
        variant={getStatusVariant(row.status)} 
      />
    ),
  },

  {
    id: "actions",
    header: "",
    cellClassName: styles.actionCell,
    render: (row: any) => (
      <ViewButton onClick={() => console.log("View booking", row.id)} />
    ),
  },
];
