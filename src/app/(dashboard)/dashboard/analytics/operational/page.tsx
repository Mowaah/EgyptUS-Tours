"use client";

import RevenueByDestinationChart from "@/components/dashboard/shared/RevenueByDestinationChart/RevenueByDestinationChart";
import HotelOccupancyChart from "@/components/dashboard/Analytics/HotelOccupancyChart/HotelOccupancyChart";
import BookingsByServiceChart from "@/components/dashboard/Analytics/BookingsByServiceChart/BookingsByServiceChart";
import FleetUtilizationChart from "@/components/dashboard/shared/FleetUtilizationChart/FleetUtilizationChart";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";
import styles from "@/components/dashboard/Analytics/ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";

export default function OperationalReportsPage() {
  return (
    <div className={styles.chartsGrid}>
      <div className={styles.leftColumn}>
        <RevenueByDestinationChart 
          title="Top Destinations in Egypt"
          subtitle="Overview of bookings to different Places"
          icon="reports/top_destinations"
          gridLabels={["0", "200", "400", "600", "800", "1000", "1200"]}
          tooltipFormat="booking"
          maxValue={1200}
          data={[
            { label: "LUXOR", value: 710, percentage: 59 },
            { label: "ASWAN", value: 620, percentage: 51 },
            { label: "HURGHADA", value: 1120, percentage: 93 },
            { label: "DAHAB", value: 720, percentage: 60 },
            { label: "SIWA", value: 710, percentage: 59 },
          ]}
          actions={<ExportButtons />}
        />
        
        <HotelOccupancyChart />
      </div>
      
      <div className={styles.rightColumn}>
        <BookingsByServiceChart />
        
        <FleetUtilizationChart 
          title="Fleet Utilization"
          subtitle="Approximate vehicle utilization %"
          showBanner={false}
          actions={<ExportButtons />}
        />
      </div>
    </div>
  );
}
