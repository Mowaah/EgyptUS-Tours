import type { DataTableColumn } from "@/components/dashboard/DataTable";
import StatusPill from "@/components/shared/StatusPill/StatusPill";
import { getStatusVariant } from "../PlanYourTrip/planYourTripColumns";
import ViewButton from "@/components/shared/ViewButton/ViewButton";
import styles from "./B2B.module.scss";

export interface B2BApiItem {
  id: number;
  request_code: string;
  company_name: string;
  country: string;
  contact_person: string;
  email: string;
  phone: string;
  source: string;
  display_status: string;
  assigned_to: { id: number; full_name: string } | null;
  created_at: string;
}

export const b2bColumns: DataTableColumn<B2BApiItem>[] = [
  {
    id: "ref",
    header: "Ref",
    render: (row) => <span className={styles.idCell}>{row.request_code}</span>,
  },
  {
    id: "companyName",
    header: "Company",
    render: (row) => <span>{row.company_name}</span>,
  },
  {
    id: "contact",
    header: "Contact",
    render: (row) => (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontWeight: 500, color: "#344054" }}>{row.contact_person}</span>
        <span style={{ fontSize: "12px", color: "#667085" }}>{row.email}</span>
      </div>
    ),
  },
  {
    id: "country",
    header: "Country",
    render: (row) => <span>{row.country || "-"}</span>,
  },
  {
    id: "date",
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
      const source = row.source ? row.source.toLowerCase() : "website";
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
      const displayStatus = row.display_status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
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
    render: (row) => (
      <span className={row.assigned_to ? styles.assignedText : styles.unassignedText}>
        {row.assigned_to ? row.assigned_to.full_name : "Unassigned"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    render: (row) => <ViewAction id={row.id} />,
  },
];

import { useRouter } from "next/navigation";

function ViewAction({ id }: { id: number }) {
  const router = useRouter();
  return <ViewButton onClick={() => router.push(`/dashboard/requests/b2b-programs/${id}`)} />;
}
