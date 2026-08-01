"use client";

import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import DepositsTable from "../DepositsTable/DepositsTable";
import DepositStatusDonut from "../DepositStatusDonut/DepositStatusDonut";
import OverdueDepositsChart from "../OverdueDepositsChart/OverdueDepositsChart";
import pageStyles from "@/app/(dashboard)/dashboard/page.module.scss";
import styles from "./DepositsPage.module.scss";
import { useState } from "react";
import { useDepositStats } from "@/hooks/useDepositStats";
import { downloadBlobAsCSV } from "@/lib/utils";

const formatCurrencyK = (value: string | number) => {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : value;
  if (isNaN(num)) return "$0";
  if (num >= 1000) {
    return `$${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return `$${num}`;
};

const exportDepositsReportToCSV = (data: any) => {
  if (!data) return;
  const lines = [];
  lines.push("Metric,Value");
  lines.push(`Total Deposits Expected,"${data.total_expected || 0}"`);
  lines.push(`Collected Deposits,"${data.collected || 0}"`);
  lines.push(`Pending,"${data.pending || 0}"`);
  lines.push(`Overdue,"${data.overdue || 0}"`);
  
  lines.push("");
  lines.push("Category,Overdue");
  const revMap = data.overdue_by_service || {};
  Object.keys(revMap).forEach(k => {
    lines.push(`"${k}","${revMap[k]}"`);
  });

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  downloadBlobAsCSV(blob, "deposit_stats_summary.csv");
};

export default function DepositsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, loading } = useDepositStats();

  return (
    <>
      
      
        <DashboardNavbar
          breadcrumbTrail={[
            { label: "Finance", href: "/dashboard/finance/deposits" },
            { label: "Deposits" },
          ]}
          title="Deposits"
          subtitle="Track deposit status for all bookings (30% policy)."
          searchPlaceholder="Search Customer, Booking ID, Payment ID"
          primaryAction={{
            label: "Export Report",
            iconSrc: "/images/dashboard/export2.svg"
          }}
          onPrimaryAction={() => exportDepositsReportToCSV(data)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className={styles.metricsGrid}>
          <SummaryCard
            label="Total Deposits Expected"
            value={formatCurrencyK(data?.total_expected || 0)}
            change=""
            trend="up"
            tone="green"
            iconSrc="/images/dashboard/finance/payment/total.svg"
          />
          <SummaryCard
            label="Collected Deposits"
            value={formatCurrencyK(data?.collected || 0)}
            change=""
            trend="up"
            tone="orange"
            iconSrc="/images/dashboard/finance/payment/total_transaction.svg"
          />
          <SummaryCard
            label="Pending"
            value={formatCurrencyK(data?.pending || 0)}
            change=""
            trend="down"
            tone="pink"
            iconSrc="/images/dashboard/finance/payment/money.svg"
          />
          <SummaryCard
            label="Overdue"
            value={formatCurrencyK(data?.overdue || 0)}
            change=""
            trend="down"
            tone="gray"
            iconSrc="/images/dashboard/finance/payment/refunded.svg"
          />
        </div>

        <div className={styles.chartsGrid}>
          <OverdueDepositsChart chartData={data?.overdue_by_service} />
          <DepositStatusDonut chartData={data?.deposit_status_distribution} />
        </div>

        <DepositsTable searchQuery={searchQuery} onClearSearch={() => setSearchQuery("")} />
      
    </>
  );
}
