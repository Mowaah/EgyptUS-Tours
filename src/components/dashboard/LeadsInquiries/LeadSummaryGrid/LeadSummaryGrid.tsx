import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { useLeadStats } from "@/hooks/useLeads";
import styles from "./LeadSummaryGrid.module.scss";

export default function LeadSummaryGrid() {
  const { data: stats } = useLeadStats();

  if (!stats) return null;

  const leadSummaryMetrics = [
    {
      label: "Total Leads",
      value: stats.total.toString(),
      change: `${stats.trends.total > 0 ? "+" : ""}${stats.trends.total}%`,
      trend: stats.trends.total >= 0 ? "up" as const : "down" as const,
      tone: "blue" as const,
      icon: "total_leads",
    },
    {
      label: "New Leads",
      value: stats.new.toString(),
      change: `${stats.trends.new > 0 ? "+" : ""}${stats.trends.new}%`,
      trend: stats.trends.new >= 0 ? "up" as const : "down" as const,
      tone: "orange" as const,
      icon: "new_leads",
    },
    {
      label: "In Progress Leads",
      value: stats.in_progress.toString(),
      change: `${stats.trends.in_progress > 0 ? "+" : ""}${stats.trends.in_progress}%`,
      trend: stats.trends.in_progress >= 0 ? "up" as const : "down" as const,
      tone: "pink" as const,
      icon: "in_progress",
    },
    {
      label: "Converted Leads",
      value: stats.converted.toString(),
      change: `${stats.trends.converted > 0 ? "+" : ""}${stats.trends.converted}%`,
      trend: stats.trends.converted >= 0 ? "up" as const : "down" as const,
      tone: "purple" as const,
      icon: "converted_leads",
    },
  ];

  return (
    <section className={styles.grid} aria-label="Lead summary metrics">
      {leadSummaryMetrics.map((metric) => (
        <SummaryCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          change={metric.change}
          trend={metric.trend}
          tone={metric.tone}
          iconSrc={`/images/dashboard/inquiries/${metric.icon}.svg`}
        />
      ))}
    </section>
  );
}
