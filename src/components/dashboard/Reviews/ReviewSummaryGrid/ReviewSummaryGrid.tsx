import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { reviewSummaryMetrics, adminTestimonialMetrics } from "../reviewsData";
import styles from "./ReviewSummaryGrid.module.scss";

interface ReviewSummaryGridProps {
  type?: "user" | "admin";
}

export default function ReviewSummaryGrid({ type = "user" }: ReviewSummaryGridProps) {
  const metrics = type === "admin" ? adminTestimonialMetrics : reviewSummaryMetrics;

  return (
    <section className={styles.grid} aria-label="Review summary metrics">
      {metrics.map((metric) => (
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
