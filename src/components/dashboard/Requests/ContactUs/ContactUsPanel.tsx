"use client";

import { useMemo, useState } from "react";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardFilterEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardFilterEmptyState";
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
        isLoading={loading}
        onClearSearch={handleClean}
        emptyState={
          !searchQuery && !appliedStatusFilter ? (
            <DashboardEmptyState
              title="No Contact Us Messages Yet"
              subtitle="Messages from customers will appear here."
              imageSrc="/images/dashboard/empty.png"
            />
          ) : !searchQuery && appliedStatusFilter ? (
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
