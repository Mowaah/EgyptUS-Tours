import MetricCard from "@/components/dashboard/DashboardHome/MetricCard/MetricCard";
import type { MetricCardData } from "@/components/dashboard/DashboardHome/types";
import styles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import type { SalesKpiData } from "@/services/admin/adminReportsService";

interface MiceMetricsProps {
  kpis?: {
    rfps_received: SalesKpiData;
    proposals_sent: SalesKpiData;
    contracts_signed: SalesKpiData;
  };
}

export default function MiceMetrics({ kpis }: MiceMetricsProps) {
  const metrics: MetricCardData[] = [
    {
      label: "RFPs Received",
      value: kpis?.rfps_received?.value?.toString() || "0",
      change: kpis?.rfps_received?.trend_pct || "0%",
      trend: (kpis?.rfps_received?.trend_pct || "").startsWith("-") ? "down" : "up",
      tone: "blue",
      icon: "reports/total_leads",
      spark: ""
    },
    {
      label: "Proposals Sent",
      value: kpis?.proposals_sent?.value?.toString() || "0",
      change: kpis?.proposals_sent?.trend_pct || "0%",
      trend: (kpis?.proposals_sent?.trend_pct || "").startsWith("-") ? "down" : "up",
      tone: "green",
      icon: "reports/proposals",
      spark: ""
    },
    {
      label: "Contracts Signed",
      value: kpis?.contracts_signed?.value?.toString() || "0",
      change: kpis?.contracts_signed?.trend_pct || "0%",
      trend: (kpis?.contracts_signed?.trend_pct || "").startsWith("-") ? "down" : "up",
      tone: "purple",
      icon: "reports/contracts",
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
