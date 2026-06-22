"use client";

import { useState } from "react";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import { DataTable } from "@/components/dashboard/DataTable";
import { paymentsColumns, paymentRowActions } from "../paymentsColumns/paymentsColumns";
import { mockPayments } from "../mockPayments";

export default function PaymentsTable() {
  const [filters, setFilters] = useState({
    service: "All",
    date: "All",
    status: "All",
  });

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

  const resetFilters = () => {
    setFilters({
      service: "All",
      date: "All",
      status: "All",
    });
  };

  const applyFilters = () => {
    // Apply filters logic
  };

  const handleAction = (action: { label: string }, row: any) => {
    console.log("Action:", action.label, "Row:", row);
  };

  if (mockPayments.length === 0) {
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
      toolbar={
        <TablePanelFilterBar
          fields={filterFields}
          onClean={resetFilters}
          onApply={applyFilters}
        />
      }
    >
      <DataTable
        data={mockPayments}
        columns={paymentsColumns}
        getRowId={(row) => row.id}
        selectable
        rowActions={paymentRowActions(handleAction)}
      />
    </TablePanel>
  );
}
