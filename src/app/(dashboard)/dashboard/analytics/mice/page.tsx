"use client";

import MiceMetrics from "@/components/dashboard/Analytics/MiceMetrics/MiceMetrics";
import MicePipeline from "@/components/dashboard/Analytics/MicePipeline/MicePipeline";
import MiceRevenueByEventType from "@/components/dashboard/Analytics/MiceRevenueByEventType/MiceRevenueByEventType";
import MiceBookingsDetail from "@/components/dashboard/Analytics/MiceBookingsDetail/MiceBookingsDetail";
import styles from "@/components/dashboard/Analytics/ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";

export default function MiceReportsPage() {
  return (
    <div className={styles.salesTab}>
      <MiceMetrics />
      <div className={styles.chartsGridHalf}>
        <div className={styles.leftColumn}>
          <MicePipeline />
        </div>
        <div className={styles.rightColumn}>
          <MiceRevenueByEventType />
        </div>
      </div>
      <MiceBookingsDetail />
    </div>
  );
}
