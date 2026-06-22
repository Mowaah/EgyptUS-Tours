"use client";

import MetricCard from "@/components/dashboard/DashboardHome/MetricCard/MetricCard";
import type { MetricCardData } from "@/components/dashboard/DashboardHome/types";
import styles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";

const metrics: MetricCardData[] = [
  {
    label: "Total Leads",
    value: "1800",
    change: "+12.5%",
    trend: "up",
    tone: "blue",
    icon: "reports/total_leads",
    spark: ""
  },
  {
    label: "Converted",
    value: "200",
    change: "+8.2%",
    trend: "up",
    tone: "green",
    icon: "reports/converted",
    spark: ""
  },
  {
    label: "Lost / Closed",
    value: "16",
    change: "-5.1%",
    trend: "down",
    tone: "orange",
    icon: "reports/lost",
    spark: ""
  },
  {
    label: "Conversion Rate",
    value: "60%",
    change: "+18.3%",
    trend: "up",
    tone: "purple",
    icon: "reports/conversion_rate",
    spark: ""
  }
];

export default function LeadConversionMetrics() {
  return (
    <div className={styles.metricsGridFour}>
      {metrics.map(card => (
        <MetricCard key={card.label} card={card} />
      ))}
    </div>
  );
}
