"use client";

import useSWR from "swr";
import MiceMetrics from "@/components/dashboard/Analytics/MiceMetrics/MiceMetrics";
import MicePipeline from "@/components/dashboard/Analytics/MicePipeline/MicePipeline";
import MiceRevenueByEventType from "@/components/dashboard/Analytics/MiceRevenueByEventType/MiceRevenueByEventType";
import MiceBookingsDetail from "@/components/dashboard/Analytics/MiceBookingsDetail/MiceBookingsDetail";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";
import styles from "@/components/dashboard/Analytics/ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import { fetchMiceReports, downloadReportExport } from "@/services/admin/adminReportsService";

const ALL_TIME_PARAMS = {
  range: "custom",
  date_from: "2000-01-01",
  date_to: "2099-12-31",
};

export default function MiceReportsPage() {
  const { data: reportsData, isLoading } = useSWR(
    ["/admin/reports/mice/all-time"],
    () => fetchMiceReports(ALL_TIME_PARAMS),
    {
      revalidateOnFocus: false,
    }
  );

  if (isLoading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading reports...</div>;
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
            actions={<ExportButtons onCsvClick={() => downloadReportExport("mice", "pipeline", ALL_TIME_PARAMS)} />} 
          />
        </div>
        <div className={styles.rightColumn}>
          <MiceRevenueByEventType 
            data={reportsData?.revenue_by_event_type?.fallback?.by_event_type_count} 
            actions={<ExportButtons onCsvClick={() => downloadReportExport("mice", "revenue_by_event_type", ALL_TIME_PARAMS)} />} 
          />
        </div>
      </div>
      <MiceBookingsDetail 
        proposals={reportsData?.proposals_detail?.results} 
        actions={<ExportButtons onCsvClick={() => downloadReportExport("mice", "proposals_detail", ALL_TIME_PARAMS)} />} 
      />
    </div>
  );
}
