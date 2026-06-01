import type { DataTableColumn } from "@/components/dashboard/DataTable";
import type { BookingRow } from "./types";
import styles from "./RecentBookingsTable.module.scss";

export const bookingColumns: DataTableColumn<BookingRow>[] = [
  {
    id: "id",
    header: "ID",
    cellClassName: styles.idCell,
    render: (row) => row.id,
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
      <span className={`${styles.servicePill} ${styles[row.service.toLowerCase()]}`}>
        {row.service}
      </span>
    ),
  },
  {
    id: "destination",
    header: "Destination",
    render: (row) => row.destination,
  },
  {
    id: "date",
    header: "Date",
    render: (row) => row.date,
  },
  {
    id: "price",
    header: "Price",
    cellClassName: styles.priceCell,
    render: (row) => (
      <>
        <span className={styles.currencyIcon} aria-hidden>
          $
        </span>
        <span>{row.price.replace(/^\$\s*/, "")}</span>
      </>
    ),
  },
  {
    id: "status",
    header: "Status",
    render: (row) => (
      <span className={`${styles.statusPill} ${styles[row.status.toLowerCase()]}`}>
        {row.status}
      </span>
    ),
  },
];

export const bookingRowActions = () => [
  { label: "View details" },
  { label: "Send update" },
];
