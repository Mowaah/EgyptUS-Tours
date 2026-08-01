"use client";

import Image from "next/image";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import PaymentsTable from "../PaymentsTable/PaymentsTable";
import RevenueByCategory from "../RevenueByCategory/RevenueByCategory";
import RevenueChart from "../RevenueChart/RevenueChart";
import pageStyles from "@/app/(dashboard)/dashboard/page.module.scss";
import styles from "./PaymentsPage.module.scss";
import { useFinanceReport } from "@/hooks/useFinanceReport";
import { downloadBlobAsCSV } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  Trip: "#A1CCFF",
  Hotel: "#FFC6A0",
  Transport: "#E9BDFF",
  "Custom trip": "#D8F3DC",
};

function formatCurrency(amountStr: string | undefined): string {
  if (!amountStr) return "0";
  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount === 0) return "0";
  if (amount >= 1000) {
    return (amount / 1000).toFixed(1).replace(/\.0$/, '') + "k";
  }
  return amount.toFixed(0);
}

const exportFinanceReportToCSV = (data: any) => {
  if (!data) return;
  const lines = [];
  lines.push("Metric,Value");
  lines.push(`Total Revenue,$${data.total_revenue || 0}`);
  lines.push(`Total Transactions,${data.total_transactions || 0}`);
  lines.push(`Refunded Amount,$${data.refunded_amount || 0}`);
  lines.push(`Revenue Growth,${data.revenue_growth_pct || 0}%`);
  
  lines.push("");
  lines.push("Category,Revenue");
  const revMap = data.revenue_by_category || {};
  Object.keys(revMap).forEach(k => {
    lines.push(`"${k}",$${revMap[k]}`);
  });

  lines.push("");
  lines.push("Month,Revenue");
  const heatmap = data.seasonal_heatmap || [];
  heatmap.forEach((m: any) => {
    const totalRev = parseFloat(m.trip) + parseFloat(m.hotel) + parseFloat(m.transport) + parseFloat(m.custom_trip);
    lines.push(`"${m.month}",$${totalRev.toFixed(2)}`);
  });

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  downloadBlobAsCSV(blob, "finance_report_summary.csv");
};

import { useState } from "react";

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, loading } = useFinanceReport("ytd");

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
            iconSrc: "/images/dashboard/export2.svg"
          }}
          onPrimaryAction={() => exportFinanceReportToCSV(data)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className={styles.metricsGrid}>
          <SummaryCard
            label="Total Revenue (YTD)"
            value={`$${formatCurrency(data?.total_revenue)}`}
            change={data?.revenue_growth_pct ? `${parseFloat(data.revenue_growth_pct) > 0 ? "+" : ""}${data.revenue_growth_pct}%` : "0%"}
            trend={parseFloat(data?.revenue_growth_pct || "0") >= 0 ? "up" : "down"}
            tone="green"
            iconSrc="/images/dashboard/finance/payment/total.svg"
          />
          <SummaryCard
            label="Total Transactions"
            value={data?.total_transactions?.toString() || "0"}
            change=""
            trend="up"
            tone="orange"
            iconSrc="/images/dashboard/finance/payment/total_transaction.svg"
          />
          <SummaryCard
            label="Refunded Amount"
            value={`$${formatCurrency(data?.refunded_amount)}`}
            change=""
            trend="down"
            tone="gray"
            iconSrc="/images/dashboard/finance/payment/refunded.svg"
          />
          <SummaryCard
            label="Revenue Growth %"
            value={`${data?.revenue_growth_pct || "0"}%`}
            change=""
            trend={parseFloat(data?.revenue_growth_pct || "0") >= 0 ? "up" : "down"}
            tone="pink"
            iconSrc="/images/dashboard/finance/payment/chart.svg"
          />
        </div>

        <div className={styles.chartsGrid}>
          <RevenueChart chartData={seasonalData} />
          <RevenueByCategory chartData={chartDataNormalized} totalValue={formatCurrency(data?.total_revenue)} />
        </div>

        <PaymentsTable searchQuery={searchQuery} onClearSearch={() => setSearchQuery("")} />
      
    </>
  );
}
