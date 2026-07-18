"use client";

import { useMemo } from "react";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import { DataTable } from "@/components/dashboard/DataTable";
import { b2bColumns } from "./b2bColumns";
import { mockB2BData } from "./mockB2BData";

export default function B2BRequestsPanel() {
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

  if (mockB2BData.length === 0) {
    return (
      <DashboardEmptyState
        title="No B2B Requests Yet"
        subtitle="B2B requests will appear here once users start submitting them"
      />
    );
  }

  return (
    <TablePanel
      ariaLabel="B2B requests"
      title="B2B Corporate Proposals"
      iconSrc="/images/dashboard/sidebar/b2b-programs.svg"
      showFilters
      showExport
      toolbar={<TablePanelFilterBar fields={filterFields} onClean={() => {}} onApply={() => {}} />}
    >
      <DataTable
        data={mockB2BData}
        columns={b2bColumns}
        getRowId={(row) => row.id}
        selectable
      />
    </TablePanel>
  );
}
