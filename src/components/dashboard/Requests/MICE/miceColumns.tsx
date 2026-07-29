import type { DataTableColumn } from "@/components/dashboard/DataTable";
import StatusPill from "@/components/shared/StatusPill/StatusPill";
import type { StatusPillVariant } from "@/components/shared/StatusPill/StatusPill";
import ViewButton from "@/components/shared/ViewButton/ViewButton";
import type { MiceItem } from "./mockMiceData";
import styles from "./MICE.module.scss";

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

export const miceColumns: DataTableColumn<MiceItem>[] = [
  {
    id: "ref",
    header: "Ref",
    render: (row) => <span className={styles.idCell}>{row.ref}</span>,
  },
  {
    id: "organizationName",
    header: "Organization Name",
    render: (row) => <span>{row.organizationName}</span>,
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
    render: (row) => <span className={styles.dateCell}>{row.submittedOn}</span>,
  },
  {
    id: "source",
    header: "Source",
    render: (row) => {
      const isWebsite = row.source === "Website";
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
          {row.source}
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    render: (row) => (
      <StatusPill 
        label={row.status} 
        variant={getStatusVariant(row.status)} 
      />
    ),
  },
  {
    id: "agent",
    header: "Assigned",
    render: (row) => <span className={styles.agentCell}>{row.agent}</span>,
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
