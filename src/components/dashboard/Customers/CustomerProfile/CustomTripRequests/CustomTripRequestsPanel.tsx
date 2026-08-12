import { useState, useMemo } from "react";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import { DataTable } from "@/components/dashboard/DataTable";
import { customTripsColumns } from "./customTripsColumns";
import { useAdminCustomerRequests } from "@/hooks/useCustomers";

export default function CustomTripRequestsPanel({ customerId }: { customerId: string }) {
  const [page, setPage] = useState(1);
  const { data: pageData, isLoading } = useAdminCustomerRequests(customerId, page);
  const data = pageData?.results || [];

  const filterFields = useMemo(
    () => [
      {
        id: "source",
        label: "Source",
        value: "All",
        options: ["All", "Website", "Agent"],
        onChange: () => {},
      },
      {
        id: "status",
        label: "Status",
        value: "All",
        options: ["All", "Completed", "In Progress", "On Hold", "Negotiation", "Rejected", "Proposal Sent"],
        onChange: () => {},
      },
    ],
    []
  );

  if (!isLoading && data.length === 0) {
    return (
      <DashboardEmptyState
        title="No Custom Trip Requests Yet"
        subtitle="Custom trip requests will appear here once users start submitting them"
      />
    );
  }

  return (
    <TablePanel
      ariaLabel="Custom trip requests"
      title="Custom Trip Requests"
      iconSrc="/images/dashboard/sidebar/plan-your-trip.svg"
      showFilters
      showExport
      toolbar={<TablePanelFilterBar fields={filterFields} onClean={() => {}} onApply={() => {}} />}
    >
      <DataTable
        data={data}
        columns={customTripsColumns as any}
        getRowId={(row: any) => row.id.toString()}
      />
    </TablePanel>
  );
}
