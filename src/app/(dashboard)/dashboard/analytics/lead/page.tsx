"use client";

import useSWR from "swr";
import LeadConversionMetrics from "@/components/dashboard/Analytics/LeadConversionMetrics/LeadConversionMetrics";
import LeadsBySourceChart from "@/components/dashboard/Analytics/LeadsBySourceChart/LeadsBySourceChart";
import LostLeadsAnalysis from "@/components/dashboard/Analytics/LostLeadsAnalysis/LostLeadsAnalysis";
import AvgTimeToConvertChart from "@/components/dashboard/Analytics/AvgTimeToConvertChart/AvgTimeToConvertChart";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";
import styles from "@/components/dashboard/Analytics/ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import { fetchLeadsReports, downloadReportExport } from "@/services/admin/adminReportsService";

const ALL_TIME_PARAMS = {
  range: "custom",
  date_from: "2000-01-01",
  date_to: "2099-12-31",
};

export default function LeadReportsPage() {
  const { data: reportsData, isLoading } = useSWR(
    ["/admin/reports/leads/all-time"],
    () => fetchLeadsReports(ALL_TIME_PARAMS),
    {
      revalidateOnFocus: false,
    }
  );

  if (isLoading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading reports...</div>;
  }

  return (
    <div className={styles.salesTab}>
      <LeadConversionMetrics kpis={reportsData?.kpis} />
      
      <div className={`${styles.chartsGridHalf} ${styles.leadChartsGrid}`}>
        <div className={styles.leftColumn}>
          <LeadsBySourceChart 
            data={reportsData?.leads_by_source?.by_source_count} 
            actions={<ExportButtons onCsvClick={() => downloadReportExport("leads", "leads_by_source", ALL_TIME_PARAMS)} />} 
          />
          <LostLeadsAnalysis 
            data={reportsData?.lost_leads_analysis} 
            actions={<ExportButtons onCsvClick={() => downloadReportExport("leads", "lost_leads_analysis", ALL_TIME_PARAMS)} />} 
          />
        </div>
        
        <div className={styles.rightColumn}>
          <AvgTimeToConvertChart 
            data={reportsData?.avg_time_to_convert?.by_channel_days} 
            actions={<ExportButtons onCsvClick={() => downloadReportExport("leads", "avg_time_to_convert", ALL_TIME_PARAMS)} />} 
          />
        </div>
      </div>
    </div>
  );
}
