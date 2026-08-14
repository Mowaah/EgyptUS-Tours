"use client";

import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import LeadConversionMetrics from "@/components/dashboard/Analytics/LeadConversionMetrics/LeadConversionMetrics";
import LeadsBySourceChart from "@/components/dashboard/Analytics/LeadsBySourceChart/LeadsBySourceChart";
import LostLeadsAnalysis from "@/components/dashboard/Analytics/LostLeadsAnalysis/LostLeadsAnalysis";
import AvgTimeToConvertChart from "@/components/dashboard/Analytics/AvgTimeToConvertChart/AvgTimeToConvertChart";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";
import styles from "@/components/dashboard/Analytics/ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import { fetchLeadsReports, downloadReportExport } from "@/services/admin/adminReportsService";

export default function LeadReportsPage() {
  const searchParams = useSearchParams();
  let range = searchParams.get("range") || "this_month";
  if (range === "30d") range = "last_30";
  if (range === "7d") range = "this_week";

  const { data: reportsData, isLoading } = useSWR(
    ["/admin/reports/leads", range],
    () => fetchLeadsReports({ range }),
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
          <LeadsBySourceChart actions={<ExportButtons onCsvClick={() => downloadReportExport("leads", "leads_by_source", { range })} />} />
          <LostLeadsAnalysis actions={<ExportButtons onCsvClick={() => downloadReportExport("leads", "lost_leads_analysis", { range })} />} />
        </div>
        
        <div className={styles.rightColumn}>
          <AvgTimeToConvertChart actions={<ExportButtons onCsvClick={() => downloadReportExport("leads", "avg_time_to_convert", { range })} />} />
        </div>
      </div>
    </div>
  );
}
