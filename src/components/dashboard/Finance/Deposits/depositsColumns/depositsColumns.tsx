import type { DataTableColumn, DataTableRowAction } from "@/components/dashboard/DataTable";
import type { DepositRow } from "../mockDeposits";
import styles from "./depositsColumns.module.scss";

const serviceClass: Record<DepositRow["service"], string> = {
  Trips: styles.serviceTrips,
  Transportation: styles.serviceTransport,
  Hotels: styles.serviceHotels,
  B2B: styles.serviceB2B,
  MICE: styles.serviceMice,
};

export const depositsColumns: DataTableColumn<DepositRow>[] = [
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
    id: "totalAmount",
    header: "Total Amount",
    render: (row) => row.totalAmount,
  },
  {
    id: "deposit",
    header: "Deposit (30%)",
    render: (row) => row.deposit,
  },
  {
    id: "remainingBalance",
    header: "Remaining Balance (70%)",
    render: (row) => row.remainingBalance,
  },
  {
    id: "dueDate",
    header: "Final Due Date",
    render: (row) => row.dueDate,
  },
  {
    id: "status",
    header: "Status",
    render: (row) => {
      const isPending = row.status === "Pending";
      return (
        <span className={`${styles.statusPill} ${isPending ? styles.statusPending : styles.statusOverdue}`}>
          <i aria-hidden />
          {row.status}
        </span>
      );
    },
  },
  {
    id: "daysOverdue",
    header: "Days Overdue",
    render: (row) => (
      <span className={row.status === "Overdue" ? styles.overdueText : ""}>
        {row.daysOverdue || "---"}
      </span>
    ),
  },
];

export const depositRowActions = (onAction?: (action: { label: string }, row: any) => void) => (row: DepositRow): DataTableRowAction<DepositRow>[] => [
  { label: "View Booking", iconSrc: "/images/dashboard/view.svg", onClick: (r: any) => onAction?.({ label: "View Booking" }, r) },
  { label: "Send reminder", iconSrc: "/images/dashboard/finance/payment/reminder.svg", onClick: (r: any) => onAction?.({ label: "Send reminder" }, r) },
];
