"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import ReportsTable from "../ReportsTable/ReportsTable";
import RevenueByDestinationChart from "@/components/dashboard/shared/RevenueByDestinationChart/RevenueByDestinationChart";
import SeasonalRevenueHeatmap from "../SeasonalRevenueHeatmap/SeasonalRevenueHeatmap";
import FleetUtilizationChart from "@/components/dashboard/shared/FleetUtilizationChart/FleetUtilizationChart";
import { useFinanceReport } from "@/hooks/useFinanceReport";
import styles from "./FinancialReportsPage.module.scss";

const formatCurrencyK = (val: string | number) => {
  const num = typeof val === "string" ? parseFloat(val) : val;
  if (isNaN(num) || num === 0) return "$0";
  if (num >= 1000) {
    return `$${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return `$${num}`;
};

export default function FinancialReportsPage() {
  const [rangeKey, setRangeKey] = useState("last_12m");
  const { data, loading, handleExportCSV } = useFinanceReport(rangeKey);

  // Compute Top Source
  const categoryMap = data?.revenue_by_category || {};
  let topSourceKey = "Trips";
  let maxCatRev = -1;
  Object.keys(categoryMap).forEach((k) => {
    const val = parseFloat(categoryMap[k] || "0");
    if (val > maxCatRev) {
      maxCatRev = val;
      topSourceKey = k === "trip" ? "Trips" : k === "hotel" ? "Hotels" : k === "transport" ? "Transportation" : "MICE";
    }
  });

  // Compute Top Destination
  const destinations = data?.revenue_by_destination || [];
  const topDestName = destinations.length > 0 ? destinations[0].destination : "Cairo";

  // Map destination chart data
  const destinationChartData = destinations.map((d: any) => ({
    label: (d.destination || "Unassigned").toUpperCase(),
    value: parseFloat(d.total_revenue || "0"),
    percentage: 100,
  }));

  return (
    <>
      <DashboardNavbar
        breadcrumbTrail={[
          { label: "Finance", href: "/dashboard/finance/reports" },
          { label: "Financial Reports" },
        ]}
        title="Financial Reports"
        subtitle="Overview of financial performance across bookings and payments."
        searchPlaceholder="Search Customer, Booking ID, Payment ID"
        primaryAction={{
          label: "Export Report",
          iconSrc: "/images/dashboard/export2.svg",
        }}
        onPrimaryAction={handleExportCSV}
      />

      <div className={styles.metricsGrid}>
        <SummaryCard
          label="Top Revenue Source"
          value={topSourceKey}
          tone="green"
          iconSrc="/images/dashboard/finance/payment/total.svg"
        />
        <SummaryCard
          label="Top Destination"
          value={topDestName}
          tone="orange"
          iconSrc="/images/dashboard/finance/payment/total_transaction.svg"
        />
        <SummaryCard
          label="Total Revenue"
          value={formatCurrencyK(data?.total_revenue || 0)}
          change={`${data?.revenue_growth_pct || "0"}%`}
          trend={parseFloat(data?.revenue_growth_pct || "0") >= 0 ? "up" : "down"}
          tone="pink"
          iconSrc="/images/dashboard/finance/payment/money.svg"
        />
      </div>

      <div className={styles.tableSection}>
        <ReportsTable data={destinations} />
      </div>

      <div className={styles.bottomGrid}>
        <div className={styles.leftColumn}>
          <RevenueByDestinationChart data={destinationChartData} />
          <FleetUtilizationChart fleetData={data?.fleet_revenue_by_vehicle_type} />
        </div>
        <div className={styles.rightColumn}>
          <SeasonalRevenueHeatmap heatmapData={data?.seasonal_heatmap} />
        </div>
      </div>
    </>
  );
}
