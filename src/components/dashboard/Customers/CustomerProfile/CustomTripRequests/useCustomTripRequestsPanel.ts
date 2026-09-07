"use client";

import { useState, useMemo } from "react";
import { useAdminCustomerRequests } from "@/hooks/useCustomers";
import { downloadBlobAsCSV } from "@/lib/utils";
import { formatLabel } from "./customTripsColumns";
import type { TablePanelFilterField } from "@/components/dashboard/TablePanel";

export interface CustomTripRequestFilters {
  source: string;
  status: string;
}

const defaultFilters: CustomTripRequestFilters = {
  source: "All",
  status: "All",
};

const SOURCE_OPTIONS = ["All", "Website", "Agent"];

const STATUS_OPTIONS = [
  "All",
  "New",
  "In Progress",
  "Proposal Ready",
  "Proposal Sent",
  "Negotiation",
  "On Hold",
  "30% Pending Payment",
  "Pending Payment",
  "Deposit Paid",
  "Fully Paid",
  "In Trip",
  "Completed",
  "Rejected",
  "Cancelled",
];

const normalize = (str: string) => (str || "").toLowerCase().replace(/[-_]/g, " ").trim();

const matchesSource = (item: any, filterSource: string): boolean => {
  if (!filterSource || filterSource === "All") return true;
  return normalize(item.source || "") === normalize(filterSource);
};

const matchesStatus = (item: any, filterStatus: string): boolean => {
  if (!filterStatus || filterStatus === "All") return true;

  const effectiveStatus = item.display_status || item.status || "";
  const target = normalize(filterStatus);
  const rawStatus = normalize(effectiveStatus);
  const formatted = normalize(formatLabel(effectiveStatus));

  if (rawStatus === target || formatted === target) {
    return true;
  }

  // Handle aliases and variations
  if (target === "cancelled" && (rawStatus === "canceled" || formatted === "canceled")) {
    return true;
  }
  if (
    target.includes("pending payment") &&
    (rawStatus.includes("awaiting") ||
      rawStatus.includes("pending payment") ||
      formatted.includes("pending payment"))
  ) {
    return true;
  }

  return false;
};

export function useCustomTripRequestsPanel(customerId: string) {
  const [page, setPage] = useState(1);
  const { data: pageData, isLoading } = useAdminCustomerRequests(customerId, page);
  const data = useMemo(() => pageData?.results || [], [pageData?.results]);

  const [filters, setFilters] = useState<CustomTripRequestFilters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<CustomTripRequestFilters>(defaultFilters);

  const hasActiveFilters = appliedFilters.source !== "All" || appliedFilters.status !== "All";

  const filteredData = useMemo(() => {
    return data.filter((item: any) => {
      return matchesSource(item, appliedFilters.source) && matchesStatus(item, appliedFilters.status);
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
        id: "source",
        label: "Source",
        value: filters.source,
        options: SOURCE_OPTIONS,
        onChange: (val: string) => setFilters((prev) => ({ ...prev, source: val })),
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

    const headers = [
      "Reference",
      "Destination",
      "Start Date",
      "End Date",
      "Pax",
      "Source",
      "Status",
      "Agent",
    ];

    const csvLines = [
      headers.join(","),
      ...exportRows.map((row: any) => {
        const ref = row.request_code || row.id || "";
        const destination =
          Array.isArray(row.destinations) && row.destinations.length > 0
            ? row.destinations.join(" - ")
            : typeof row.destination === "string" && row.destination
            ? row.destination
            : "Custom";
        const startDate = row.start_date || "Flexible";
        const endDate = row.end_date || (row.start_date ? "TBD" : "Flexible");
        const pax = row.pax_label || `${row.adults || 0}A/${row.children || 0}C/${row.infants || 0}I`;
        const source = row.source ? formatLabel(row.source) : "-";
        const status = formatLabel(row.display_status || row.status || "");
        const agent =
          row.agent ||
          row.assigned_to?.full_name ||
          (typeof row.assigned_to === "string" ? row.assigned_to : null) ||
          "Unassigned";

        return [ref, destination, startDate, endDate, pax, source, status, agent]
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(",");
      }),
    ];

    const csvContent = csvLines.join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    downloadBlobAsCSV(blob, `custom_trip_requests_${customerId}.csv`);
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
