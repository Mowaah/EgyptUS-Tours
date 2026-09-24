"use client";

import { useRouter } from "next/navigation";
import type { DataTableColumn } from "@/components/dashboard/DataTable";
import ViewButton from "@/components/shared/ViewButton/ViewButton";
import styles from "../PaymentsTable/PaymentsTable.module.scss";

export interface PaymentRow {
  id: string;
  rawId?: number | string;
  bookingId: string;
  bookingPk?: number | string;
  bookingType?: string;
  customer: string;
  service: string;
  dates: string;
  method: string;
  status: string;
  rawStatus?: string;
}

const serviceClass: Record<string, string> = {
  Trips: styles.serviceTrips,
  Transportation: styles.serviceTransport,
  Hotels: styles.serviceHotels,
  B2B: styles.serviceB2B,
  MICE: styles.serviceMice,
  "Custom Trip": styles.serviceB2B,
};

function ViewAction({ row }: { row: PaymentRow }) {
  const router = useRouter();

  const handleView = () => {
    const type = row.bookingType;
    const id = row.bookingPk;

    if (!id) return;

    if (type === "trip") {
      router.push(`/dashboard/bookings/trips/${id}`);
    } else if (type === "hotel") {
      router.push(`/dashboard/bookings/hotels/${id}`);
    } else if (type === "transport" || type === "transportation") {
      router.push(`/dashboard/bookings/transportation/${id}`);
    } else if (type === "custom_trip") {
      router.push(`/dashboard/requests/plan-your-trip/${id}`);
    } else if (type === "b2b_proposal" || type === "b2b") {
      router.push(`/dashboard/requests/b2b-programs/${id}`);
    } else if (type === "event_proposal" || type === "mice") {
      router.push(`/dashboard/requests/mice-corporate/${id}`);
    }
  };

  return <ViewButton onClick={handleView} />;
}

export const paymentsColumns: DataTableColumn<PaymentRow>[] = [
  {
    id: "id",
    header: "Payment ID",
    cellClassName: styles.idCell,
    render: (row) => row.id,
  },
  {
    id: "bookingId",
    header: "Booking ID",
    render: (row) => row.bookingId,
  },
  {
    id: "customer",
    header: "Customer",
    render: (row) => row.customer,
  },
  {
    id: "service",
    header: "Service",
    render: (row) => (
      <span className={`${styles.pill} ${serviceClass[row.service]}`}>
        {row.service}
      </span>
    ),
  },
  {
    id: "dates",
    header: "Dates",
    render: (row) => row.dates,
  },
  {
    id: "method",
    header: "Method",
    render: (row) => row.method,
  },
  {
    id: "status",
    header: "Status",
    render: (row) => {
      const statusLower = row.status.toLowerCase();
      const isPaid = statusLower === "fully paid";
      const isInProgress = statusLower === "in progress";

      let statusClass = styles.statusRefunded;
      if (isPaid) statusClass = styles.statusPaid;
      else if (isInProgress) statusClass = styles.statusInProgress;

      return (
        <span className={`${styles.statusPill} ${statusClass}`}>
          <i aria-hidden />
          {row.status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    render: (row) => <ViewAction row={row} />,
  },
];
