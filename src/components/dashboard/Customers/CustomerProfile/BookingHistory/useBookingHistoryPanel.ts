"use client";

import { useState, useMemo } from "react";
import { useAdminCustomerBookings } from "@/hooks/useCustomers";
import { downloadBlobAsCSV } from "@/lib/utils";
import type { TablePanelFilterField } from "@/components/dashboard/TablePanel";

export interface BookingHistoryFilters {
  service: string;
  status: string;
}

const defaultFilters: BookingHistoryFilters = {
  service: "All",
  status: "All",
};

const SERVICE_OPTIONS = ["All", "Trips", "Hotels", "Transportation"];
const STATUS_OPTIONS = ["All", "Upcoming", "Completed", "Canceled", "Pending", "Paid"];

const normalize = (str: string) => (str || "").toLowerCase().replace(/[-_]/g, " ").trim();

const formatLabel = (str: string) => {
  if (!str) return "";
  return str.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
};

const matchesService = (item: any, filterService: string): boolean => {
  if (!filterService || filterService === "All") return true;
  const itemType = normalize(item.booking_type || item.service || "");
  const target = normalize(filterService);
  if (target.includes("trip") && itemType.includes("trip")) return true;
  if (target.includes("hotel") && itemType.includes("hotel")) return true;
  if (target.includes("transport") && itemType.includes("transport")) return true;
  return itemType === target;
};

const matchesStatus = (item: any, filterStatus: string): boolean => {
  if (!filterStatus || filterStatus === "All") return true;
  const target = normalize(filterStatus);
  const rawStatus = normalize(item.status || "");
  const paymentStatus = normalize(item.payment_status || "");

  if (rawStatus === target || paymentStatus === target) {
    return true;
  }

  if (target === "canceled" && (rawStatus === "cancelled" || rawStatus === "canceled")) {
    return true;
  }

  return false;
};

export function useBookingHistoryPanel(customerId: string) {
  const [page, setPage] = useState(1);
  const { data: pageData, isLoading } = useAdminCustomerBookings(customerId, page);
  const data = useMemo(() => pageData?.results || [], [pageData?.results]);

  const [filters, setFilters] = useState<BookingHistoryFilters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<BookingHistoryFilters>(defaultFilters);

  const hasActiveFilters = appliedFilters.service !== "All" || appliedFilters.status !== "All";

  const filteredData = useMemo(() => {
    return data.filter((item: any) => {
      return matchesService(item, appliedFilters.service) && matchesStatus(item, appliedFilters.status);
    });
  }, [data, appliedFilters]);

  const handleApply = () => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const handleClean = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setPage(1);
  };

  const filterFields: TablePanelFilterField[] = useMemo(
    () => [
      {
        id: "service",
        label: "Service",
        value: filters.service,
        options: SERVICE_OPTIONS,
        onChange: (val: string) => setFilters((prev) => ({ ...prev, service: val })),
      },
      {
        id: "status",
        label: "Status",
        value: filters.status,
        options: STATUS_OPTIONS,
        onChange: (val: string) => setFilters((prev) => ({ ...prev, status: val })),
      },
    ],
    [filters]
  );

  const handleExport = () => {
    const exportRows = filteredData;
    if (exportRows.length === 0) return;

    const headers = ["Booking ID", "Service", "Name", "Dates", "Total Price", "Payment Status", "Status"];

    const csvLines = [
      headers.join(","),
      ...exportRows.map((row: any) => {
        const bookingId = row.booking_reference || row.display_id || row.booking_code || row.id || "";
        const service = formatLabel(row.booking_type || "");
        const name = row.title || "";
        const dates = `${row.start_date || ""} -> ${row.end_date || ""}`;
        const currency = row.currency?.toUpperCase() || "USD";
        const price = `${currency} ${Number(row.total_price || 0).toLocaleString()}`;
        const paymentStatus = formatLabel(row.payment_status || "");
        const status = formatLabel(row.status || "");

        return [bookingId, service, name, dates, price, paymentStatus, status]
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(",");
      }),
    ];

    const csvContent = csvLines.join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    downloadBlobAsCSV(blob, `bookings_${customerId}.csv`);
  };

  return {
    data,
    filteredData,
    isLoading,
    hasActiveFilters,
    filterFields,
    handleApply,
    handleClean,
    handleExport,
  };
}
