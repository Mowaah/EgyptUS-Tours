"use client";

import { useMemo } from "react";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import { DataTable } from "@/components/dashboard/DataTable";
import { miceColumns } from "./miceColumns";
import { mockMiceData } from "./mockMiceData";

export default function MiceRequestsPanel() {
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

  if (mockMiceData.length === 0) {
    return (
      <DashboardEmptyState
        title="No MICE & Corporate Requests Yet"
        subtitle="MICE requests will appear here once users start submitting them"
      />
    );
  }

  return (
    <TablePanel
      ariaLabel="MICE requests"
      title="MICE & Corporate Request"
      iconSrc="/images/dashboard/sidebar/mice-corporate.svg"
      showFilters
      showExport
      toolbar={<TablePanelFilterBar fields={filterFields} onClean={() => {}} onApply={() => {}} />}
    >
      <DataTable
        data={mockMiceData}
        columns={miceColumns}
        getRowId={(row) => row.id}
        selectable
      />
    </TablePanel>
  );
}
