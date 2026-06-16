import Image from "next/image";
import type { DataTableColumn } from "@/components/dashboard/DataTable";
import StarRating from "@/components/shared/StarRating/StarRating";
import type { ReviewRow } from "../types";
import styles from "./ReviewsPanel.module.scss";
import formStyles from "@/components/dashboard/FormFields/FormFields.module.scss";

const categoryClass: Record<ReviewRow["category"], string> = {
  Trips: styles.categoryTrips,
  Transportation: styles.categoryTransport,
  Hotels: styles.categoryHotels,
};

const statusClass: Record<ReviewRow["status"], string> = {
  Pending: styles.statusPending,
  Replied: styles.statusReplied,
};

function PendingSpinner() {
  return (
    <span className={styles.spinnerWrap} aria-hidden>
      <svg className={styles.spinnerSvg} width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25" />
        <path fill="none" d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function FeaturedToggle({ value }: { value: boolean }) {
  return (
    <label className={formStyles.switch} aria-label={value ? "Featured" : "Not featured"}>
      <input type="checkbox" defaultChecked={value} readOnly />
      <span className={formStyles.slider} />
    </label>
  );
}

export const reviewsColumns: DataTableColumn<ReviewRow>[] = [
  {
    id: "id",
    header: "Review ID",
    cellClassName: styles.idCell,
    render: (row) => row.id,
  },
  {
    id: "customer",
    header: "Customer",
    render: (row) => row.customer,
  },
  {
    id: "category",
    header: "Category",
    render: (row) => (
      <span className={`${styles.pill} ${categoryClass[row.category]}`}>
        {row.category}
      </span>
    ),
  },
  {
    id: "title",
    header: "Title",
    render: (row) => row.title,
  },
  {
    id: "rating",
    header: "Rating",
    render: (row) => (
      <StarRating filled={row.rating} showValue={false} size={18} />
    ),
  },
  {
    id: "date",
    header: "Date",
    render: (row) => row.date,
  },
  {
    id: "status",
    header: "Status",
    render: (row) => (
      <span className={`${styles.pill} ${styles.pillWithIcon} ${statusClass[row.status]}`}>
        {row.status === "Replied" ? (
          <Image
            src="/images/dashboard/active.svg"
            alt=""
            width={16}
            height={16}
            className={styles.statusIcon}
            aria-hidden
          />
        ) : (
          <PendingSpinner />
        )}
        {row.status}
      </span>
    ),
  },
  {
    id: "featured",
    header: "Featured",
    render: (row) => <FeaturedToggle value={row.featured} />,
  },
];

export const reviewRowActions = () => [
  { label: "View", iconSrc: "/images/dashboard/view.svg" },
  { label: "Reply", iconSrc: "/images/dashboard/reply.svg" },
  { label: "Change Status", iconSrc: "/images/dashboard/convert.svg" },
  { label: "Delete", iconSrc: "/images/dashboard/delete.svg", variant: "danger" as const },
];
