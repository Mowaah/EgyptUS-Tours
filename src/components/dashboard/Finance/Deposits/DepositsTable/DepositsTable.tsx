"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dashboard/DataTable";
import { TablePanel, TablePanelFilterBar } from "@/components/dashboard/TablePanel";
import { depositsColumns, depositRowActions } from "../depositsColumns/depositsColumns";
import { useDepositsPanel } from "@/hooks/useDepositsPanel";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardFilterEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardFilterEmptyState";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { triggerToast } from "@/components/dashboard/shared/GlobalToastContainer/GlobalToastContainer";
import {
  sendTripBookingReminder,
  sendHotelBookingReminder,
  sendTransportationBookingReminder,
} from "@/services/admin/adminBookingsService";
import {
  planYourTripActions,
  b2bActions,
  eventsActions,
} from "@/services/admin/adminRequestsService";

interface DepositsTableProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  date_from?: string;
  date_to?: string;
}

export default function DepositsTable({ searchQuery = "", onClearSearch, date_from, date_to }: DepositsTableProps) {
  const router = useRouter();
  const { canEdit } = useAdminAuth();
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
  } = useDepositsPanel({ searchQuery, page, pageSize, date_from, date_to });

  const handleAction = async (action: { label: string }, row: any) => {
    const type = row.booking_type;
    const id = row.booking_id;

    if (action.label === "View Booking") {
      if (type === "trip") {
        router.push(`/dashboard/bookings/trips/${id}`);
      } else if (type === "hotel") {
        router.push(`/dashboard/bookings/hotels/${id}`);
      } else if (type === "transport" || type === "transportation") {
        router.push(`/dashboard/bookings/transportation/${id}`);
      } else if (type === "custom_trip") {
        router.push(`/dashboard/requests/plan-your-trip/${id}`);
      } else if (type === "b2b" || type === "b2b_proposal") {
        router.push(`/dashboard/requests/b2b-programs/${id}`);
      } else if (type === "mice" || type === "event_proposal") {
        router.push(`/dashboard/requests/mice-corporate/${id}`);
      } else {
        router.push(`/dashboard/bookings/trips/${id}`);
      }
    } else if (action.label === "Send reminder") {
      try {
        if (type === "trip") {
          await sendTripBookingReminder(id);
        } else if (type === "hotel") {
          await sendHotelBookingReminder(id);
        } else if (type === "transport" || type === "transportation") {
          await sendTransportationBookingReminder(id);
        } else if (type === "custom_trip") {
          await planYourTripActions.sendPaymentReminder(id, "deposit");
        } else if (type === "b2b" || type === "b2b_proposal") {
          await b2bActions.sendPaymentReminder(id, "deposit");
        } else if (type === "mice" || type === "event_proposal") {
          await eventsActions.sendPaymentReminder(id, "deposit");
        } else {
          await sendTripBookingReminder(id);
        }
        triggerToast("Deposit reminder sent successfully.", "success");
      } catch (err: any) {
        triggerToast(
          err?.response?.data?.payment?.[0] ||
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Failed to send deposit reminder."
        );
      }
    }
  };

  const handleClearAll = () => {
    handleClean();
    onClearSearch?.();
  };

  const filterFields = [
    {
      id: "service",
      label: "Service",
      value: filters.service,
      options: ["All", "Trips", "Hotels", "Transportation", "MICE", "B2B", "Custom Trip"],
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
      options: ["All", "Pending", "Overdue"],
      onChange: (v: string) => setFilters(prev => ({ ...prev, status: v })),
    },
  ];

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
          onClean={handleClearAll}
          onApply={handleApply}
        />
      }
    >
      <DataTable
        data={data}
        columns={depositsColumns}
        rowActions={depositRowActions(handleAction, canEdit("finance") || canEdit("bookings"))}
        getRowId={(row) => `${row.booking_type}-${row.booking_id}`}
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
              title="No Deposits Found"
              subtitle="Deposits will appear here once bookings are created."
              imageSrc="/images/dashboard/empty.png"
            />
          ) : !searchQuery && Object.values(appliedFilters).some((v) => v !== "All") ? (
            <DashboardFilterEmptyState
              onClearFilters={handleClearAll}
              title="No Results Found"
              subtitle="No deposits match the selected filters."
            />
          ) : undefined
        }
      />
    </TablePanel>
  );
}
