import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { leadSummaryMetrics } from "../leadsInquiriesData";
import styles from "./LeadSummaryGrid.module.scss";

export default function LeadSummaryGrid() {
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
