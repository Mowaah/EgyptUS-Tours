"use client";

import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import MiceMetrics from "@/components/dashboard/Analytics/MiceMetrics/MiceMetrics";
import MicePipeline from "@/components/dashboard/Analytics/MicePipeline/MicePipeline";
import MiceRevenueByEventType from "@/components/dashboard/Analytics/MiceRevenueByEventType/MiceRevenueByEventType";
import MiceBookingsDetail from "@/components/dashboard/Analytics/MiceBookingsDetail/MiceBookingsDetail";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";
import styles from "@/components/dashboard/Analytics/ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import { fetchMiceReports, downloadReportExport } from "@/services/admin/adminReportsService";

export default function MiceReportsPage() {
  const searchParams = useSearchParams();
  let range = searchParams.get("range") || "this_month";
  if (range === "30d") range = "last_30";
  if (range === "7d") range = "this_week";

  const { data: reportsData, isLoading } = useSWR(
    ["/admin/reports/mice", range],
    () => fetchMiceReports({ range }),
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
            actions={<ExportButtons onCsvClick={() => downloadReportExport("mice", "pipeline", { range })} />} 
          />
        </div>
        <div className={styles.rightColumn}>
          <MiceRevenueByEventType 
            data={reportsData?.revenue_by_event_type?.fallback?.by_event_type_count} 
            actions={<ExportButtons onCsvClick={() => downloadReportExport("mice", "revenue_by_event_type", { range })} />} 
          />
        </div>
      </div>
      <MiceBookingsDetail 
        proposals={reportsData?.proposals_detail?.results} 
        actions={<ExportButtons onCsvClick={() => downloadReportExport("mice", "proposals_detail", { range })} />} 
      />
    </div>
  );
}
