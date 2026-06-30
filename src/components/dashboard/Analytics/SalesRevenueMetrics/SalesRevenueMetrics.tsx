import MetricCard from "@/components/dashboard/DashboardHome/MetricCard/MetricCard";
import type { MetricCardData } from "@/components/dashboard/DashboardHome/types";
import styles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";

const metrics: MetricCardData[] = [
  {
    label: "Total Bookings",
    value: "1,284",
    change: "+12.5%",
    trend: "up",
    tone: "blue",
    icon: "reports/calendar",
    spark: ""
  },
  {
    label: "Total Revenue",
    value: "$ 284,50",
    change: "+8.2%",
    trend: "up",
    tone: "green",
    icon: "finance/payment/total",
    spark: ""
  },
  {
    label: "Avg Booking Value",
    value: "$12,633",
    change: "+18.3%",
    trend: "up",
    tone: "purple",
    icon: "reports/profile",
    spark: ""
  }
];

export default function SalesRevenueMetrics() {
  return (
    <div className={styles.metricsGrid}>
      {metrics.map(card => (
        <MetricCard key={card.label} card={card} />
      ))}
    </div>
  );
}
