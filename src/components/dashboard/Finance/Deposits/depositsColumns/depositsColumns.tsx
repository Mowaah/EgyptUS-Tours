import type { DataTableColumn, DataTableRowAction } from "@/components/dashboard/DataTable";
import styles from "./depositsColumns.module.scss";

export type DepositRow = any; // Just use any or a proper type if desired

const serviceClass: Record<string, string> = {
  trip: styles.serviceTrips,
  transport: styles.serviceTransport,
  hotel: styles.serviceHotels,
  custom_trip: styles.serviceB2B,
};

const serviceNames: Record<string, string> = {
  trip: "Trips",
  transport: "Transportation",
  hotel: "Hotels",
  custom_trip: "Custom Trip",
};

export const depositsColumns: DataTableColumn<DepositRow>[] = [
  {
    id: "bookingId",
    header: "Booking ID",
    render: (row) => `${row.booking_title || ''} #${row.booking_id}`,
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
    render: (row) => `$${row.total_price}`,
  },
  {
    id: "deposit",
    header: "Deposit (30%)",
    render: (row) => `$${row.deposit_amount}`,
  },
  {
    id: "remainingBalance",
    header: "Remaining Balance (70%)",
    render: (row) => `$${row.remaining_balance}`,
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
          {row.deposit_status ? row.deposit_status.charAt(0).toUpperCase() + row.deposit_status.slice(1).toLowerCase() : "Unknown"}
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
];

export const depositRowActions = (onAction?: (action: { label: string }, row: any) => void) => (row: DepositRow): DataTableRowAction<DepositRow>[] => [
  { label: "View Booking", iconSrc: "/images/dashboard/view.svg", onClick: (r: any) => onAction?.({ label: "View Booking" }, r) },
  { label: "Send reminder", iconSrc: "/images/dashboard/finance/payment/reminder.svg", onClick: (r: any) => onAction?.({ label: "Send reminder" }, r) },
];
