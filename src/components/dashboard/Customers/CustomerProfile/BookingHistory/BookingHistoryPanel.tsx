"use client";

import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import { DataTable } from "@/components/dashboard/DataTable";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardFilterEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardFilterEmptyState";
import { bookingHistoryColumns } from "./bookingHistoryColumns";
import { useBookingHistoryPanel } from "./useBookingHistoryPanel";

export default function BookingHistoryPanel({ customerId }: { customerId: string }) {
  const {
    data,
    filteredData,
    isLoading,
    hasActiveFilters,
    filterFields,
    handleApply,
    handleClean,
    handleExport,
  } = useBookingHistoryPanel(customerId);

  if (!isLoading && data.length === 0 && !hasActiveFilters) {
    return (
      <DashboardEmptyState
        title="No Bookings Yet"
        subtitle="Booking data will appear here once reservations are made"
      />
    );
  }

  return (
    <TablePanel
      ariaLabel="Customer booking history"
      title="Bookings"
      iconSrc="/images/dashboard/reviews/modal/name.svg"
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
        columns={bookingHistoryColumns as any}
        getRowId={(row: any) => row.id?.toString() || Math.random().toString()}
        isLoading={isLoading}
        emptyState={
          hasActiveFilters ? (
            <DashboardFilterEmptyState
              onClearFilters={handleClean}
              title="No Results Found"
              subtitle="No bookings match the selected filters."
            />
          ) : undefined
        }
      />
    </TablePanel>
  );
}
