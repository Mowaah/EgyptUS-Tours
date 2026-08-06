"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import useSWR from "swr";
import { getAllDeposits } from "@/services/admin/adminFinanceService";
import { downloadBlobAsCSV } from "@/lib/utils";

export function useDepositsPanel({ searchQuery }: { searchQuery?: string } = {}) {
  const [filters, setFilters] = useState({
    service: "All",
    date: "All",
    status: "All",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);

  const apiFilters = useMemo(() => {
    const params: any = { limit: 1000, page_size: 1000 };
    if (appliedFilters.service && appliedFilters.service !== "All") {
      const s = appliedFilters.service.toLowerCase();
      if (s === "trips") params.service = "trip";
      else if (s === "hotels") params.service = "hotel";
      else if (s === "transportation") params.service = "transport";
      else if (s === "b2b" || s === "mice" || s === "custom trip") params.service = "custom_trip";
      else params.service = s;
    }
    if (appliedFilters.status && appliedFilters.status !== "All") params.deposit_status = appliedFilters.status.toLowerCase();
    if (searchQuery) params.search = searchQuery;
    return params;
  }, [appliedFilters, searchQuery]);

  const { data: res, isLoading: loading } = useSWR(
    ["adminFinanceDeposits", apiFilters],
    () => getAllDeposits(apiFilters),
    { keepPreviousData: true }
  );

  const data = Array.isArray(res) ? res : res?.results || res?.data?.results || [];

  const handleApply = () => {
    setAppliedFilters(filters);
  };

  const handleClean = () => {
    setFilters({ service: "All", date: "All", status: "All" });
    setAppliedFilters({ service: "All", date: "All", status: "All" });
  };

  const handleExport = useCallback(() => {
    if (!data || data.length === 0) return;
    
    const exportRows = data.map((item: any) => ({
      "Booking Type": item.booking_type || "",
      "Booking ID": item.booking_id || "",
      "Customer": item.customer_name || "",
      "Total Price": item.total_price || "",
      "Deposit Amount": item.deposit_amount || "",
      "Paid to Date": item.paid_to_date || "",
      "Deposit Due Date": item.deposit_due_date || "",
      "Status": item.deposit_status || "",
    }));

    const headers = Object.keys(exportRows[0]);
    const csvLines = [
      headers.join(","),
      ...exportRows.map((row) =>
        headers
          .map((header) => {
            const val = row[header as keyof typeof row] ?? "";
            const escaped = String(val).replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(",")
      ),
    ];
    const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
    downloadBlobAsCSV(blob, "deposits.csv");
  }, [data]);

  useEffect(() => {
    const handleGlobalExport = () => {
      handleExport();
    };
    window.addEventListener("export-deposits", handleGlobalExport);
    return () => {
      window.removeEventListener("export-deposits", handleGlobalExport);
    };
  }, [handleExport, data]);

  return {
    data,
    loading,
    filters,
    setFilters,
    handleApply,
    handleClean,
    handleExport,
  };
}
