"use client";

import { useMemo, useState } from "react";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import { DataTable } from "@/components/dashboard/DataTable";
import { b2bColumns, B2BApiItem } from "./b2bColumns";
import { getB2BRequests } from "@/services/admin/adminRequestsService";
import { useRequestPanel } from "@/hooks/useRequestPanel";

interface B2BRequestsPanelProps {
  searchQuery?: string;
}

export default function B2BRequestsPanel({ searchQuery = "" }: B2BRequestsPanelProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
    totalCount,
  } = useRequestPanel<B2BApiItem>({
    searchQuery,
    page,
    pageSize,
    fetchRequestsApi: getB2BRequests,
    exportCsvApi: async (params: any) => {
      const { exportB2BCSV } = await import("@/services/admin/adminRequestsService");
      return exportB2BCSV(params);
    },
    exportFilename: "b2b_proposals.csv",
    swrKey: "adminB2BRequests",
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
          serverSidePagination={true}
          totalCount={totalCount}
          pageIndex={page - 1}
          pageSize={pageSize}
          onPageChange={(p) => setPage(p + 1)}
          onPageSizeChange={setPageSize}
          defaultPageSize={10}
        isLoading={loading}
        />
      )}
    </TablePanel>
  );
}
