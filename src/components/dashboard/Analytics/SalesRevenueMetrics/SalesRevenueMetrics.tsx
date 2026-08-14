import MetricCard from "@/components/dashboard/DashboardHome/MetricCard/MetricCard";
import type { MetricCardData } from "@/components/dashboard/DashboardHome/types";
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
          value: kpis.total_bookings.value.toString(),
          change: kpis.total_bookings.trend_pct,
          trend: (kpis.total_bookings.trend_pct || "").startsWith("-") ? "down" : "up",
          tone: "blue",
          icon: "reports/calendar",
          spark: "",
        },
        {
          label: "Total Revenue",
          value: `$${kpis.total_revenue.value.toString()}`,
          change: kpis.total_revenue.trend_pct,
          trend: (kpis.total_revenue.trend_pct || "").startsWith("-") ? "down" : "up",
          tone: "green",
          icon: "finance/payment/total",
          spark: "",
        },
        {
          label: "Avg Booking Value",
          value: `$${kpis.avg_booking_value.value.toString()}`,
          change: kpis.avg_booking_value.trend_pct,
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
