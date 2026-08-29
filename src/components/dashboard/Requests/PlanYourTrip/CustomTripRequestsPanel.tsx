"use client";

import { useMemo, useState } from "react";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardFilterEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardFilterEmptyState";
import { DataTable } from "@/components/dashboard/DataTable";
import { planYourTripColumns, PlanYourTripApiItem } from "./planYourTripColumns";
import { getPlanYourTripRequests } from "@/services/admin/adminRequestsService";
import { useRequestPanel } from "@/hooks/useRequestPanel";

interface CustomTripRequestsPanelProps {
  searchQuery: string;
}

export default function CustomTripRequestsPanel({ searchQuery }: CustomTripRequestsPanelProps) {
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
  } = useRequestPanel<PlanYourTripApiItem>({
    searchQuery,
    page,
    pageSize,
    fetchRequestsApi: getPlanYourTripRequests,
    exportCsvApi: async (params: any) => {
      const { exportPlanYourTripCSV } = await import("@/services/admin/adminRequestsService");
      return exportPlanYourTripCSV(params);
    },
    exportFilename: "plan_your_trip.csv",
    swrKey: "adminPlanYourTripRequests",
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


  return (
    <TablePanel
      ariaLabel="Custom trip requests"
      title="Custom Trip Requests"
      iconSrc="/images/dashboard/sidebar/plan-your-trip.svg"
      showFilters
      showExport
      onExportClick={handleExport}
      toolbar={<TablePanelFilterBar fields={filterFields} onClean={handleClean} onApply={handleApply} />}
    >
      <DataTable
        data={data}
        columns={planYourTripColumns}
        getRowId={(row) => row.id.toString()}
        serverSidePagination={true}
        totalCount={totalCount}
        pageIndex={page - 1}
        pageSize={pageSize}
        onPageChange={(p) => setPage(p + 1)}
        onPageSizeChange={setPageSize}
        defaultPageSize={10}
        isLoading={loading}
        onClearSearch={handleClean}
        emptyState={
          !searchQuery && !appliedSourceFilter && !appliedStatusFilter ? (
            <DashboardEmptyState
              title="No Custom Trip Requests Yet"
              subtitle="Custom trip requests will appear here once users start submitting them"
              imageSrc="/images/dashboard/empty.png"
            />
          ) : !searchQuery && (appliedSourceFilter || appliedStatusFilter) ? (
              <DashboardFilterEmptyState
                onClearFilters={handleClean}
                title="No Results Found"
                subtitle="No results match the selected filters."
              />
            ) : undefined
        }
      />
    </TablePanel>
  );
}
