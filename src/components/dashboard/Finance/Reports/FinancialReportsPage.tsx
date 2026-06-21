"use client";

import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import ReportsTable from "./ReportsTable";
import RevenueByDestinationChart from "@/components/shared/RevenueByDestinationChart/RevenueByDestinationChart";
import SeasonalRevenueHeatmap from "./SeasonalRevenueHeatmap";
import FleetUtilizationChart from "@/components/shared/FleetUtilizationChart/FleetUtilizationChart";
import pageStyles from "@/app/(dashboard)/dashboard/page.module.scss";
import styles from "./FinancialReportsPage.module.scss";

export default function FinancialReportsPage() {
  return (
    <main className={pageStyles.page}>
      <DashboardSidebar />

      <section className={pageStyles.content} aria-label="Financial Reports content">
        <DashboardNavbar
          breadcrumbTrail={[
            { label: "Bookings", href: "#" },
            { label: "Financial Reports" },
          ]}
          title="Financial Reports"
          subtitle="Overview of financial performance across bookings and payments."
          searchPlaceholder="Search Customer, Booking ID, Payment ID"
          primaryAction={{
            label: "Export Report",
            iconSrc: "/images/dashboard/export2.svg"
          }}
        />

        <div className={styles.metricsGrid}>
          <SummaryCard
            label="Top Revenue Source"
            value="Trips"
            change="+8.2%"
            trend="up"
            tone="green"
            iconSrc="/images/dashboard/finance/payment/total.svg"
          />
          <SummaryCard
            label="Top Destination"
            value="Hurghada"
            change="+8.2%"
            trend="up"
            tone="orange"
            iconSrc="/images/dashboard/finance/payment/total_transaction.svg"
          />
          <SummaryCard
            label="Best Selling Package"
            value="Pyramids"
            change="-5.1%"
            trend="down"
            tone="pink"
            iconSrc="/images/dashboard/finance/payment/money.svg"
          />
        </div>

        <div className={styles.tableSection}>
          <ReportsTable />
        </div>

        <div className={styles.bottomGrid}>
          <div className={styles.leftColumn}>
            <RevenueByDestinationChart />
            <FleetUtilizationChart />
          </div>
          <div className={styles.rightColumn}>
            <SeasonalRevenueHeatmap />
          </div>
        </div>
      </section>
    </main>
  );
}
