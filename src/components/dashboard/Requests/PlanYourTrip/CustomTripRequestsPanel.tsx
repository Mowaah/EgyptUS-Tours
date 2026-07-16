"use client";

import { useMemo } from "react";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import { DataTable } from "@/components/dashboard/DataTable";
import { planYourTripColumns } from "./planYourTripColumns";
import { mockPlanYourTrips } from "./mockPlanYourTripData";

export default function CustomTripRequestsPanel() {
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
        options: [
          "All",
          "New",
          "In Progress",
          "Proposal Ready",
          "Proposal Sent",
          "Rejected",
          "Negotiation",
          "30% Pending Payment",
          "Deposit Paid",
          "Fully Paid",
          "In Trip",
          "Completed",
          "Cancelled",
          "Refund Completed",
        ],
        onChange: () => {},
      },
    ],
    []
  );

  if (mockPlanYourTrips.length === 0) {
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
        data={mockPlanYourTrips}
        columns={planYourTripColumns}
        getRowId={(row) => row.id}
        selectable
      />
    </TablePanel>
  );
}
