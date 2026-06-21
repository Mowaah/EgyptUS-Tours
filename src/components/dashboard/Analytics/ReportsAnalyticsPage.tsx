"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import DashboardTabs from "@/components/shared/DashboardTabs/DashboardTabs";
import RevenueByDestinationChart from "@/components/shared/RevenueByDestinationChart/RevenueByDestinationChart";
import FleetUtilizationChart from "@/components/shared/FleetUtilizationChart/FleetUtilizationChart";
import BookingsByServiceChart from "./BookingsByServiceChart";
import HotelOccupancyChart from "./HotelOccupancyChart";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";

import pageStyles from "@/app/(dashboard)/dashboard/page.module.scss";
import styles from "./ReportsAnalyticsPage.module.scss";

const tabs = [
  { id: "operational", label: "Operational Reports" },
  { id: "sales", label: "Sales & Revenue" },
  { id: "lead", label: "Lead & Conversion" },
  { id: "customer", label: "Customer Reports" },
  { id: "mice", label: "MICE-Specific Reports" },
];

export default function ReportsAnalyticsPage() {
  const [activeTab, setActiveTab] = useState("operational");

  return (
    <main className={pageStyles.page}>
      <DashboardSidebar />

      <section className={pageStyles.content} aria-label="Reports & Analytics content">
        <DashboardNavbar
          title="Reports & Analytics"
          subtitle="Comprehensive reports across customers, operations, sales, and leads — plus a custom builder."
          searchPlaceholder="Search bookings, customers..."
        />

        <DashboardTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === "operational" && (
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
        )}
      </section>
    </main>
  );
}
