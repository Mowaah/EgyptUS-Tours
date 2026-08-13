import Image from "next/image";
import type { DataTableColumn } from "@/components/dashboard/DataTable";
import type { TeamType } from "../types";
import type { AdminLeadImportBatch } from "@/types/adminLeadTypes";
import styles from "./ImportLeadsPanel.module.scss";

const teamClass: Record<TeamType, string> = {
  Operations: styles.teamOperations,
  Sales: styles.teamSales,
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const getImageUrl = (path?: string) => {
  if (!path) return "/images/dashboard/sidebar/user-management.svg";
  if (path.startsWith("http")) return path;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  return `${apiUrl}${path}`;
};

export const importLeadsColumns: DataTableColumn<AdminLeadImportBatch>[] = [
  {
    id: "batchId",
    header: "Batch ID",
    cellClassName: styles.idCell,
    render: (row) => row.batch_code,
  },
  {
    id: "importDate",
    header: "Import Date",
    render: (row) => new Date(row.import_date).toLocaleDateString(),
  },
  {
    id: "importedBy",
    header: "Imported By",
    render: (row) => (
      <div className={styles.importedBy}>
        <Image
          src={getImageUrl(row.imported_by?.profile_picture)}
          alt={row.imported_by?.full_name || "Unknown"}
          width={39}
          height={39}
          style={{
            borderRadius: "32px",
            objectFit: "cover",
            background: row.imported_by?.profile_picture ? "transparent" : "#F0F1F3",
            padding: row.imported_by?.profile_picture ? "0px" : "8px"
          }}
        />
        <span className={styles.name}>{row.imported_by?.full_name || "Unknown"}</span>
      </div>
    ),
  },
  {
    id: "totalLeads",
    header: "Total Leads",
    render: (row) => row.total_leads,
  },
  {
    id: "assigned",
    header: "Assigned",
    render: (row) => row.assigned_count,
  },
  {
    id: "unassigned",
    header: "Unassigned",
    render: (row) => row.unassigned_count ?? "-",
  },
  {
    id: "assignedTeam",
    header: "Assigned Team",
    render: (row) => (
      <div className={styles.teamPills}>
        {row.assigned_teams?.map((team) => {
          const label = capitalize(team);
          return (
            <span key={team} className={`${styles.pill} ${teamClass[label as TeamType] ?? ""}`}>
              <i aria-hidden />
              {label}
            </span>
          );
        })}
      </div>
    ),
  },
];

import type { DataTableRowAction } from "@/components/dashboard/DataTable";

export const importRowActions = (
  handlers?: {
    onView?: (row: AdminLeadImportBatch) => void;
    onReassign?: (row: AdminLeadImportBatch) => void;
    onDelete?: (row: AdminLeadImportBatch) => void;
  }
): DataTableRowAction<AdminLeadImportBatch>[] => [
  { 
    label: "View", 
    iconSrc: "/images/dashboard/view.svg",
    onClick: handlers?.onView 
  },
  { 
    label: "Reassign Leads", 
    iconSrc: "/images/dashboard/assign.svg",
    onClick: handlers?.onReassign 
  },
  { 
    label: "Delete Batch", 
    iconSrc: "/images/dashboard/delete.svg", 
    variant: "danger",
    onClick: handlers?.onDelete
  },
];
