import type { DataTableColumn } from "@/components/dashboard/DataTable";
import type { ReportRow } from "../mockReports";
import styles from "./reportsColumns.module.scss";

const typeClass: Record<ReportRow["type"], string> = {
  "Plan Your Trip": styles.typePlanYourTrip,
  MICE: styles.typeMice,
  B2B: styles.typeB2b,
  Transport: styles.typeTransport,
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
    render: (row) => <strong style={{ color: "#374151" }}>{row.product}</strong>,
  },
  {
    id: "type",
    header: "Type",
    render: (row) => (
      <span className={`${styles.typePill} ${typeClass[row.type]}`}>
        <i aria-hidden />
        {row.type}
      </span>
    ),
  },
  {
    id: "bookings",
    header: "Bookings",
    render: (row) => row.bookings,
  },
  {
    id: "revenue",
    header: "Revenue",
    render: (row) => row.revenue,
  },
  {
    id: "margin",
    header: "Margin",
    render: (row) => row.margin,
  },
  {
    id: "trend",
    header: "Trend",
    render: (row) => (
      <span className={`${styles.trendBadge} ${row.trendDirection === "up" ? styles.trendUp : styles.trendDown}`}>
        {row.trendValue}
        <TrendIcon direction={row.trendDirection} />
      </span>
    ),
  },
];
