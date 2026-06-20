import type { DataTableColumn, DataTableRowAction } from "@/components/dashboard/DataTable";
import type { PaymentRow } from "./mockPayments";
import styles from "./PaymentsTable.module.scss";

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
      const isPaid = row.status === "Fully Paid";
      return (
        <span className={`${styles.statusPill} ${isPaid ? styles.statusPaid : styles.statusRefunded}`}>
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
