"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import FinanceDateFilter from "@/components/dashboard/Finance/FinanceDateFilter/FinanceDateFilter";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import PaymentsTable from "../PaymentsTable/PaymentsTable";
import RevenueByCategory from "../RevenueByCategory/RevenueByCategory";
import RevenueChart from "../RevenueChart/RevenueChart";
import styles from "./PaymentsPage.module.scss";
import { useFinanceReport } from "@/hooks/useFinanceReport";
import { usePaymentStats } from "@/hooks/usePaymentStats";
import { useFinanceFilter } from "@/hooks/useFinanceFilter";
import { downloadBlobAsCSV } from "@/lib/utils";
import { formatCompactMetric, formatCountWithCommas, formatTrendPct } from "@/utils/formatMetric";

const CATEGORY_COLORS: Record<string, string> = {
  Trip: "#8DC1FF",
  Hotel: "#FFC6A0",
  Transport: "#FFD1DE",
  "Custom trip": "#E9BDFF",
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
    const totalRev = (parseFloat(m.trip) || 0) + (parseFloat(m.hotel) || 0) + (parseFloat(m.transport) || 0) + (parseFloat(m.custom_trip) || 0);
    lines.push(`"${m.month}",$${totalRev.toFixed(2)}`);
  });

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  downloadBlobAsCSV(blob, "finance_report_summary.csv");
};

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const filterParams = useFinanceFilter();
  const rangeKey = filterParams.range === "custom" ? "custom" : filterParams.range || "ytd";
  const { data, loading } = useFinanceReport(rangeKey, filterParams.date_from, filterParams.date_to);
  const { data: statsData } = usePaymentStats(
    filterParams.date_from || filterParams.date_to
      ? { date_from: filterParams.date_from, date_to: filterParams.date_to }
      : undefined
  );

  const revenueByCatMap: Record<string, any> = data?.revenue_by_category || statsData?.revenue_by_category || {};

  const getCatValue = (category: string): number => {
    if (category === "custom_trip") {
      const val =
        revenueByCatMap.custom_trip ??
        revenueByCatMap.custom_trips ??
        revenueByCatMap.custom ??
        revenueByCatMap.plan_your_trip ??
        revenueByCatMap["Custom trip"] ??
        revenueByCatMap["Custom Trips"];
      return parseFloat(val || "0") || 0;
    }
    if (category === "transport") {
      const val = revenueByCatMap.transport ?? revenueByCatMap.transportation;
      return parseFloat(val || "0") || 0;
    }
    if (category === "trip") {
      const val = revenueByCatMap.trip ?? revenueByCatMap.trips;
      return parseFloat(val || "0") || 0;
    }
    if (category === "hotel") {
      const val = revenueByCatMap.hotel ?? revenueByCatMap.hotels;
      return parseFloat(val || "0") || 0;
    }
    return parseFloat(revenueByCatMap[category] || "0") || 0;
  };

  const ORDERED_CATEGORIES = [
    { key: "trip", label: "Trips", color: CATEGORY_COLORS.Trip },
    { key: "hotel", label: "Hotels", color: CATEGORY_COLORS.Hotel },
    { key: "transport", label: "Transportation", color: CATEGORY_COLORS.Transport },
    { key: "custom_trip", label: "Custom Trip", color: CATEGORY_COLORS["Custom trip"] },
  ];

  const categoryData = ORDERED_CATEGORIES.map(({ key, label, color }) => ({
    label,
    value: getCatValue(key),
    color,
  }));
  
  const totalCatVal = categoryData.reduce((acc: number, curr: any) => acc + curr.value, 0);
  const chartDataNormalized = categoryData.map((c: any) => ({
    ...c,
    value: totalCatVal > 0 ? Math.round((c.value / totalCatVal) * 100) : 0
  }));

  const heatmapRaw: any[] = data?.seasonal_heatmap || [];
  const heatmapData = heatmapRaw.map(d => {
    const dateObj = new Date(d.month);
    const label = dateObj.toLocaleString('en-US', { month: 'short' });
    const totalRev = (parseFloat(d.trip) || 0) + (parseFloat(d.hotel) || 0) + (parseFloat(d.transport) || 0) + (parseFloat(d.custom_trip) || 0);
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

  const revenueLabel =
    filterParams.range === "today"
      ? "Total Revenue (Today)"
      : filterParams.range === "this_week"
      ? "Total Revenue (This Week)"
      : filterParams.range === "this_month"
      ? "Total Revenue (This Month)"
      : filterParams.range === "custom"
      ? "Total Revenue (Custom)"
      : "Total Revenue (YTD)";

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
        customFilterDropdown={<FinanceDateFilter />}
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
          label={revenueLabel}
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

      <PaymentsTable
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery("")}
        date_from={filterParams.date_from}
        date_to={filterParams.date_to}
      />
    </>
  );
}
