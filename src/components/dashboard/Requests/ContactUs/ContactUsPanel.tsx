"use client";

import { useMemo, useState } from "react";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import { DataTable } from "@/components/dashboard/DataTable";
import { contactUsColumns } from "./contactUsColumns";
import { getAllContactUsRequests, exportContactUsCSV } from "@/lib/adminApi";
import { useRequestPanel } from "@/hooks/useRequestPanel";

interface ContactUsPanelProps {
  searchQuery?: string;
}

export default function ContactUsPanel({ searchQuery = "" }: ContactUsPanelProps) {
  const {
    data,
    loading,
    statusFilter,
    setStatusFilter,
    handleApply,
    handleClean,
    handleExport,
    appliedStatusFilter,
  } = useRequestPanel<any>({
    searchQuery,
    fetchRequestsApi: getAllContactUsRequests,
    exportCsvApi: exportContactUsCSV,
    exportFilename: "contact_us.csv",
  });
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(true);

  const filterFields = useMemo(
    () => [
      {
        id: "status",
        label: "Status",
        value: statusFilter || "All",
        options: [
          "All",
          "New",
          "Replied",
          "Closed",
        ],
        onChange: (val: string) => setStatusFilter(val),
      },
    ],
    [statusFilter]
  );

  if (loading) {
    return (
      <TablePanel
        ariaLabel="Contact Us messages"
        title="Contact Us"
        iconSrc="/images/dashboard/sidebar/contact-us.svg"
      >
        <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
          Loading requests...
        </div>
      </TablePanel>
    );
  }

  if (data.length === 0 && !searchQuery && !appliedStatusFilter) {
    return (
      <DashboardEmptyState
        title="No Contact Us Messages Yet"
        subtitle="Messages from customers will appear here."
      />
    );
  }

  return (
    <TablePanel
      ariaLabel="Contact Us messages"
      title="Contact Us"
      iconSrc="/images/dashboard/sidebar/contact-us.svg"
      showFilters
      showExport
      onExportClick={handleExport}
      onFilterClick={() => setIsFilterBarOpen((prev) => !prev)}
      toolbar={isFilterBarOpen ? <TablePanelFilterBar fields={filterFields} onClean={handleClean} onApply={handleApply} /> : undefined}
    >
      {data.length > 0 ? (
        <DataTable
          data={data}
          columns={contactUsColumns}
          getRowId={(row) => row.id}
          selectable
        />
      ) : (
        <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
          No requests found matching your filters.
        </div>
      )}
    </TablePanel>
  );
}
