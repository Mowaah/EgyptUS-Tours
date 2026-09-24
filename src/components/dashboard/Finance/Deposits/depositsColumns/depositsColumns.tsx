"use client";

import { useRouter } from "next/navigation";
import type { DataTableColumn } from "@/components/dashboard/DataTable";
import ViewButton from "@/components/shared/ViewButton/ViewButton";
import styles from "./depositsColumns.module.scss";
import { formatCurrencyAmount } from "@/utils/formatMetric";

export type DepositRow = any;

const serviceClass: Record<string, string> = {
  trip: styles.serviceTrips,
  transport: styles.serviceTransport,
  hotel: styles.serviceHotels,
  custom_trip: styles.serviceB2B,
  mice: styles.serviceMice,
  event_proposal: styles.serviceMice,
  b2b: styles.serviceB2B,
  b2b_proposal: styles.serviceB2B,
};

const serviceNames: Record<string, string> = {
  trip: "Trips",
  transport: "Transportation",
  hotel: "Hotels",
  custom_trip: "Custom Trip",
  mice: "MICE",
  event_proposal: "MICE",
  b2b: "B2B",
  b2b_proposal: "B2B",
};

function ViewAction({ row }: { row: DepositRow }) {
  const router = useRouter();

  const handleView = () => {
    const type = row.booking_type;
    const id = row.booking_pk;

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
    }
  };

  return <ViewButton onClick={handleView} />;
}

export const depositsColumns: DataTableColumn<DepositRow>[] = [
  {
    id: "bookingId",
    header: "Booking ID",
    cellClassName: styles.idCell,
    render: (row) => {
      const code = row.booking_code || row.booking_reference || row.display_id;
      if (code) return code;
      if (!row.booking_id) return "---";
      return String(row.booking_id).startsWith("#") ? row.booking_id : `#${row.booking_id}`;
    },
  },
  {
    id: "customer",
    header: "Customer",
    render: (row) => row.customer_name,
  },
  {
    id: "service",
    header: "Service",
    render: (row) => (
      <span className={`${styles.pill} ${serviceClass[row.booking_type] || styles.serviceTrips}`}>
        {serviceNames[row.booking_type] || row.booking_type}
      </span>
    ),
  },
  {
    id: "totalAmount",
    header: "Total Amount",
    render: (row) => formatCurrencyAmount(row.total_price),
  },
  {
    id: "deposit",
    header: "Deposit (30%)",
    render: (row) => formatCurrencyAmount(row.deposit_amount),
  },
  {
    id: "remainingBalance",
    header: "Remaining Balance (70%)",
    render: (row) => formatCurrencyAmount(row.remaining_balance),
  },
  {
    id: "dueDate",
    header: "Final Due Date",
    render: (row) => row.deposit_due_date || "---",
  },
  {
    id: "status",
    header: "Status",
    render: (row) => {
      const isPending = row.deposit_status === "pending";
      const isCollected = row.deposit_status === "collected";

      let statusStyle = styles.statusOverdue;
      if (isPending) statusStyle = styles.statusPending;
      else if (isCollected) statusStyle = styles.statusCollected || styles.statusPending;

      return (
        <span className={`${styles.statusPill} ${statusStyle}`}>
          <i aria-hidden />
          {row.deposit_status
            ? row.deposit_status.charAt(0).toUpperCase() + row.deposit_status.slice(1).toLowerCase()
            : "Unknown"}
        </span>
      );
    },
  },
  {
    id: "daysOverdue",
    header: "Days Overdue",
    render: (row) => (
      <span className={row.deposit_status === "overdue" ? styles.overdueText : ""}>
        {row.days_overdue > 0 ? `${row.days_overdue} ${row.days_overdue === 1 ? "Day" : "Days"}` : "---"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    render: (row) => <ViewAction row={row} />,
  },
];
