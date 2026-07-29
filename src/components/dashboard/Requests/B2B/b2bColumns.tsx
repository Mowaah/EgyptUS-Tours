import type { DataTableColumn } from "@/components/dashboard/DataTable";
import StatusPill from "@/components/shared/StatusPill/StatusPill";
import { getStatusVariant } from "../MICE/miceColumns";
import ViewButton from "@/components/shared/ViewButton/ViewButton";
import type { B2BItem } from "./mockB2BData";
import styles from "./B2B.module.scss";

export const b2bColumns: DataTableColumn<B2BItem>[] = [
  {
    id: "ref",
    header: "Ref",
    render: (row) => <span className={styles.idCell}>{row.ref}</span>,
  },
  {
    id: "companyName",
    header: "Company",
    render: (row) => <span>{row.companyName}</span>,
  },
  {
    id: "contact",
    header: "Contact",
    render: (row) => (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontWeight: 500, color: "#344054" }}>{row.contactName}</span>
        <span style={{ fontSize: "12px", color: "#667085" }}>{row.contactEmail}</span>
      </div>
    ),
  },
  {
    id: "country",
    header: "Country",
    render: (row) => <span>{row.country}</span>,
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
    header: "Agent",
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
  return <ViewButton onClick={() => router.push(`/dashboard/requests/b2b-programs/${id}`)} />;
}
