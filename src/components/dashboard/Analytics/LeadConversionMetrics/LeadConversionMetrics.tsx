import MetricCard from "@/components/dashboard/DashboardHome/MetricCard/MetricCard";
import type { MetricCardData } from "@/components/dashboard/DashboardHome/types";
import styles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import { LeadsKpis } from "@/services/admin/adminReportsService";

interface LeadConversionMetricsProps {
  kpis?: LeadsKpis;
}

export default function LeadConversionMetrics({ kpis }: LeadConversionMetricsProps) {
  const metrics: MetricCardData[] = kpis
    ? [
        {
          label: "Total Leads",
          value: kpis.total_leads.value.toString(),
          change: kpis.total_leads.trend_pct,
          trend: (kpis.total_leads.trend_pct || "").startsWith("-") ? "down" : "up",
          tone: "blue",
          icon: "reports/total_leads",
          spark: "",
        },
        {
          label: "Converted",
          value: kpis.converted.value.toString(),
          change: kpis.converted.trend_pct,
          trend: (kpis.converted.trend_pct || "").startsWith("-") ? "down" : "up",
          tone: "green",
          icon: "reports/converted",
          spark: "",
        },
        {
          label: "Lost / Closed",
          value: kpis.lost.value.toString(),
          change: kpis.lost.trend_pct,
          trend: (kpis.lost.trend_pct || "").startsWith("-") ? "down" : "up",
          tone: "orange",
          icon: "reports/lost",
          spark: "",
        },
        {
          label: "Conversion Rate",
          value: kpis.conversion_rate.value.toString(),
          change: kpis.conversion_rate.trend_pct,
          trend: (kpis.conversion_rate.trend_pct || "").startsWith("-") ? "down" : "up",
          tone: "purple",
          icon: "reports/conversion_rate",
          spark: "",
        },
      ]
    : [];

  return (
    <div className={styles.metricsGridFour}>
      {metrics.map((card) => (
        <MetricCard key={card.label} card={card} />
      ))}
    </div>
  );
}
