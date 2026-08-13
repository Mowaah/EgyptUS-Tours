import type { DataTableColumn } from "@/components/dashboard/DataTable";
import type { AdminLead } from "@/types/adminLeadTypes";
import styles from "./InquiriesPanel.module.scss";

import Image from "next/image";

const statusClass: Record<string, string> = {
  New: styles.statusNew,
  Closed: styles.statusClosed,
  Qualified: styles.statusQualified,
  Converted: styles.statusConverted,
  Contacted: styles.statusContacted,
};

const getImageUrl = (path?: string) => {
  if (!path) return "/images/dashboard/sidebar/user-management.svg";
  if (path.startsWith("http")) return path;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  return `${apiUrl}${path}`;
};

export const inquiriesColumns: DataTableColumn<AdminLead>[] = [
  {
    id: "display_id",
    header: "Lead ID",
    cellClassName: styles.idCell,
    render: (row) => row.display_id,
  },
  {
    id: "full_name",
    header: "Name",
    render: (row) => row.full_name,
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
    id: "created_at",
    header: "Date",
    render: (row) => {
      const date = new Date(row.created_at);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    },
  },
  {
    id: "source",
    header: "Source",
    render: (row) => {
      let formattedSource = (row.source || "").replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      if (formattedSource.toLowerCase() === "whatsapp") formattedSource = "WhatsApp";
      return formattedSource;
    },
  },
  {
    id: "status",
    header: "Status",
    render: (row) => {
      const formattedStatus = (row.status || "").charAt(0).toUpperCase() + (row.status || "").slice(1).toLowerCase();
      return (
        <span className={`${styles.pill} ${statusClass[formattedStatus] || ""}`}>
          <i aria-hidden />
          {formattedStatus}
        </span>
      );
    },
  },
  {
    id: "assigned_to",
    header: "Assigned",
    render: (row) => {
      const agent = row.assigned_to?.full_name || "Unassigned";
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {agent !== "Unassigned" && (
            <Image
              src={getImageUrl(row.assigned_to?.profile_picture)}
              alt={agent}
              width={39}
              height={39}
              style={{ 
                borderRadius: "32px", 
                objectFit: "cover",
                background: row.assigned_to?.profile_picture ? "transparent" : "#F0F1F3",
                padding: row.assigned_to?.profile_picture ? "0px" : "8px"
              }}
            />
          )}
          <span style={{ color: "#4B5563", fontSize: "14px", fontWeight: 400 }}>{agent}</span>
        </div>
      );
    },
  },
];

export const leadRowActions = (onAction?: (action: string, row: AdminLead) => void): any[] => [
  { label: "View", iconSrc: "/images/dashboard/view.svg", onClick: (row: AdminLead) => { if (onAction) onAction("View", row); } },
  { label: "Edit", iconSrc: "/images/dashboard/edit.svg", onClick: (row: AdminLead) => { if (onAction) onAction("Edit", row); } },
  { label: "Assign to Lead", iconSrc: "/images/dashboard/assign.svg", onClick: (row: AdminLead) => { if (onAction) onAction("Assign to Lead", row); } },
];
