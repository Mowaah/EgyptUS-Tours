import Image from "next/image";
import type { DataTableColumn } from "@/components/dashboard/DataTable";
import type { ArticleRow } from "../types";
import styles from "./ArticlesPanel.module.scss";

const statusClass: Record<ArticleRow["status"], string> = {
  Published: styles.statusPublished,
  Draft: styles.statusDraft,
  Scheduled: styles.statusScheduled,
};

export const articlesColumns: DataTableColumn<ArticleRow>[] = [
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

import { useRouter } from "next/navigation";

export const useArticleRowActions = (onDelete: (row: ArticleRow) => void) => {
  const router = useRouter();
  return (row: ArticleRow) => [
    { 
      label: "View", 
      iconSrc: "/images/dashboard/view.svg",
      onClick: () => router.push(`/dashboard/marketing/articles/${row.postId}`)
    },
    { 
      label: "Edit", 
      iconSrc: "/images/dashboard/edit.svg",
      onClick: () => router.push(`/dashboard/marketing/articles/${row.postId}/edit?from=list`)
    },
    { 
      label: "Delete", 
      iconSrc: "/images/dashboard/delete.svg", 
      variant: "danger" as const,
      onClick: () => onDelete(row)
    },
  ];
};
