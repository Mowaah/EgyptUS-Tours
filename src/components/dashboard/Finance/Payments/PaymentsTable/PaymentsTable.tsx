"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardFilterEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardFilterEmptyState";
import { DataTable } from "@/components/dashboard/DataTable";
import { paymentsColumns, paymentRowActions } from "../paymentsColumns/paymentsColumns";
import { usePaymentsPanel } from "@/hooks/usePaymentsPanel";
import { triggerToast } from "@/components/dashboard/shared/GlobalToastContainer/GlobalToastContainer";
import { getPaymentReceipt } from "@/services/admin/adminFinanceService";
import { downloadBlobAsCSV } from "@/lib/utils";

interface PaymentsTableProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  date_from?: string;
  date_to?: string;
}

export default function PaymentsTable({ searchQuery = "", onClearSearch, date_from, date_to }: PaymentsTableProps) {
  const router = useRouter();
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
  } = usePaymentsPanel({ searchQuery, page, pageSize, date_from, date_to });

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

  const handleAction = async (action: { label: string }, row: any) => {
    if (action.label === "View Booking") {
      const type = row.bookingType;
      const id = row.bookingId;

      if (!id) {
        triggerToast("No associated booking ID found for this payment.");
        return;
      }

      if (type === "trip") {
        router.push(`/dashboard/bookings/trips/${id}`);
      } else if (type === "hotel") {
        router.push(`/dashboard/bookings/hotels/${id}`);
      } else if (type === "transport" || type === "transportation") {
        router.push(`/dashboard/bookings/transportation/${id}`);
      } else if (type === "custom_trip") {
        router.push(`/dashboard/requests/plan-your-trip/${id}`);
      } else if (type === "b2b_proposal" || type === "b2b") {
        router.push(`/dashboard/requests/b2b-programs/${id}`);
      } else if (type === "event_proposal" || type === "mice") {
        router.push(`/dashboard/requests/mice-corporate/${id}`);
      } else {
        router.push(`/dashboard/bookings/trips/${id}`);
      }
    } else if (action.label === "Download Receipt") {
      try {
        const receiptData = await getPaymentReceipt(row.rawId || row.id);
        if (receiptData?.receipt_url) {
          window.open(receiptData.receipt_url, "_blank");
          triggerToast("Receipt opened successfully.", "success");
          return;
        }

        const p = receiptData?.payment || {};
        const b = receiptData?.booking || {};
        const c = receiptData?.customer || {};

        const receiptLines = [
          "==================================================",
          "              EGYPTUS TOURS RECEIPT               ",
          "==================================================",
          `Receipt / Payment Ref : ${p.payment_number || row.id}`,
          `Date                  : ${p.paid_at ? new Date(p.paid_at).toLocaleString("en-US") : (row.dates !== "—" ? row.dates : "Pending / In Progress")}`,
          `Payment Status        : ${p.status || row.status}`,
          `Payment Method        : ${p.method || row.method}`,
          "",
          "---------------- CUSTOMER DETAILS ----------------",
          `Name                  : ${c.name || row.customer || "—"}`,
          `Email                 : ${c.email || "—"}`,
          `Phone                 : ${c.phone || "—"}`,
          "",
          "---------------- BOOKING DETAILS -----------------",
          `Service               : ${row.service || b.type || "—"}`,
          `Booking ID            : #${b.id || row.bookingId || "—"}`,
          `Booking Title         : ${b.title || "—"}`,
          `Total Booking Price   : ${(b.currency || "USD").toUpperCase()} ${b.total_price || "—"}`,
          "",
          "---------------- PAYMENT DETAILS -----------------",
          `Amount                : ${(p.currency || "USD").toUpperCase()} ${p.amount || "—"}`,
          `Transaction ID        : ${p.external_ref || "—"}`,
          `Notes                 : ${p.notes || "None"}`,
          "==================================================",
        ];

        const blob = new Blob([receiptLines.join("\n")], { type: "text/plain;charset=utf-8;" });
        downloadBlobAsCSV(blob, `Receipt-${p.payment_number || row.id}.txt`);
        triggerToast("Receipt downloaded successfully.", "success");
      } catch (err: any) {
        triggerToast(
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Failed to download receipt."
        );
      }
    }
  };

  const handleClearAll = () => {
    handleClean();
    onClearSearch?.();
  };

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
          onClean={handleClearAll}
          onApply={handleApply}
        />
      }
    >
      <DataTable
        data={data}
        columns={paymentsColumns as any}
        rowActions={paymentRowActions(handleAction)}
        getRowId={(row) => row.id.toString()}
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
              title="No Payments Found"
              subtitle="Payment transactions will appear here once they are recorded."
              imageSrc="/images/dashboard/empty.png"
            />
          ) : !searchQuery && Object.values(appliedFilters).some((v) => v !== "All") ? (
            <DashboardFilterEmptyState
              onClearFilters={handleClearAll}
              title="No Results Found"
              subtitle="No payments match the selected filters."
            />
          ) : undefined
        }
      />
    </TablePanel>
  );
}
