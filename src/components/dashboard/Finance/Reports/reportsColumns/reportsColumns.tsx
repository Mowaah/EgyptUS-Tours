import type { DataTableColumn } from "@/components/dashboard/DataTable";
import styles from "./reportsColumns.module.scss";

export type ReportRow = any;

const typeClass: Record<string, string> = {
  "Plan Your Trip": styles.typePlanYourTrip,
  "Trip": styles.typePlanYourTrip,
  "MICE": styles.typeMice,
  "B2B": styles.typeB2b,
  "Transport": styles.typeTransport,
  "Hotel": styles.typeMice,
  "Destination": styles.typeB2b,
};

const TrendIcon = ({ direction }: { direction: "up" | "down" }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {direction === "up" ? (
      <path d="M23 6l-9.5 9.5-5-5L1 18m15-12h7v7" />
    ) : (
      <path d="M23 18l-9.5-9.5-5 5L1 6m15 12h7v-7" />
    )}
  </svg>
);

export const reportsColumns: DataTableColumn<ReportRow>[] = [
  {
    id: "product",
    header: "Product",
    render: (row) => <strong style={{ color: "#374151" }}>{row.destination || row.destination_name || row.product || "Unassigned"}</strong>,
  },
  {
    id: "type",
    header: "Type",
    render: (row) => {
      const typeStr = row.type || "Destination";
      const cls = typeClass[typeStr] || styles.typeB2b;
      return (
        <span className={`${styles.typePill} ${cls}`}>
          <i aria-hidden />
          {typeStr}
        </span>
      );
    },
  },
  {
    id: "bookings",
    header: "Bookings",
    render: (row) => row.booking_count ?? row.bookings ?? 0,
  },
  {
    id: "revenue",
    header: "Revenue",
    render: (row) => row.total_revenue ? `$${row.total_revenue}` : (row.revenue || "£0.00"),
  },
  {
    id: "margin",
    header: "Margin",
    render: (row) => row.margin || "---",
  },
  {
    id: "trend",
    header: "Trend",
    render: (row) => {
      if (!row.trendValue) return "---";
      return (
        <span className={`${styles.trendBadge} ${row.trendDirection === "up" ? styles.trendUp : styles.trendDown}`}>
          {row.trendValue}
          <TrendIcon direction={row.trendDirection || "up"} />
        </span>
      );
    },
  },
];
