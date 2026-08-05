"use client";

import { useState } from "react";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import { DataTable } from "@/components/dashboard/DataTable";
import { paymentsColumns, paymentRowActions } from "../paymentsColumns/paymentsColumns";

import { usePaymentsPanel } from "@/hooks/usePaymentsPanel";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";

interface PaymentsTableProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export default function PaymentsTable({ searchQuery = "", onClearSearch }: PaymentsTableProps) {
  const {
    data,
    loading,
    filters,
    setFilters,
    handleApply,
    handleClean,
    handleExport,
  } = usePaymentsPanel({ searchQuery });

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

  if (loading && data.length === 0) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>Loading data...</div>;
  }

  if (data.length === 0 && searchQuery) {
    return <DashboardSearchEmptyState onClearSearch={() => {
      handleClean();
      onClearSearch?.();
    }} />;
  }

  if (data.length === 0) {
    return (
      <DashboardEmptyState
        title="No Payments Yet"
        subtitle="Payment data will appear here once transactions are recorded."
      />
    );
  }

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
          onClean={() => {
            handleClean();
            onClearSearch?.();
          }}
          onApply={handleApply}
        />
      }
    >
      <DataTable
        data={data}
        columns={paymentsColumns as any}
        getRowId={(row) => row.id}
        
        rowActions={paymentRowActions(handleAction) as any}
      />
    </TablePanel>
  );
}
