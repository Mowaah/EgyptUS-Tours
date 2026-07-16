import type { DataTableColumn } from "@/components/dashboard/DataTable";
import StatusPill from "@/components/shared/StatusPill/StatusPill";
import type { StatusPillVariant } from "@/components/shared/StatusPill/StatusPill";
import ViewButton from "@/components/shared/ViewButton/ViewButton";
import type { PlanYourTripItem } from "./mockPlanYourTripData";
import styles from "./PlanYourTrip.module.scss";

const getStatusVariant = (status: string): StatusPillVariant => {
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

export const planYourTripColumns: DataTableColumn<PlanYourTripItem>[] = [
  {
    id: "ref",
    header: "Ref",
    render: (row) => <span className={styles.idCell}>{row.ref}</span>,
  },
  {
    id: "destination",
    header: "Destination",
    render: (row) => <span>{row.destination}</span>,
  },
  {
    id: "dates",
    header: "Dates",
    render: (row) => <span className={styles.dateCell}>{row.dates}</span>,
  },
  {
    id: "pax",
    header: "Pax",
    render: (row) => <span>{row.pax}</span>,
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
    render: (row) => (
      <ViewButton onClick={() => console.log("View plan your trip", row.id)} />
    ),
  },
];
