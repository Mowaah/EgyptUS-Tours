import type { DataTableColumn } from "@/components/dashboard/DataTable";
import type { LeadRow } from "../types";
import styles from "./InquiriesPanel.module.scss";

const sourceClass: Record<LeadRow["source"], string> = {
  B2B: styles.sourceB2b,
  Contact: styles.sourceContact,
  MICE: styles.sourceMice,
  "Plan Your Trip": styles.sourceTrip,
};

const statusClass: Record<LeadRow["status"], string> = {
  New: styles.statusNew,
  "In Progress": styles.statusProgress,
  Converted: styles.statusConverted,
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
    id: "email",
    header: "Email",
    render: (row) => row.email,
  },
  {
    id: "source",
    header: "Source",
    render: (row) => (
      <span className={`${styles.pill} ${sourceClass[row.source]}`}>
        <i aria-hidden />
        {row.source}
      </span>
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
      <span className={`${styles.pill} ${statusClass[row.status]}`}>
        <i aria-hidden />
        {row.status}
      </span>
    ),
  },
  {
    id: "agent",
    header: "Agent",
    render: (row) => row.agent,
  },
];

export const leadRowActions = () => [
  { label: "View", iconSrc: "/images/dashboard/view.svg" },
  { label: "Edit", iconSrc: "/images/dashboard/edit.svg" },
  { label: "Convert to Booking", iconSrc: "/images/dashboard/convert.svg" },
];
