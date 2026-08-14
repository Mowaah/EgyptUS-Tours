import { ReactNode } from "react";
import Link from "next/link";
import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import DataTable from "@/components/dashboard/DataTable/DataTable";
import ViewButton from "@/components/shared/ViewButton/ViewButton";
import StatusPill from "@/components/shared/StatusPill/StatusPill";
import styles from "./MiceBookingsDetail.module.scss";
import type { MiceProposal } from "@/services/admin/adminReportsService";
import { getStatusVariant, formatStatusLabel } from "@/components/dashboard/Requests/MICE/miceColumns";

interface MiceBookingsDetailProps {
  proposals?: MiceProposal[];
  actions?: ReactNode;
}

export default function MiceBookingsDetail({ proposals = [], actions }: MiceBookingsDetailProps) {
  const columns = [
    {
      id: "organization",
      header: "Organization",
      render: (row: MiceProposal) => <span className={styles.cellTextBold}>{row.organization_name || "N/A"}</span>,
    },
    {
      id: "contact",
      header: "Contact Person",
      render: (row: MiceProposal) => <span className={styles.cellText}>{row.contact_person}</span>,
    },
    {
      id: "city",
      header: "City",
      render: (row: MiceProposal) => <span className={styles.cellText}>{row.preferred_city}</span>,
    },
    {
      id: "dates",
      header: "Dates",
      render: (row: MiceProposal) => (
        <span className={styles.cellText}>
          {row.start_date ? row.start_date.slice(0, 10) : "TBD"}
        </span>
      ),
    },
    {
      id: "type",
      header: "Event Type",
      render: (row: MiceProposal) => <span className={styles.cellText}>{row.event_type}</span>,
    },
    {
      id: "status",
      header: "Status",
      render: (row: MiceProposal) => {
        const rawStatus = row.display_status || row.status;
        const formattedStatus = formatStatusLabel(rawStatus);
          
        return <StatusPill label={formattedStatus} variant={getStatusVariant(formattedStatus)} />;
      },
    },
    {
      id: "budget",
      header: "Est. Budget",
      render: (row: MiceProposal) => (
        <span className={styles.cellTextBold}>
          {row.estimated_budget_range}
        </span>
      ),
    },
    {
      id: "action",
      header: "Action",
      render: (row: MiceProposal) => (
        <Link href={`/dashboard/requests/mice-corporate/${row.id}`}>
          <ViewButton />
        </Link>
      ),
    },
  ];

  return (
    <article className={parentStyles.chartCard}>
      <PanelHeader
        icon="reports/mice_booking" 
        title="MICE Proposals Detail"
        actions={actions}
      />
      
      <div className={styles.tableWrapper}>
        <DataTable
          data={proposals}
          columns={columns}
          getRowId={(row) => row.id.toString()}
          defaultPageSize={5}
          pageSizeOptions={[5, 10, 15]}
        />
      </div>
    </article>
  );
}
