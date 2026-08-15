"use client";

import { useMemo, useState } from "react";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import { DataTable } from "@/components/dashboard/DataTable";
import { contactUsColumns } from "./contactUsColumns";
import { getContactUsRequests, exportContactUsCSV } from "@/services/admin/adminRequestsService";
import { useRequestPanel } from "@/hooks/useRequestPanel";

interface ContactUsPanelProps {
  searchQuery?: string;
}

export default function ContactUsPanel({ searchQuery = "" }: ContactUsPanelProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data,
    loading,
    statusFilter,
    setStatusFilter,
    handleApply,
    handleClean,
    handleExport,
    appliedStatusFilter,
    totalCount,
  } = useRequestPanel<any>({
    searchQuery,
    page,
    pageSize,
    fetchRequestsApi: getContactUsRequests,
    exportCsvApi: exportContactUsCSV,
    exportFilename: "contact_us.csv",
    swrKey: "adminContactUsRequests",
  });
  

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
      
      toolbar={<TablePanelFilterBar fields={filterFields} onClean={handleClean} onApply={handleApply} />}
    >
      {data.length > 0 ? (
        <DataTable
          data={data}
          columns={contactUsColumns}
          getRowId={(row) => row.id}
          serverSidePagination={true}
          totalCount={totalCount}
          pageIndex={page - 1}
          pageSize={pageSize}
          onPageChange={(p) => setPage(p + 1)}
          onPageSizeChange={setPageSize}
          defaultPageSize={10}
        />
      ) : (
        <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
          No requests found matching your filters.
        </div>
      )}
    </TablePanel>
  );
}
