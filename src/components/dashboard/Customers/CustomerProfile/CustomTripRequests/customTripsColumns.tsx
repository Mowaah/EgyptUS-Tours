import type { DataTableColumn } from "@/components/dashboard/DataTable";
import StatusPill from "@/components/shared/StatusPill/StatusPill";
import ViewButton from "@/components/shared/ViewButton/ViewButton";
import type { CustomTripItem } from "./mockCustomTrips";
import styles from "./CustomTripRequestsPanel.module.scss";

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Completed":
      return "blue";
    case "In Progress":
    case "Proposal Sent":
      return "orange";
    case "On Hold":
      return "pink";
    case "Negotiation":
      return "gray";
    case "Rejected":
      return "red";
    default:
      return "gray";
  }
};

export const customTripsColumns: DataTableColumn<CustomTripItem>[] = [
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
    header: "Agent",
    render: (row) => <span className={styles.agentCell}>{row.agent}</span>,
  },
  {
    id: "actions",
    header: "",
    cellClassName: styles.actionCell,
    render: (row) => (
      <ViewButton onClick={() => console.log("View custom trip", row.id)} />
    ),
  },
];
