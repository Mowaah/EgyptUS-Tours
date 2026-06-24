import Image from "next/image";
import type { DataTableColumn } from "@/components/dashboard/DataTable";
import type { ImportLeadRow, TeamType } from "../types";
import styles from "./ImportLeadsPanel.module.scss";

const teamClass: Record<TeamType, string> = {
  Operations: styles.teamOperations,
  Sales: styles.teamSales,
};

export const importLeadsColumns: DataTableColumn<ImportLeadRow>[] = [
  {
    id: "batchId",
    header: "Batch ID",
    cellClassName: styles.idCell,
    render: (row) => row.batchId,
  },
  {
    id: "importDate",
    header: "Import Date",
    render: (row) => row.importDate,
  },
  {
    id: "importedBy",
    header: "Imported By",
    render: (row) => (
      <div className={styles.importedBy}>
        <Image
          src={row.importedBy === "Sara M." ? "/images/dashboard/sara.jpg" : "/images/dashboard/sidebar/user-management.svg"}
          alt={row.importedBy}
          width={39}
          height={39}
          style={{
            borderRadius: "32px",
            objectFit: "cover",
            ...(row.importedBy !== "Sara M." && { background: "#F0F1F3", padding: "8px" })
          }}
        />
        <span>{row.importedBy}</span>
      </div>
    ),
  },
  {
    id: "totalLeads",
    header: "Total Leads",
    render: (row) => row.totalLeads,
  },
  {
    id: "assigned",
    header: "Assigned",
    render: (row) => row.assigned,
  },
  {
    id: "unassigned",
    header: "Unassigned",
    render: (row) => row.unassigned ?? "-",
  },
  {
    id: "assignedTeam",
    header: "Assigned Team",
    render: (row) => (
      <div className={styles.teamPills}>
        {row.assignedTeam.map((team) => (
          <span key={team} className={`${styles.pill} ${teamClass[team]}`}>
            <i aria-hidden />
            {team}
          </span>
        ))}
      </div>
    ),
  },
];

import type { DataTableRowAction } from "@/components/dashboard/DataTable";

export const importRowActions = (
  handlers?: {
    onView?: (row: ImportLeadRow) => void;
    onReassign?: (row: ImportLeadRow) => void;
    onDelete?: (row: ImportLeadRow) => void;
  }
): DataTableRowAction<ImportLeadRow>[] => [
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
