"use client";

import { useMemo } from "react";
import useSWR from "swr";
import SalesRevenueMetrics from "@/components/dashboard/Analytics/SalesRevenueMetrics/SalesRevenueMetrics";
import RevenueByDestinationChart from "@/components/dashboard/shared/RevenueByDestinationChart/RevenueByDestinationChart";
import ServiceRevenueChart from "@/components/dashboard/Analytics/ServiceRevenueChart/ServiceRevenueChart";
import RevenueByPartnerChart from "@/components/dashboard/Analytics/RevenueByPartnerChart/RevenueByPartnerChart";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";
import styles from "@/components/dashboard/Analytics/ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import { fetchSalesReports, downloadReportExport } from "@/services/admin/adminReportsService";
import { formatCompactMetric } from "@/utils/formatMetric";
import { useReportsFilter } from "@/hooks/useReportsFilter";

export default function SalesReportsPage() {
  const filterParams = useReportsFilter();

  const { data: reportsData, isLoading } = useSWR(
    ["/admin/reports/sales", filterParams],
    () => fetchSalesReports(filterParams),
    {
      revalidateOnFocus: false,
    }
  );

  const destinationData = useMemo(() => {
    if (!reportsData?.revenue_by_destination) {
      return { 
        chartData: [], 
        maxValue: 550000, 
        gridLabels: ["$0", "$55k", "$110k", "$165k", "$220k", "$420k", "$550k"] 
      };
    }
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
        "$0",
        formatCompactMetric(step, true),
        formatCompactMetric(step * 2, true),
        formatCompactMetric(step * 3, true),
        formatCompactMetric(step * 4, true),
        formatCompactMetric(step * 5, true),
        formatCompactMetric(maxVal, true),
      ]
    };
  }, [reportsData]);

  if (isLoading) {
    return <div className={styles.loadingState}>Loading reports...</div>;
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
            actions={<ExportButtons onCsvClick={() => downloadReportExport("sales", "revenue_by_destination", filterParams)} />}
          />
        </div>
        
        <div className={styles.rightColumn}>
          <ServiceRevenueChart data={reportsData?.revenue_by_service} actions={<ExportButtons onCsvClick={() => downloadReportExport("sales", "revenue_by_service", filterParams)} />} />
        </div>
      </div>

      <RevenueByPartnerChart data={reportsData?.revenue_by_partner} actions={<ExportButtons onCsvClick={() => downloadReportExport("sales", "revenue_by_partner", filterParams)} />} />
    </div>
  );
}
