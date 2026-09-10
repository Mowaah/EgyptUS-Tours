"use client";

import { useState } from "react";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardFilterEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardFilterEmptyState";
import { DataTable } from "@/components/dashboard/DataTable";
import { paymentsColumns, paymentRowActions } from "../paymentsColumns/paymentsColumns";

import { usePaymentsPanel } from "@/hooks/usePaymentsPanel";

interface PaymentsTableProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export default function PaymentsTable({ searchQuery = "", onClearSearch }: PaymentsTableProps) {
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
  } = usePaymentsPanel({ searchQuery, page, pageSize });

  const filterFields = [
    {
      id: "service",
      label: "Service",
      options: ["All", "MICE", "Trips", "Hotels", "Transportation", "B2B"],
      value: filters.service,
      onChange: (v: string) => setFilters(prev => ({ ...prev, service: v })),
    },
    {
      id: "date",
      label: "Date",
      options: ["All", "Last 7 Days", "Last 30 Days", "This Month", "Last Month"],
      value: filters.date,
      onChange: (v: string) => setFilters(prev => ({ ...prev, date: v })),
    },
    {
      id: "status",
      label: "Status",
      options: ["All", "Fully Paid", "Refunded"],
      value: filters.status,
      onChange: (v: string) => setFilters(prev => ({ ...prev, status: v })),
    },
  ];

  const handleAction = (action: { label: string }, row: any) => {
    console.log("Action:", action.label, "Row:", row);
  };

  const handleClearAll = () => {
    handleClean();
    onClearSearch?.();
  };

  return (
    <TablePanel
      ariaLabel="Payments history"
      title="Payments"
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
        columns={paymentsColumns as any}
        rowActions={paymentRowActions(handleAction)}
        getRowId={(row) => row.id.toString()}
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
              title="No Payments Found"
              subtitle="Payment transactions will appear here once they are recorded."
              imageSrc="/images/dashboard/empty.png"
            />
          ) : !searchQuery && Object.values(appliedFilters).some((v) => v !== "All") ? (
            <DashboardFilterEmptyState
              onClearFilters={handleClearAll}
              title="No Results Found"
              subtitle="No payments match the selected filters."
            />
          ) : undefined
        }
      />
    </TablePanel>
  );
}
