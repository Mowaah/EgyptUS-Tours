import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { reviewSummaryMetrics } from "../reviewsData";
import styles from "./ReviewSummaryGrid.module.scss";

export default function ReviewSummaryGrid() {
  return (
    <section className={styles.grid} aria-label="Review summary metrics">
      {reviewSummaryMetrics.map((metric) => (
        <SummaryCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          change={metric.change}
          trend={metric.trend}
          tone={metric.tone}
          iconSrc={`/images/dashboard/reviews/${metric.icon}.svg`}
        />
      ))}
    </section>
  );
}
