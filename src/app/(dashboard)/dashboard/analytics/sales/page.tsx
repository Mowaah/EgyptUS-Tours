"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import SalesRevenueMetrics from "@/components/dashboard/Analytics/SalesRevenueMetrics/SalesRevenueMetrics";
import RevenueByDestinationChart from "@/components/dashboard/shared/RevenueByDestinationChart/RevenueByDestinationChart";
import ServiceRevenueChart from "@/components/dashboard/Analytics/ServiceRevenueChart/ServiceRevenueChart";
import RevenueByPartnerChart from "@/components/dashboard/Analytics/RevenueByPartnerChart/RevenueByPartnerChart";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";
import styles from "@/components/dashboard/Analytics/ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import { fetchSalesReports, downloadReportExport } from "@/services/admin/adminReportsService";

export default function SalesReportsPage() {
  const searchParams = useSearchParams();
  let range = searchParams.get("range") || "this_month";
  if (range === "30d") range = "last_30";
  if (range === "7d") range = "this_week";

  const { data: reportsData, isLoading } = useSWR(
    ["/admin/reports/sales", range],
    () => fetchSalesReports({ range }),
    {
      revalidateOnFocus: false,
    }
  );

  const destinationData = useMemo(() => {
    if (!reportsData?.revenue_by_destination) return { chartData: [], maxValue: 550000, gridLabels: ["0$", "55000$", "110000$", "165000$", "220000$", "420000$", "550000$"] };
    const items = reportsData.revenue_by_destination;
    const totalRev = items.reduce((sum, item) => sum + (parseFloat(item.total_revenue as string) || 0), 0) || 1;
    const maxVal = Math.max(10, ...items.map(i => parseFloat(i.total_revenue as string) || 0));
    const step = maxVal / 6;

    return {
      chartData: items.map(i => ({
        label: i.destination,
        value: parseFloat(i.total_revenue as string) || 0,
        percentage: Math.round(((parseFloat(i.total_revenue as string) || 0) / totalRev) * 100),
      })).slice(0, 5), // Show top 5
      maxValue: maxVal,
      gridLabels: [
        "0$",
        Math.round(step).toString() + "$",
        Math.round(step * 2).toString() + "$",
        Math.round(step * 3).toString() + "$",
        Math.round(step * 4).toString() + "$",
        Math.round(step * 5).toString() + "$",
        Math.round(maxVal).toString() + "$",
      ]
    };
  }, [reportsData]);

  if (isLoading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading reports...</div>;
  }

  return (
    <div className={styles.salesTab}>
      <SalesRevenueMetrics kpis={reportsData?.kpis} />
      
      <div className={styles.chartsGrid}>
        <div className={styles.leftColumn}>
          <RevenueByDestinationChart 
            title="Revenue by Destination"
            icon="reports/top_destinations"
            gridLabels={destinationData.gridLabels}
            tooltipFormat="revenue"
            maxValue={destinationData.maxValue}
            data={destinationData.chartData}
            actions={<ExportButtons onCsvClick={() => downloadReportExport("sales", "revenue_by_destination", { range })} />}
          />
        </div>
        
        <div className={styles.rightColumn}>
          <ServiceRevenueChart data={reportsData?.revenue_by_service} actions={<ExportButtons onCsvClick={() => downloadReportExport("sales", "revenue_by_service", { range })} />} />
        </div>
      </div>

      <RevenueByPartnerChart data={reportsData?.revenue_by_partner} actions={<ExportButtons onCsvClick={() => downloadReportExport("sales", "revenue_by_partner", { range })} />} />
    </div>
  );
}
