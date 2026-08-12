import type { DataTableColumn } from "@/components/dashboard/DataTable";
import StatusPill from "@/components/shared/StatusPill/StatusPill";
import ViewButton from "@/components/shared/ViewButton/ViewButton";
import type { CustomTripItem } from "./mockCustomTrips";
import styles from "./CustomTripRequestsPanel.module.scss";
import { getStatusVariant } from "@/components/dashboard/Requests/PlanYourTrip/planYourTripColumns";
import { useRouter } from "next/navigation";

const formatLabel = (str: string) => {
  if (!str) return '';
  if (str === 'awaiting_deposit') return '30% Pending Payment';
  return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

const ViewAction = ({ id }: { id: string }) => {
  const router = useRouter();
  return <ViewButton onClick={() => router.push(`/dashboard/requests/plan-your-trip/${id}`)} />;
};


export const customTripsColumns: DataTableColumn<CustomTripItem>[] = [
  {
    id: "ref",
    header: "Ref",
    render: (row: any) => <span className={styles.idCell}>{row.request_code}</span>,
  },
  {
    id: "destination",
    header: "Destination",
    render: (row: any) => <span>{row.destinations?.length > 0 ? row.destinations.join(", ") : "Custom"}</span>,
  },
  {
    id: "dates",
    header: "Dates",
    render: (row: any) => (
      <span className={styles.dateCell}>
        {row.start_date ? `${row.start_date} → ${row.end_date || 'TBD'}` : "Flexible"}
      </span>
    ),
  },
  {
    id: "pax",
    header: "Pax",
    render: (row: any) => <span>{`${row.adults || 0}A/${row.children || 0}C/${row.infants || 0}I`}</span>,
  },
  {
    id: "source",
    header: "Source",
    render: (row) => {
      const isWebsite = row.source?.toLowerCase() === "website";
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
          {formatLabel(row.source)}
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    render: (row: any) => (
      <StatusPill 
        label={formatLabel(row.display_status || row.status)} 
        variant={getStatusVariant(row.display_status || row.status)} 
      />
    ),
  },
  {
    id: "agent",
    header: "Agent",
    render: (row: any) => <span className={styles.agentCell}>{row.agent || 'Unassigned'}</span>,
  },
  {
    id: "actions",
    header: "",
    cellClassName: styles.actionCell,
    render: (row) => (
      <ViewAction id={row.id} />
    ),
  },
];
