"use client";

import { useMemo } from "react";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import { DataTable } from "@/components/dashboard/DataTable";
import { b2bColumns, B2BApiItem } from "./b2bColumns";
import { getAllB2BRequests } from "@/lib/adminApi";
import { useRequestPanel } from "@/hooks/useRequestPanel";

interface B2BRequestsPanelProps {
  searchQuery?: string;
}

export default function B2BRequestsPanel({ searchQuery = "" }: B2BRequestsPanelProps) {
  const {
    data,
    loading,
    sourceFilter,
    setSourceFilter,
    statusFilter,
    setStatusFilter,
    handleApply,
    handleClean,
    handleExport,
    appliedSourceFilter,
    appliedStatusFilter,
  } = useRequestPanel<B2BApiItem>({
    searchQuery,
    fetchRequestsApi: getAllB2BRequests,
    exportCsvApi: async () => {
      const { exportB2BCSV } = await import("@/lib/adminApi");
      const { buildRequestFilterParams } = await import("@/lib/utils");
      return exportB2BCSV(buildRequestFilterParams(searchQuery, appliedSourceFilter, appliedStatusFilter));
    },
    exportFilename: "b2b_proposals.csv",
  });


  const filterFields = useMemo(
    () => [
      {
        id: "source",
        label: "Source",
        value: sourceFilter || "All",
        options: ["All", "Website", "Agent"],
        onChange: (val: string) => setSourceFilter(val),
      },
      {
        id: "status",
        label: "Status",
        value: statusFilter || "All",
        options: [
          "All",
          "New",
          "In Progress",
          "Proposal Ready",
          "Proposal Sent",
          "Rejected",
          "Negotiation",
          "Pending Payment",
          "Deposit Paid",
          "Fully Paid",
          "In Trip",
          "Completed",
          "Cancelled",
          "Refund Completed",
        ],
        onChange: (val: string) => setStatusFilter(val),
      },
    ],
    [sourceFilter, statusFilter]
  );


  if (!loading && data.length === 0 && !searchQuery && !appliedSourceFilter && !appliedStatusFilter) {
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
      onExportClick={handleExport}
      toolbar={<TablePanelFilterBar fields={filterFields} onClean={handleClean} onApply={handleApply} />}
    >
      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>Loading requests...</div>
      ) : data.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>No requests found for your filters.</div>
      ) : (
        <DataTable
          data={data}
          columns={b2bColumns}
          getRowId={(row) => row.id.toString()}
          selectable
        />
      )}
    </TablePanel>
  );
}
