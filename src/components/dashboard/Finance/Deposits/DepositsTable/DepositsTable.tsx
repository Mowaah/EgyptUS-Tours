"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import { TablePanel, TablePanelFilterBar } from "@/components/dashboard/TablePanel";
import { mockDeposits } from "../mockDeposits";
import { depositsColumns, depositRowActions } from "../depositsColumns/depositsColumns";

const PAGE_SIZE = 8;

export default function DepositsTable() {


  // Filter state
  const [serviceFilter, setServiceFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredData = useMemo(() => {
    return mockDeposits.filter((item) => {
      if (serviceFilter !== "All" && item.service !== serviceFilter) return false;
      if (statusFilter !== "All" && item.status !== statusFilter) return false;
      return true;
    });
  }, [serviceFilter, statusFilter]);



  const resetFilters = () => {
    setServiceFilter("All");
    setDateFilter("All");
    setStatusFilter("All");
  };

  const applyFilters = () => {
    // Apply filters logic
  };

  const handleAction = (action: { label: string }, row: any) => {
    console.log(`Action ${action.label} on row`, row);
  };

  const filterFields = [
    {
      id: "service",
      label: "Service",
      value: serviceFilter,
      options: ["All", "Trips", "Hotels", "Transportation", "B2B", "MICE"],
      onChange: setServiceFilter,
    },
    {
      id: "date",
      label: "Date",
      value: dateFilter,
      options: ["All", "Last 7 Days", "This Month", "This Year"],
      onChange: setDateFilter,
    },
    {
      id: "status",
      label: "Status",
      value: statusFilter,
      options: ["All", "Pending", "Overdue"],
      onChange: setStatusFilter,
    },
  ];

  return (
    <TablePanel
      title="Deposits"
      ariaLabel="Deposits tracking"
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
        data={filteredData}
        columns={depositsColumns}
        rowActions={depositRowActions(handleAction)}
        selectable={true}
        getRowId={(row) => row.id}
      />
    </TablePanel>
  );
}
