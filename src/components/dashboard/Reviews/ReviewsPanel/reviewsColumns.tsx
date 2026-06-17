import Image from "next/image";
import type { DataTableColumn, DataTableRowAction } from "@/components/dashboard/DataTable";
import StarRating from "@/components/shared/StarRating/StarRating";
import type { ReviewRow, AdminTestimonialRow } from "../types";
import styles from "./ReviewsPanel.module.scss";
import formStyles from "@/components/dashboard/FormFields/FormFields.module.scss";

const categoryClass: Record<string, string> = {
  Trips: styles.categoryTrips,
  Transportation: styles.categoryTransport,
  Hotels: styles.categoryHotels,
  B2B: styles.categoryB2B,
  Mice: styles.categoryMice,
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
      <span className={`${styles.pill} ${styles.categoryPill} ${categoryClass[row.category]}`}>
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

export const reviewRowActions = (onAction?: (action: { label: string }, row: any) => void) => (row: ReviewRow) => {
  const baseActions: DataTableRowAction<ReviewRow>[] = [
    { label: "View", iconSrc: "/images/dashboard/view.svg", onClick: (r: any) => onAction?.({ label: "View" }, r) },
  ];

  if (row.status !== "Replied") {
    baseActions.push(
      { label: "Reply", iconSrc: "/images/dashboard/reply.svg", onClick: (r: any) => onAction?.({ label: "Reply" }, r) },
      { label: "Change Status", iconSrc: "/images/dashboard/convert.svg", onClick: (r: any) => onAction?.({ label: "Change Status" }, r) }
    );
  }

  baseActions.push(
    { label: "Delete", iconSrc: "/images/dashboard/delete.svg", variant: "danger" as const, onClick: (r: any) => onAction?.({ label: "Delete" }, r) }
  );

  return baseActions;
};

export const adminTestimonialsColumns: DataTableColumn<AdminTestimonialRow>[] = [
  {
    id: "id",
    header: "Testimonial ID",
    cellClassName: styles.idCell,
    render: (row) => row.id,
  },
  {
    id: "addedBy",
    header: "Added By",
    render: (row) => row.addedBy,
  },
  {
    id: "customer",
    header: "Customer",
    render: (row) => row.customer,
  },
  {
    id: "country",
    header: "Country",
    render: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <img
          src={`https://hatscripts.github.io/circle-flags/flags/${row.countryCode}.svg`}
          alt={row.country}
          style={{ width: "16px", height: "16px", borderRadius: "50%" }}
        />
        <span>{row.country}</span>
      </div>
    ),
  },
  {
    id: "video",
    header: "Video",
    render: (row) =>
      row.video ? (
        <span className={`${styles.pill} ${styles.statusUploaded}`}>Uploaded</span>
      ) : null,
  },
  {
    id: "category",
    header: "Category",
    render: (row) => (
      <span className={`${styles.pill} ${styles.categoryPill} ${categoryClass[row.category]}`}>
        {row.category}
      </span>
    ),
  },
  {
    id: "rating",
    header: "Rating",
    render: (row) => (
      <StarRating filled={row.rating} showValue={false} size={16} />
    ),
  },
  {
    id: "date",
    header: "Date",
    render: (row) => row.date,
  },
  {
    id: "featured",
    header: "Featured",
    render: (row) => <FeaturedToggle value={row.featured} />,
  },
];

export const adminTestimonialRowActions = (onAction?: (action: { label: string }, row: any) => void) => (row: AdminTestimonialRow) => [
  { label: "View", iconSrc: "/images/dashboard/view.svg", onClick: (r: any) => onAction?.({ label: "View" }, r) },
  { label: "Edit", iconSrc: "/images/dashboard/edit.svg", onClick: (r: any) => onAction?.({ label: "Edit" }, r) },
  { label: "Delete", iconSrc: "/images/dashboard/delete.svg", variant: "danger" as const, onClick: (r: any) => onAction?.({ label: "Delete" }, r) },
];
