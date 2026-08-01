import type { DataTableColumn, DataTableRowAction } from "@/components/dashboard/DataTable";
import styles from "../PaymentsTable/PaymentsTable.module.scss";

export interface PaymentRow {
  id: string;
  bookingId: string;
  customer: string;
  service: string;
  dates: string;
  method: string;
  status: string;
}

const serviceClass: Record<PaymentRow["service"], string> = {
  Trips: styles.serviceTrips,
  Transportation: styles.serviceTransport,
  Hotels: styles.serviceHotels,
  B2B: styles.serviceB2B,
  MICE: styles.serviceMice,
};

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
];

export const paymentRowActions = (onAction?: (action: { label: string }, row: any) => void) => (row: PaymentRow): DataTableRowAction<PaymentRow>[] => [
  { label: "View Booking", iconSrc: "/images/dashboard/view.svg", onClick: (r: any) => onAction?.({ label: "View Booking" }, r) },
  { label: "Download Receipt", iconSrc: "/images/dashboard/finance/payment/export.svg", onClick: (r: any) => onAction?.({ label: "Download Receipt" }, r) },
];
