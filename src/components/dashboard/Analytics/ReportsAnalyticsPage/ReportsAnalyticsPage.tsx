"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import DashboardTabs from "@/components/shared/DashboardTabs/DashboardTabs";
import RevenueByDestinationChart from "@/components/shared/RevenueByDestinationChart/RevenueByDestinationChart";
import FleetUtilizationChart from "@/components/shared/FleetUtilizationChart/FleetUtilizationChart";
import BookingsByServiceChart from "../BookingsByServiceChart/BookingsByServiceChart";
import HotelOccupancyChart from "../HotelOccupancyChart/HotelOccupancyChart";
import ServiceRevenueChart from "../ServiceRevenueChart/ServiceRevenueChart";
import SalesRevenueMetrics from "../SalesRevenueMetrics/SalesRevenueMetrics";
import RevenueByPartnerChart from "../RevenueByPartnerChart/RevenueByPartnerChart";
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

        {activeTab === "sales" && (
          <div className={styles.salesTab}>
            <SalesRevenueMetrics />
            
            <div className={styles.chartsGrid}>
              <div className={styles.leftColumn}>
                <RevenueByDestinationChart 
                  title="Revenue by Destination"
                  icon="sidebar/locations"
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
        )}
      </section>
    </main>
  );
}
