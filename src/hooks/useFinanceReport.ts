"use client";
import { useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import { getFinanceReport } from "@/services/admin/adminFinanceService";
import { downloadBlobAsCSV } from "@/lib/utils";

export function useFinanceReport(rangeKey: string = "last_12m") {
  const { data, isLoading: loading } = useSWR(
    ["adminFinanceReport", rangeKey],
    () => getFinanceReport({ range: rangeKey }),
    { keepPreviousData: true }
  );

  const handleExportCSV = useCallback(() => {
    if (!data) return;

    const lines: string[] = [];
    lines.push("Metric,Value");
    lines.push(`Total Revenue,"${data.total_revenue || "0.00"}"`);
    lines.push(`Total Transactions,"${data.total_transactions || 0}"`);
    lines.push(`Refunded Amount,"${data.refunded_amount || "0.00"}"`);
    lines.push(`Revenue Growth Pct,"${data.revenue_growth_pct || "0.00"}%"`);
    
    lines.push("");
    lines.push("Category,Revenue");
    const catMap = data.revenue_by_category || {};
    Object.keys(catMap).forEach((k) => {
      lines.push(`"${k}","${catMap[k]}"`);
    });

    lines.push("");
    lines.push("Destination,Booking Count,Total Revenue");
    (data.revenue_by_destination || []).forEach((dest: any) => {
      lines.push(`"${dest.destination_name || 'Unassigned'}","${dest.booking_count}","${dest.total_revenue}"`);
    });

    lines.push("");
    lines.push("Vehicle Type,Booking Count,Total Revenue");
    (data.fleet_revenue_by_vehicle_type || []).forEach((fleet: any) => {
      lines.push(`"${fleet.vehicle_type || 'Unspecified'}","${fleet.booking_count}","${fleet.total_revenue}"`);
    });

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    downloadBlobAsCSV(blob, `financial_report_${rangeKey}.csv`);
  }, [data, rangeKey]);

  return {
    data,
    loading,
    refetch: fetchReport,
    handleExportCSV,
  };
}
