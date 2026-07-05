"use client";

import SalesRevenueMetrics from "@/components/dashboard/Analytics/SalesRevenueMetrics/SalesRevenueMetrics";
import RevenueByDestinationChart from "@/components/dashboard/shared/RevenueByDestinationChart/RevenueByDestinationChart";
import ServiceRevenueChart from "@/components/dashboard/Analytics/ServiceRevenueChart/ServiceRevenueChart";
import RevenueByPartnerChart from "@/components/dashboard/Analytics/RevenueByPartnerChart/RevenueByPartnerChart";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";
import styles from "@/components/dashboard/Analytics/ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";

export default function SalesReportsPage() {
  return (
    <div className={styles.salesTab}>
      <SalesRevenueMetrics />
      
      <div className={styles.chartsGrid}>
        <div className={styles.leftColumn}>
          <RevenueByDestinationChart 
            title="Revenue by Destination"
            icon="reports/top_destinations"
            gridLabels={["0", "55000$", "110000$", "165000$", "220000$", "420000$", "550000$"]}
            tooltipFormat="revenue"
            maxValue={550000}
            data={[
              { label: "LUXOR", value: 150000, percentage: 27 },
              { label: "ASWAN", value: 300000, percentage: 54 },
              { label: "HURGHADA", value: 550000, percentage: 100 },
              { label: "DAHAB", value: 400000, percentage: 72 },
              { label: "SIWA", value: 250000, percentage: 45 },
            ]}
            actions={<ExportButtons />}
          />
        </div>
        
        <div className={styles.rightColumn}>
          <ServiceRevenueChart />
        </div>
      </div>

      <RevenueByPartnerChart />
    </div>
  );
}
