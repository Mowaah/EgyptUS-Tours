"use client";

import { useMemo, useState } from "react";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import { DataTable } from "@/components/dashboard/DataTable";
import { miceColumns } from "./miceColumns";
import { getMiceRequests } from "@/services/admin/adminRequestsService";
import { useRequestPanel } from "@/hooks/useRequestPanel";

interface MiceRequestsPanelProps {
  searchQuery?: string;
}

export default function MiceRequestsPanel({ searchQuery = "" }: MiceRequestsPanelProps) {
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
  } = useRequestPanel<any>({
    searchQuery,
    page,
    pageSize,
    fetchRequestsApi: getMiceRequests,
    exportCsvApi: async (params: any) => {
      const { exportMiceCSV } = await import("@/services/admin/adminRequestsService");
      return exportMiceCSV(params);
    },
    exportFilename: "mice_requests.csv",
    swrKey: "adminMiceRequests",
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
          "30% Pending Payment",
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

  if (loading) {
    return (
      <TablePanel
        ariaLabel="MICE requests"
        title="MICE & Corporate Request"
        iconSrc="/images/dashboard/sidebar/mice-corporate.svg"
      >
        <div style={{ padding: "40px", textAlign: "center" }}>Loading MICE Requests...</div>
      </TablePanel>
    );
  }

  if (!loading && data.length === 0 && !searchQuery && !appliedSourceFilter && !appliedStatusFilter) {
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
      onExportClick={handleExport}
      
      toolbar={<TablePanelFilterBar fields={filterFields} onClean={handleClean} onApply={handleApply} />}
    >
      <DataTable
        data={data}
        columns={miceColumns}
        getRowId={(row) => row.id}
        serverSidePagination={true}
        totalCount={totalCount}
        pageIndex={page - 1}
        pageSize={pageSize}
        onPageChange={(p) => setPage(p + 1)}
        onPageSizeChange={setPageSize}
        defaultPageSize={10}
      />
    </TablePanel>
  );
}
