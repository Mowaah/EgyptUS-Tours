import type { DataTableColumn } from "@/components/dashboard/DataTable";
import type { BlogRow } from "./types";
import styles from "./BlogsPanel.module.scss";

const statusClass: Record<BlogRow["status"], string> = {
  Published: styles.statusPublished,
  Draft: styles.statusDraft,
  Scheduled: styles.statusScheduled,
};

export const blogsColumns: DataTableColumn<BlogRow>[] = [
  {
    id: "postId",
    header: "Post ID",
    cellClassName: styles.idCell,
    render: (row) => row.postId,
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
    render: (row) => row.publishDate,
  },
  {
    id: "views",
    header: "Views",
    render: (row) => row.views,
  },
  {
    id: "status",
    header: "Status",
    render: (row) => (
      <span className={`${styles.pill} ${styles.pillWithDot} ${statusClass[row.status]}`}>
        <i aria-hidden />
        {row.status}
      </span>
    ),
  },
];

export const blogRowActions = () => [
  { label: "View", iconSrc: "/images/dashboard/view.svg" },
  { label: "Edit", iconSrc: "/images/dashboard/edit.svg" },
  { label: "Delete", iconSrc: "/images/dashboard/delete.svg", variant: "danger" as const },
];
