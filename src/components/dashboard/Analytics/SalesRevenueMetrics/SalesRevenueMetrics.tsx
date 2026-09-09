import MetricCard from "@/components/dashboard/DashboardHome/MetricCard/MetricCard";
import type { MetricCardData } from "@/components/dashboard/DashboardHome/types";
import { formatCompactMetric, formatTrendPct } from "@/utils/formatMetric";
import styles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import { SalesKpis } from "@/services/admin/adminReportsService";

interface SalesRevenueMetricsProps {
  kpis?: SalesKpis;
}

export default function SalesRevenueMetrics({ kpis }: SalesRevenueMetricsProps) {
  const metrics: MetricCardData[] = kpis
    ? [
        {
          label: "Total Bookings",
          value: formatCompactMetric(kpis.total_bookings.value, false),
          change: formatTrendPct(kpis.total_bookings.trend_pct),
          trend: (kpis.total_bookings.trend_pct || "").startsWith("-") ? "down" : "up",
          tone: "blue",
          icon: "reports/calendar",
          spark: "",
        },
        {
          label: "Total Revenue",
          value: formatCompactMetric(kpis.total_revenue.value, true),
          change: formatTrendPct(kpis.total_revenue.trend_pct),
          trend: (kpis.total_revenue.trend_pct || "").startsWith("-") ? "down" : "up",
          tone: "green",
          icon: "finance/payment/total",
          spark: "",
        },
        {
          label: "Avg Booking Value",
          value: formatCompactMetric(kpis.avg_booking_value.value, true),
          change: formatTrendPct(kpis.avg_booking_value.trend_pct),
          trend: (kpis.avg_booking_value.trend_pct || "").startsWith("-") ? "down" : "up",
          tone: "purple",
          icon: "reports/profile",
          spark: "",
        },
      ]
    : [];

  return (
    <div className={styles.metricsGrid}>
      {metrics.map((card) => (
        <MetricCard key={card.label} card={card} />
      ))}
    </div>
  );
}
