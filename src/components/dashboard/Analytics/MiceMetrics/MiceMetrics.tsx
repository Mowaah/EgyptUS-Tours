"use client";

import MetricCard from "@/components/dashboard/DashboardHome/MetricCard/MetricCard";
import type { MetricCardData } from "@/components/dashboard/DashboardHome/types";
import styles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";

export default function MiceMetrics() {
  const metrics: MetricCardData[] = [
    {
      label: "RFPs Received",
      value: "80",
      change: "+12.5%",
      trend: "up",
      tone: "blue",
      icon: "reports/total_leads",
      spark: ""
    },
    {
      label: "Proposals Sent",
      value: "400",
      change: "+8.2%",
      trend: "up",
      tone: "green",
      icon: "reports/converted",
      spark: ""
    },
    {
      label: "Contracts Signed",
      value: "80",
      change: "+18.3%",
      trend: "up",
      tone: "purple",
      icon: "reports/conversion_rate",
      spark: ""
    },
  ];

  return (
    <div className={styles.metricsGrid}>
      {metrics.map((card) => (
        <MetricCard key={card.label} card={card} />
      ))}
    </div>
  );
}
