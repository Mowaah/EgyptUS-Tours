import { useRouter } from "next/navigation";
import type { DataTableColumn } from "@/components/dashboard/DataTable";
import type { MarketingPostRow, ContentType } from "../types";
import styles from "./MarketingContentPanel.module.scss";

const statusClass: Record<MarketingPostRow["status"], string> = {
  Published: styles.statusPublished,
  Draft: styles.statusDraft,
  Scheduled: styles.statusScheduled,
};

export const getMarketingColumns = (): DataTableColumn<MarketingPostRow>[] => [
  {
    id: "id",
    header: "Post ID",
    cellClassName: styles.idCell,
    render: (row) => row.id || row.postId,
  },
  {
    id: "title",
    header: "Title",
    render: (row) => row.title,
  },
  {
    id: "category",
    header: "Category",
    render: (row) => (
      <span className={`${styles.pill} ${styles.categoryPill}`}>
        {row.category}
      </span>
    ),
  },
  {
    id: "publishDate",
    header: "Publish Date",
    render: (row) => {
      const dateStr = row.publishDate || row.date || row.published_at;
      if (!dateStr) return "-";
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
  {
    id: "views",
    header: "Views",
    render: (row) => row.views || 0,
  },
  {
    id: "status",
    header: "Status",
    render: (row) => {
      const rawStatus = row.status || "draft";
      const status = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase() as "Published" | "Draft" | "Scheduled";
      return (
        <span className={`${styles.pill} ${styles.pillWithDot} ${statusClass[status] || styles.statusDraft}`}>
          <i aria-hidden />
          {status}
        </span>
      );
    },
  },
];

export const useMarketingRowActions = (
  contentType: ContentType,
  onDelete: (row: MarketingPostRow) => void
) => {
  const router = useRouter();
  const basePath = `/dashboard/marketing/${contentType}`;

  return (row: MarketingPostRow) => [
    {
      label: "View",
      iconSrc: "/images/dashboard/view.svg",
      onClick: () => router.push(`${basePath}/${row.id || row.postId}`),
    },
    {
      label: "Edit",
      iconSrc: "/images/dashboard/edit.svg",
      onClick: () => router.push(`${basePath}/${row.id || row.postId}/edit?from=list`),
    },
    {
      label: "Delete",
      iconSrc: "/images/dashboard/delete.svg",
      variant: "danger" as const,
      onClick: () => onDelete(row),
    },
  ];
};
