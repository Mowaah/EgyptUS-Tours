import type { DataTableColumn } from "@/components/dashboard/DataTable";
import type { CustomerRow } from "../types";
import styles from "./CustomersPanel.module.scss";

const statusClass: Record<CustomerRow["status"], string> = {
  Active: styles.statusActive,
  Inactive: styles.statusInactive,
  Blocked: styles.statusBlocked,
};

export const customersColumns: DataTableColumn<CustomerRow>[] = [
  {
    id: "id",
    header: "Customer ID",
    cellClassName: styles.idCell,
    render: (row) => row.id,
  },
  {
    id: "name",
    header: "Customer",
    render: (row) => row.name,
  },
  {
    id: "email",
    header: "Email",
    render: (row) => row.email,
  },
  {
    id: "phone",
    header: "Phone",
    render: (row) => row.phone,
  },
  {
    id: "nationality",
    header: "Nationality",
    render: (row) => row.nationality,
  },
  {
    id: "bookings",
    header: "Bookings",
    render: (row) => row.bookings,
  },
  {
    id: "totalSpent",
    header: "Total Spent",
    render: (row) => row.totalSpent,
  },
  {
    id: "lastActivity",
    header: "Last Activity",
    render: (row) => row.lastActivity,
  },
  {
    id: "status",
    header: "Status",
    render: (row) => (
      <span className={`${styles.pill} ${statusClass[row.status]}`}>
        <i aria-hidden />
        {row.status}
      </span>
    ),
  },
];

export const customerRowActions = (onAction?: (action: { label: string }, row: any) => void) => (row: CustomerRow) => [
  { label: "View", iconSrc: "/images/dashboard/view.svg", onClick: (r: any) => onAction?.({ label: "View" }, r) },
  { label: "Edit", iconSrc: "/images/dashboard/edit.svg", onClick: (r: any) => onAction?.({ label: "Edit" }, r) },
  { label: "Send Email", iconSrc: "/images/dashboard/send.svg", onClick: (r: any) => onAction?.({ label: "Send Email" }, r) },
  { label: "Block User", iconSrc: "/images/dashboard/block.svg", variant: "danger" as const, onClick: (r: any) => onAction?.({ label: "Block User" }, r) },
];
