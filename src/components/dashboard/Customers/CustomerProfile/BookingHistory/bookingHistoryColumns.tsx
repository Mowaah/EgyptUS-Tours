"use client";

import { useRouter } from "next/navigation";
import type { DataTableColumn } from "@/components/dashboard/DataTable";
import StatusPill from "@/components/shared/StatusPill/StatusPill";
import ViewButton from "@/components/shared/ViewButton/ViewButton";

import styles from "./BookingHistoryPanel.module.scss";

export interface CustomerBookingItem {
  id: number | string;
  booking_code?: string;
  booking_reference?: string;
  display_id?: string;
  booking_type: string;
  title: string;
  status: string;
  display_status?: string;
  payment_status: string;
  total_price: string | number;
  currency?: string;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

const formatLabel = (str: string) => {
  if (!str) return "";
  const s = str.toLowerCase();
  if (s === "in_stay" || s === "in_hotel" || s === "in stay" || s === "in hotel") {
    return "In Hotel";
  }
  return str.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
};

const getServiceVariant = (service: string) => {
  const s = service?.toLowerCase() || "";
  if (s === "transportation" || s === "transport") return "pink";
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
    case "in_stay":
    case "in_hotel":
    case "in stay":
    case "in hotel":
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

function ViewAction({ row }: { row: CustomerBookingItem }) {
  const router = useRouter();

  const handleView = () => {
    const type = (row.booking_type || "").toLowerCase();
    const id = row.id;

    if (!id) return;

    if (type === "trip") {
      router.push(`/dashboard/bookings/trips/${id}`);
    } else if (type === "hotel") {
      router.push(`/dashboard/bookings/hotels/${id}`);
    } else if (type === "transport" || type === "transportation") {
      router.push(`/dashboard/bookings/transportation/${id}`);
    } else if (type === "custom_trip") {
      router.push(`/dashboard/requests/plan-your-trip/${id}`);
    } else if (type === "b2b" || type === "b2b_proposal") {
      router.push(`/dashboard/requests/b2b-programs/${id}`);
    } else if (type === "mice" || type === "event_proposal") {
      router.push(`/dashboard/requests/mice-corporate/${id}`);
    } else {
      router.push(`/dashboard/bookings/trips/${id}`);
    }
  };

  return <ViewButton onClick={handleView} />;
}

export const bookingHistoryColumns: DataTableColumn<CustomerBookingItem>[] = [
  {
    id: "bookingId",
    header: "Booking ID",
    render: (row) => (
      <span className={styles.idCell}>
        {row.booking_reference || row.display_id || row.booking_code || row.id}
      </span>
    ),
  },
  {
    id: "service",
    header: "Service",
    render: (row) => (
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
    render: (row) => row.title,
  },
  {
    id: "startDate",
    header: "Dates",
    render: (row) => (
      <span className={styles.dateCell}>
        {row.start_date
          ? row.end_date
            ? `${row.start_date} → ${row.end_date}`
            : row.start_date
          : "—"}
      </span>
    ),
  },
  {
    id: "totalPrice",
    header: "Total Price",
    render: (row) => (
      <span className={styles.priceCell}>
        ${Number(row.total_price || 0).toLocaleString()}
      </span>
    ),
  },
  {
    id: "depositStatus",
    header: "Payment",
    render: (row) => (
      <StatusPill 
        label={formatLabel(row.payment_status)} 
        variant={getStatusVariant(row.payment_status)} 
      />
    ),
  },
  {
    id: "status",
    header: "Status",
    render: (row) => (
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
    render: (row) => <ViewAction row={row} />,
  },
];
