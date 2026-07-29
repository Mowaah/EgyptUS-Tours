import type { DataTableColumn } from "@/components/dashboard/DataTable";
import StatusPill from "@/components/shared/StatusPill/StatusPill";
import type { StatusPillVariant } from "@/components/shared/StatusPill/StatusPill";
import ViewButton from "@/components/shared/ViewButton/ViewButton";
import styles from "./PlanYourTrip.module.scss";

export interface PlanYourTripApiItem {
  id: number;
  request_code: string;
  full_name: string;
  destination_label: string;
  start_date: string | null;
  end_date: string | null;
  pax_label: string;
  source: string;
  display_status: string;
  assigned_to: { id: number; full_name: string } | null;
  created_at: string;
}

export const getStatusVariant = (status: string): StatusPillVariant => {
  const s = status.toLowerCase().replace(/_/g, " ");
  if (s.includes("new")) return "green";
  if (s.includes("in progress")) return "orangeDark";
  if (s.includes("proposal ready")) return "teal";
  if (s.includes("proposal sent")) return "orangeLight";
  if (s.includes("rejected") || s.includes("cancelled")) return "redSoft";
  if (s.includes("negotiation")) return "grayDark";
  if (s.includes("awaiting")) return "pinkSoft";
  if (s.includes("deposit paid")) return "lightBlue";
  if (s.includes("fully paid")) return "purple";
  if (s.includes("in trip")) return "magenta";
  if (s.includes("completed")) return "blueDark";
  if (s.includes("refund")) return "darkBlue";
  return "gray";
};

function formatDateRange(start: string | null, end: string | null) {
  if (!start && !end) return "TBD";
  return `${start || "?"} -> ${end || "?"}`;
}

export const planYourTripColumns: DataTableColumn<PlanYourTripApiItem>[] = [
  {
    id: "ref",
    header: "Ref",
    render: (row) => <span className={styles.idCell}>{row.request_code}</span>,
  },
  {
    id: "destination",
    header: "Destination",
    render: (row) => <span>{row.destination_label}</span>,
  },
  {
    id: "dates",
    header: "Dates",
    render: (row) => <span className={styles.dateCell}>{formatDateRange(row.start_date, row.end_date)}</span>,
  },
  {
    id: "pax",
    header: "Pax",
    render: (row) => <span>{row.pax_label}</span>,
  },
  {
    id: "submittedOn",
    header: "Submitted On",
    render: (row) => {
      const date = new Date(row.created_at);
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
      const formattedStatus = row.display_status
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

      return (
        <StatusPill 
          label={formattedStatus} 
          variant={getStatusVariant(row.display_status)} 
        />
      );
    },
  },
  {
    id: "agent",
    header: "Assigned",
    render: (row) => <span className={styles.agentCell}>{row.assigned_to ? row.assigned_to.full_name : "Unassigned"}</span>,
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
  return <ViewButton onClick={() => router.push(`/dashboard/requests/plan-your-trip/${id}`)} />;
}
