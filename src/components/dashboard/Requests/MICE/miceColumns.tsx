import type { DataTableColumn } from "@/components/dashboard/DataTable";
import StatusPill from "@/components/shared/StatusPill/StatusPill";
import type { StatusPillVariant } from "@/components/shared/StatusPill/StatusPill";
import ViewButton from "@/components/shared/ViewButton/ViewButton";
import styles from "./MICE.module.scss";

export const formatStatusLabel = (rawStatus: string): string => {
  if (!rawStatus) return "Unknown";
  if (rawStatus === "awaiting_deposit") return "30% Pending Payment";
  if (rawStatus === "awaiting_payment") return "100% Pending Payment";
  if (rawStatus === "refunded") return "Refund Completed";
  
  return rawStatus
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};

// Export this so we can reuse it in the View request page
export const getStatusVariant = (status: string): StatusPillVariant => {
  switch (status) {
    case "New":
      return "green";
    case "In Progress":
      return "orangeDark";
    case "Proposal Ready":
      return "teal";
    case "Proposal Sent":
      return "orangeLight";
    case "Rejected":
    case "Cancelled":
      return "redSoft";
    case "Negotiation":
      return "grayDark";
    case "30% Pending Payment":
      return "pinkSoft";
    case "Deposit Paid":
      return "lightBlue";
    case "Fully Paid":
      return "purple";
    case "In Trip":
      return "magenta";
    case "Completed":
      return "blueDark";
    case "Refund Completed":
      return "darkBlue";
    default:
      return "gray";
  }
};

export const miceColumns: DataTableColumn<any>[] = [
  {
    id: "ref",
    header: "Ref",
    render: (row) => <span className={styles.idCell}>{row.request_code}</span>,
  },
  {
    id: "organizationName",
    header: "Organization Name",
    render: (row) => <span>{row.organization_name}</span>,
  },
  {
    id: "industry",
    header: "Industry",
    render: (row) => <span>{row.industry}</span>,
  },
  {
    id: "email",
    header: "Email",
    render: (row) => <span>{row.email}</span>,
  },
  {
    id: "submittedOn",
    header: "Submitted On",
    render: (row) => {
      const date = new Date(row.submitted_on);
      return (
        <span className={styles.dateCell}>
          {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} •{" "}
          {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
        </span>
      );
    },
  },
  {
    id: "source",
    header: "Source",
    render: (row) => {
      const source = row.source.toLowerCase();
      const isWebsite = source === "website";
      const displaySource = source.charAt(0).toUpperCase() + source.slice(1);
      return (
        <div className={`${styles.sourcePill} ${isWebsite ? styles.sourceWebsite : styles.sourceAgent}`}>
          <span
            className={styles.sourceIcon}
            style={{
              maskImage: `url('/images/dashboard/customers/custom/${isWebsite ? "website" : "agent"}.svg')`,
              WebkitMaskImage: `url('/images/dashboard/customers/custom/${isWebsite ? "website" : "agent"}.svg')`,
            }}
            aria-hidden
          />
          {displaySource}
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    render: (row) => {
      const displayStatus = formatStatusLabel(row.display_status);
      return (
        <StatusPill 
          label={displayStatus} 
          variant={getStatusVariant(displayStatus)} 
        />
      );
    },
  },
  {
    id: "agent",
    header: "Agent",
    render: (row) => <span className={row.assigned_to ? styles.assignedText : styles.unassignedText}>{row.assigned_to ? row.assigned_to.full_name : "Unassigned"}</span>,
  },
  {
    id: "actions",
    header: "",
    cellClassName: styles.actionCell,
    render: (row) => <ViewAction id={row.id} />,
  },
];

import { useRouter } from "next/navigation";

function ViewAction({ id }: { id: number }) {
  const router = useRouter();
  return <ViewButton onClick={() => router.push(`/dashboard/requests/mice-corporate/${id}`)} />;
}
