"use client";

import { DataTable } from "@/components/dashboard/DataTable";
import { TablePanel, TablePanelFilterBar } from "@/components/dashboard/TablePanel";
import { depositsColumns, depositRowActions } from "../depositsColumns/depositsColumns";
import { useDepositsPanel } from "@/hooks/useDepositsPanel";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";

interface DepositsTableProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export default function DepositsTable({ searchQuery = "", onClearSearch }: DepositsTableProps) {
  const {
    data,
    loading,
    filters,
    setFilters,
    handleApply,
    handleClean,
    handleExport,
  } = useDepositsPanel({ searchQuery });

  const handleAction = (action: { label: string }, row: any) => {
    console.log(`Action ${action.label} on row`, row);
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

  if (!loading && data.length === 0 && !searchQuery && filters.service === "All" && filters.status === "All") {
    return (
      <DashboardEmptyState
        imageSrc="/images/dashboard/finance/payment/total_transaction.svg"
        title="No Deposits Yet"
        subtitle="There are currently no deposits tracked."
      />
    );
  }

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
          onClean={handleClean}
          onApply={handleApply}
        />
      }
    >
      {!loading && data.length === 0 && searchQuery ? (
        <DashboardSearchEmptyState
          onClearSearch={onClearSearch}
        />
      ) : (
        <DataTable
          data={data}
          columns={depositsColumns}
          rowActions={depositRowActions(handleAction)}
          
          getRowId={(row) => `${row.booking_type}-${row.booking_id}`}
        />
      )}
    </TablePanel>
  );
}
