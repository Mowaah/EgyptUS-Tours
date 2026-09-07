"use client";

import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardFilterEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardFilterEmptyState";
import { DataTable } from "@/components/dashboard/DataTable";
import { customTripsColumns } from "./customTripsColumns";
import { useCustomTripRequestsPanel } from "./useCustomTripRequestsPanel";

export default function CustomTripRequestsPanel({ customerId }: { customerId: string }) {
  const {
    data,
    filteredData,
    isLoading,
    hasActiveFilters,
    filterFields,
    handleApply,
    handleClean,
    handleExport,
  } = useCustomTripRequestsPanel(customerId);

  if (!isLoading && data.length === 0 && !hasActiveFilters) {
    return (
      <DashboardEmptyState
        title="No Custom Trip Requests Yet"
        subtitle="Custom trip requests will appear here once users start submitting them"
      />
    );
  }

  return (
    <TablePanel
      ariaLabel="Custom trip requests"
      title="Custom Trip Requests"
      iconSrc="/images/dashboard/sidebar/plan-your-trip.svg"
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
      <DataTable
        data={filteredData}
        columns={customTripsColumns as any}
        getRowId={(row: any) => row.id?.toString() || Math.random().toString()}
        isLoading={isLoading}
        emptyState={
          hasActiveFilters ? (
            <DashboardFilterEmptyState
              onClearFilters={handleClean}
              title="No Results Found"
              subtitle="No requests match the selected filters."
            />
          ) : undefined
        }
      />
    </TablePanel>
  );
}
