"use client";

import useSWR from "swr";
import MiceMetrics from "@/components/dashboard/Analytics/MiceMetrics/MiceMetrics";
import MicePipeline from "@/components/dashboard/Analytics/MicePipeline/MicePipeline";
import MiceRevenueByEventType from "@/components/dashboard/Analytics/MiceRevenueByEventType/MiceRevenueByEventType";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";
import styles from "@/components/dashboard/Analytics/ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import { fetchMiceReports, downloadReportExport } from "@/services/admin/adminReportsService";
import { useReportsFilter } from "@/hooks/useReportsFilter";

export default function MiceReportsPage() {
  const filterParams = useReportsFilter();

  const { data: reportsData, isLoading } = useSWR(
    ["/admin/reports/mice", filterParams],
    () => fetchMiceReports(filterParams),
    {
      revalidateOnFocus: false,
    }
  );

  if (isLoading) {
    return <div className={styles.loadingState}>Loading reports...</div>;
  }

  return (
    <div className={styles.salesTab}>
      <MiceMetrics 
        kpis={reportsData?.kpis} 
      />
      <div className={styles.chartsGridHalf}>
        <div className={styles.leftColumn}>
          <MicePipeline 
            pipeline={reportsData?.pipeline} 
            actions={<ExportButtons onCsvClick={() => downloadReportExport("mice", "pipeline", filterParams)} />} 
          />
        </div>
        <div className={styles.rightColumn}>
          <MiceRevenueByEventType 
            data={reportsData?.revenue_by_event_type?.fallback?.by_event_type_count} 
            actions={<ExportButtons onCsvClick={() => downloadReportExport("mice", "revenue_by_event_type", filterParams)} />} 
          />
        </div>
      </div>
      {/* MICE Proposals Detail table commented out as requested */}
      {/* <MiceBookingsDetail 
        proposals={reportsData?.proposals_detail?.results} 
        actions={<ExportButtons onCsvClick={() => downloadReportExport("mice", "proposals_detail", filterParams)} />} 
      /> */}
    </div>
  );
}
