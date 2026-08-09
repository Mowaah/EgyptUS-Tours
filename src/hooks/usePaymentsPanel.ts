import { useState, useEffect, useCallback, useMemo } from "react";
import useSWR from "swr";
import { downloadBlobAsCSV } from "@/lib/utils";
import { getPayments, getAllPayments } from "@/services/admin/adminFinanceService";

export interface UsePaymentsPanelOptions {
  searchQuery: string;
}

export function usePaymentsPanel({ searchQuery }: UsePaymentsPanelOptions) {
  
  const [filters, setFilters] = useState({
    service: "All",
    date: "All",
    status: "All",
  });
  
  const [appliedFilters, setAppliedFilters] = useState({
    service: "All",
    date: "All",
    status: "All",
  });

  const apiFilters = useMemo(() => {
    const params: any = { limit: 1000, page_size: 1000 };
    
    if (searchQuery) params.search = searchQuery;
    
    if (appliedFilters.service && appliedFilters.service !== "All") {
      const s = appliedFilters.service.toLowerCase();
      if (s === "trips") params.service = "trip";
      else if (s === "hotels") params.service = "hotel";
      else if (s === "transportation") params.service = "transport";
      else if (s === "b2b" || s === "mice" || s === "custom trip") params.service = "custom_trip";
      else params.service = s;
    }
    
    if (appliedFilters.status && appliedFilters.status !== "All") {
      params.status = appliedFilters.status === "Fully Paid" ? "fully_paid" : "refunded";
    }
    
    if (appliedFilters.date && appliedFilters.date !== "All") {
      const now = new Date();
      if (appliedFilters.date === "Last 7 Days") {
        const past = new Date(now);
        past.setDate(now.getDate() - 7);
        params.date_from = past.toISOString().split("T")[0];
      } else if (appliedFilters.date === "Last 30 Days") {
        const past = new Date(now);
        past.setDate(now.getDate() - 30);
        params.date_from = past.toISOString().split("T")[0];
      } else if (appliedFilters.date === "This Month") {
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        params.date_from = firstDay.toISOString().split("T")[0];
      } else if (appliedFilters.date === "Last Month") {
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        params.date_from = firstDayLastMonth.toISOString().split("T")[0];
        params.date_to = lastDayLastMonth.toISOString().split("T")[0];
      }
    }
    
    return params;
  }, [appliedFilters, searchQuery]);

  const { data: res, isLoading: loading } = useSWR<any>(
    ["adminFinancePayments", apiFilters],
    () => getAllPayments(apiFilters),
    { keepPreviousData: true }
  );

  const data = useMemo(() => {
    const results = Array.isArray(res) ? res : res?.results || res?.data?.results || [];
    return results.map((item: any) => {
      let serviceStr = "Trips";
      if (item.booking_type === "hotel") serviceStr = "Hotels";
      if (item.booking_type === "transport") serviceStr = "Transportation";
      if (item.booking_type === "custom_trip") {
         serviceStr = item.booking_title?.toLowerCase().includes("b2b") ? "B2B" : "MICE";
      }

      return {
        id: item.payment_number,
        bookingId: item.booking_id,
        customer: item.customer_name,
        service: serviceStr,
        dates: item.paid_at ? new Date(item.paid_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
        method: item.method_label,
        status: item.status_label,
      };
    });
  }, [res]);

  const handleApply = () => {
    setAppliedFilters(filters);
  };

  const handleClean = () => {
    setFilters({ service: "All", date: "All", status: "All" });
    setAppliedFilters({ service: "All", date: "All", status: "All" });
  };

  const handleExport = async () => {
    if (!data || data.length === 0) return;
    
    const exportRows = data.map((item: any) => ({
      "Payment ID": item.id || "",
      "Booking ID": item.bookingId || "",
      "Customer": item.customer || "",
      "Service": item.service || "",
      "Date": item.dates || "",
      "Method": item.method || "",
      "Status": item.status || "",
    }));

    const headers = Object.keys(exportRows[0]);
    const csvLines = [
      headers.join(","),
      ...exportRows.map((row: any) =>
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
    downloadBlobAsCSV(blob, "payments.csv");
  };

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
