"use client";
import { useState, useEffect, useCallback } from "react";
import { getAllDeposits } from "@/services/admin/adminFinanceService";
import { downloadBlobAsCSV } from "@/lib/utils";

export function useDepositsPanel({ searchQuery }: { searchQuery?: string } = {}) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    service: "All",
    date: "All",
    status: "All",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);

  const fetchDeposits = useCallback(async () => {
    setLoading(true);
    try {
      const apiFilters: any = {};
      if (appliedFilters.service && appliedFilters.service !== "All") {
        const s = appliedFilters.service.toLowerCase();
        if (s === "trips") apiFilters.service = "trip";
        else if (s === "hotels") apiFilters.service = "hotel";
        else if (s === "transportation") apiFilters.service = "transport";
        else if (s === "b2b" || s === "mice" || s === "custom trip") apiFilters.service = "custom_trip";
        else apiFilters.service = s;
      }
      if (appliedFilters.status && appliedFilters.status !== "All") apiFilters.deposit_status = appliedFilters.status.toLowerCase();
      if (searchQuery) apiFilters.search = searchQuery;
      
      const results = await getAllDeposits(apiFilters);
      setData(results);
    } catch (err) {
      console.error("Failed to fetch deposits:", err);
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, searchQuery]);

  useEffect(() => {
    fetchDeposits();
  }, [fetchDeposits]);

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
