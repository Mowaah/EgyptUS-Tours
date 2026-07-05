"use client";

import LeadConversionMetrics from "@/components/dashboard/Analytics/LeadConversionMetrics/LeadConversionMetrics";
import LeadsBySourceChart from "@/components/dashboard/Analytics/LeadsBySourceChart/LeadsBySourceChart";
import LostLeadsAnalysis from "@/components/dashboard/Analytics/LostLeadsAnalysis/LostLeadsAnalysis";
import AvgTimeToConvertChart from "@/components/dashboard/Analytics/AvgTimeToConvertChart/AvgTimeToConvertChart";
import styles from "@/components/dashboard/Analytics/ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";

export default function LeadReportsPage() {
  return (
    <div className={styles.salesTab}>
      <LeadConversionMetrics />
      
      <div className={`${styles.chartsGridHalf} ${styles.leadChartsGrid}`}>
        <div className={styles.leftColumn}>
          <LeadsBySourceChart />
          <LostLeadsAnalysis />
        </div>
        
        <div className={styles.rightColumn}>
          <AvgTimeToConvertChart />
        </div>
      </div>
    </div>
  );
}
