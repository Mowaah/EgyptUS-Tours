"use client";

import { useState } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import { TablePanel, TablePanelFilterBar } from "@/components/dashboard/TablePanel";
import { depositsColumns, depositRowActions } from "../depositsColumns/depositsColumns";
import { useDepositsPanel } from "@/hooks/useDepositsPanel";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardFilterEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardFilterEmptyState";

interface DepositsTableProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  date_from?: string;
  date_to?: string;
}

export default function DepositsTable({ searchQuery = "", onClearSearch, date_from, date_to }: DepositsTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data,
    loading,
    filters,
    appliedFilters,
    setFilters,
    handleApply,
    handleClean,
    handleExport,
    totalCount,
  } = useDepositsPanel({ searchQuery, page, pageSize, date_from, date_to });

  const handleAction = (action: { label: string }, row: any) => {
    console.log(`Action ${action.label} on row`, row);
  };

  const handleClearAll = () => {
    handleClean();
    onClearSearch?.();
  };

  const filterFields = [
    {
      id: "service",
      label: "Service",
      value: filters.service,
      options: ["All", "Trips", "Hotels", "Transportation", "B2B", "MICE"],
      onChange: (v: string) => setFilters(prev => ({ ...prev, service: v })),
    },
    {
      id: "date",
      label: "Date",
      value: filters.date,
      options: ["All", "Last 7 Days", "This Month", "This Year"],
      onChange: (v: string) => setFilters(prev => ({ ...prev, date: v })),
    },
    {
      id: "status",
      label: "Status",
      value: filters.status,
      options: ["All", "Pending", "Overdue", "Collected"],
      onChange: (v: string) => setFilters(prev => ({ ...prev, status: v })),
    },
  ];

  return (
    <TablePanel
      title="Deposits"
      ariaLabel="Deposits tracking"
      iconSrc="/images/dashboard/sidebar/finance.svg"
      showFilters
      showExport
      onExportClick={handleExport}
      toolbar={
        <TablePanelFilterBar
          fields={filterFields}
          onClean={handleClearAll}
          onApply={handleApply}
        />
      }
    >
      <DataTable
        data={data}
        columns={depositsColumns}
        rowActions={depositRowActions(handleAction)}
        getRowId={(row) => `${row.booking_type}-${row.booking_id}`}
        serverSidePagination={true}
        totalCount={totalCount}
        pageIndex={page - 1}
        pageSize={pageSize}
        onPageChange={(p) => setPage(p + 1)}
        onPageSizeChange={setPageSize}
        defaultPageSize={10}
        isLoading={loading}
        onClearSearch={handleClearAll}
        emptyState={
          !searchQuery && Object.values(appliedFilters).every((v) => v === "All") ? (
            <DashboardEmptyState
              title="No Deposits Found"
              subtitle="Deposits will appear here once bookings are created."
              imageSrc="/images/dashboard/empty.png"
            />
          ) : !searchQuery && Object.values(appliedFilters).some((v) => v !== "All") ? (
            <DashboardFilterEmptyState
              onClearFilters={handleClearAll}
              title="No Results Found"
              subtitle="No deposits match the selected filters."
            />
          ) : undefined
        }
      />
    </TablePanel>
  );
}
