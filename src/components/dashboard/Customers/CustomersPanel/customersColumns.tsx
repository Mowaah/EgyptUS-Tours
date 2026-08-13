import type { DataTableColumn } from "@/components/dashboard/DataTable";
import type { AdminCustomer } from "@/types/adminCustomerTypes";
import { COUNTRIES } from "@/data/countries";
import styles from "./CustomersPanel.module.scss";

const statusClass: Record<string, string> = {
  active: styles.statusActive,
  inactive: styles.statusInactive,
  blocked: styles.statusBlocked,
};

function formatStatus(status: string) {
  if (!status) return "";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

export const customersColumns: DataTableColumn<AdminCustomer>[] = [
  {
    id: "id",
    header: "Customer ID",
    cellClassName: styles.idCell,
    render: (row) => `CUS-${row.id}`,
  },
  {
    id: "name",
    header: "Customer",
    render: (row) => row.full_name,
  },
  {
    id: "email",
    header: "Email",
    render: (row) => row.email,
  },
  {
    id: "phone",
    header: "Phone",
    render: (row) => row.phone || "-",
  },
  {
    id: "nationality",
    header: "Nationality",
    render: (row) => {
      if (!row.nationality) return "-";
      const country = COUNTRIES.find(c => c.code.toLowerCase() === row.nationality?.trim().toLowerCase());
      return country ? country.nationality : row.nationality;
    },
  },
  {
    id: "bookings",
    header: "Bookings",
    render: (row) => (row.bookings_count ?? 0).toString(),
  },
  {
    id: "totalSpent",
    header: "Total Spent",
    render: (row) => `$${Number(row.total_spent ?? 0).toFixed(2)}`,
  },
  {
    id: "lastActivity",
    header: "Last Activity",
    render: (row) => row.last_activity_at ? new Date(row.last_activity_at).toLocaleDateString() : "-",
  },
  {
    id: "status",
    header: "Status",
    render: (row) => (
      <span className={`${styles.pill} ${statusClass[row.status?.toLowerCase()] || ""}`}>
        <i aria-hidden />
        {formatStatus(row.status)}
      </span>
    ),
  },
];

export const customerRowActions = (onAction?: (action: { label: string }, row: AdminCustomer) => void) => (row: AdminCustomer) => [
  { label: "View", iconSrc: "/images/dashboard/view.svg", onClick: (r: any) => onAction?.({ label: "View" }, r) },
  { label: "Edit", iconSrc: "/images/dashboard/edit.svg", onClick: (r: any) => onAction?.({ label: "Edit" }, r) },
  { label: "Send Email", iconSrc: "/images/dashboard/send.svg", onClick: (r: any) => onAction?.({ label: "Send Email" }, r) },
  { label: row.status === "blocked" ? "Unblock User" : "Block User", iconSrc: "/images/dashboard/block.svg", variant: "danger" as const, onClick: (r: any) => onAction?.({ label: "Block User" }, r) },
];
