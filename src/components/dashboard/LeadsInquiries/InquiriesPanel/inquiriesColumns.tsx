import type { DataTableColumn } from "@/components/dashboard/DataTable";
import type { LeadRow } from "../types";
import styles from "./InquiriesPanel.module.scss";

import Image from "next/image";

const statusClass: Record<string, string> = {
  New: styles.statusNew,
  Closed: styles.statusClosed,
  Qualified: styles.statusQualified,
  Converted: styles.statusConverted,
  Contacted: styles.statusContacted,
};

export const inquiriesColumns: DataTableColumn<LeadRow>[] = [
  {
    id: "id",
    header: "Lead ID",
    cellClassName: styles.idCell,
    render: (row) => row.id,
  },
  {
    id: "name",
    header: "Name",
    render: (row) => row.name,
  },
  {
    id: "phone",
    header: "Phone Number",
    render: (row) => row.phone,
  },
  {
    id: "email",
    header: "Email",
    render: (row) => row.email,
  },
  {
    id: "date",
    header: "Date",
    render: (row) => row.date,
  },
  {
    id: "source",
    header: "Source",
    render: (row) => row.source,
  },
  {
    id: "status",
    header: "Status",
    render: (row) => (
      <span className={`${styles.pill} ${statusClass[row.status] || ""}`}>
        <i aria-hidden />
        {row.status}
      </span>
    ),
  },
  {
    id: "agent",
    header: "Assigned",
    render: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {row.agent !== "Unassigned" && (
          <Image
            src={row.agent === "Sara M." ? "/images/dashboard/sara.jpg" : "/images/dashboard/sidebar/user-management.svg"}
            alt={row.agent}
            width={39}
            height={39}
            style={{ 
              borderRadius: "32px", 
              objectFit: "cover",
              ...(row.agent !== "Sara M." && { background: "#F0F1F3", padding: "8px" })
            }}
          />
        )}
        <span style={{ color: "#4B5563", fontSize: "14px", fontWeight: 400 }}>{row.agent}</span>
      </div>
    ),
  },
];

export const leadRowActions = (onAction?: (action: string, row: LeadRow) => void): any[] => [
  { label: "View", iconSrc: "/images/dashboard/view.svg", onClick: (row: LeadRow) => { if (onAction) onAction("View", row); } },
  { label: "Edit", iconSrc: "/images/dashboard/edit.svg", onClick: (row: LeadRow) => { if (onAction) onAction("Edit", row); } },
  { label: "Assign to Lead", iconSrc: "/images/dashboard/assign.svg", onClick: (row: LeadRow) => { if (onAction) onAction("Assign to Lead", row); } },
];
