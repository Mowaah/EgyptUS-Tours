"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import PaymentsTable from "../PaymentsTable/PaymentsTable";
import RevenueByCategory from "../RevenueByCategory/RevenueByCategory";
import RevenueChart from "../RevenueChart/RevenueChart";
import styles from "./PaymentsPage.module.scss";
import { useFinanceReport } from "@/hooks/useFinanceReport";
import { usePaymentStats } from "@/hooks/usePaymentStats";
import { downloadBlobAsCSV } from "@/lib/utils";
import { formatCompactMetric, formatCountWithCommas, formatTrendPct } from "@/utils/formatMetric";

const CATEGORY_COLORS: Record<string, string> = {
  Trip: "#A1CCFF",
  Hotel: "#FFC6A0",
  Transport: "#E9BDFF",
  "Custom trip": "#D8F3DC",
};

const exportFinanceReportToCSV = (data: any, statsData?: any) => {
  if (!data && !statsData) return;
  const lines = [];
  lines.push("Metric,Value");
  lines.push(`Total Revenue,$${data?.total_revenue || 0}`);
  lines.push(`Total Transactions,${statsData?.total_transactions || data?.total_transactions || 0}`);
  lines.push(`Refunded Amount,$${statsData?.refunded_amount || data?.refunded_amount || 0}`);
  lines.push(`Revenue Growth,${statsData?.revenue_growth_pct || data?.revenue_growth_pct || 0}%`);
  
  lines.push("");
  lines.push("Category,Revenue");
  const revMap = data?.revenue_by_category || statsData?.revenue_by_category || {};
  Object.keys(revMap).forEach(k => {
    lines.push(`"${k}",$${revMap[k]}`);
  });

  lines.push("");
  lines.push("Month,Revenue");
  const heatmap = data?.seasonal_heatmap || [];
  heatmap.forEach((m: any) => {
    const totalRev = parseFloat(m.trip) + parseFloat(m.hotel) + parseFloat(m.transport) + parseFloat(m.custom_trip);
    lines.push(`"${m.month}",$${totalRev.toFixed(2)}`);
  });

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  downloadBlobAsCSV(blob, "finance_report_summary.csv");
};

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, loading } = useFinanceReport("ytd");
  const { data: statsData } = usePaymentStats();

  const revenueByCatMap = data?.revenue_by_category || {};
  const categoryData = Object.keys(revenueByCatMap)
    .filter((key) => ["trip", "hotel", "transport"].includes(key))
    .map((key) => {
      const valStr = revenueByCatMap[key];
      const valNum = parseFloat(valStr);
      const labelMap: Record<string, string> = { trip: "Trips", hotel: "Hotels", transport: "Transportation" };
      const colorMap: Record<string, string> = { trip: "Trip", hotel: "Hotel", transport: "Transport" };
      return {
        label: labelMap[key] || key,
        value: valNum,
        color: CATEGORY_COLORS[colorMap[key]] || "#ccc",
      };
    });
  
  const totalCatVal = categoryData.reduce((acc: number, curr: any) => acc + curr.value, 0);
  const chartDataNormalized = categoryData.map((c: any) => ({
    ...c,
    value: totalCatVal > 0 ? Math.round((c.value / totalCatVal) * 100) : 0
  }));

  const heatmapRaw: any[] = data?.seasonal_heatmap || [];
  const heatmapData = heatmapRaw.map(d => {
    const dateObj = new Date(d.month);
    const label = dateObj.toLocaleString('en-US', { month: 'short' });
    const totalRev = parseFloat(d.trip) + parseFloat(d.hotel) + parseFloat(d.transport) + parseFloat(d.custom_trip);
    return {
      label,
      value: totalRev
    };
  });
  
  // Condense if too many months, or keep all. Since it's ytd it's max 12.
  const maxVal = heatmapData.length > 0 ? Math.max(...heatmapData.map(d => d.value)) : 0;
  const seasonalData = heatmapData.map(d => ({
    label: d.label,
    value: d.value,
    heightPct: maxVal > 0 ? (d.value / maxVal) * 100 : 0
  }));

  const growthPct = statsData?.revenue_growth_pct || data?.revenue_growth_pct || "0";
  const totalRevenueVal = data?.total_revenue || statsData?.total_payments_mtd || "0";
  const transactionsVal = statsData?.total_transactions ?? data?.total_transactions ?? 0;
  const refundedVal = statsData?.refunded_amount ?? data?.refunded_amount ?? "0";
  const donutCenterVal = totalCatVal > 0 ? totalCatVal : totalRevenueVal;

  return (
    <>
      <DashboardNavbar
        breadcrumbTrail={[
          { label: "Finance", href: "/dashboard/finance/payments" },
          { label: "Payments" },
        ]}
        title="Payments"
        subtitle="Track and manage all payment transactions."
        searchPlaceholder="Search Customer, Booking ID, Payment ID"
        primaryAction={{
          label: "Export Report",
          iconSrc: "/images/dashboard/export2.svg",
        }}
        onPrimaryAction={() => exportFinanceReportToCSV(data, statsData)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className={styles.metricsGrid}>
        <SummaryCard
          label="Total Revenue (YTD)"
          value={formatCompactMetric(totalRevenueVal, true)}
          change={growthPct ? formatTrendPct(growthPct) : "0%"}
          trend={parseFloat(growthPct) >= 0 ? "up" : "down"}
          tone="green"
          iconSrc="/images/dashboard/finance/payment/total.svg"
        />
        <SummaryCard
          label="Total Transactions"
          value={formatCountWithCommas(transactionsVal)}
          change=""
          trend="up"
          tone="orange"
          iconSrc="/images/dashboard/finance/payment/total_transaction.svg"
        />
        <SummaryCard
          label="Refunded Amount"
          value={formatCompactMetric(refundedVal, true)}
          change=""
          trend="down"
          tone="gray"
          iconSrc="/images/dashboard/finance/payment/refunded.svg"
        />
        <SummaryCard
          label="Revenue Growth %"
          value={`${Math.round(parseFloat(growthPct))}%`}
          change=""
          trend={parseFloat(growthPct) >= 0 ? "up" : "down"}
          tone="pink"
          iconSrc="/images/dashboard/finance/payment/money.svg"
        />
      </div>

      <div className={styles.chartsGrid}>
        <RevenueChart chartData={seasonalData} />
        <RevenueByCategory chartData={chartDataNormalized} totalValue={formatCompactMetric(donutCenterVal, false)} />
      </div>

      <PaymentsTable searchQuery={searchQuery} onClearSearch={() => setSearchQuery("")} />
    </>
  );
}
