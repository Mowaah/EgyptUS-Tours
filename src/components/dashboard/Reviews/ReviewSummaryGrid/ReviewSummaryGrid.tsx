import { useEffect, useState } from "react";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { getAdminUserReviewsStats, getAdminTestimonialsStats } from "@/services/admin/adminReviewsService";
import type { ReviewSummaryMetric } from "../types";
import styles from "./ReviewSummaryGrid.module.scss";

interface ReviewSummaryGridProps {
  type?: "user" | "admin";
  refreshTrigger?: number;
}

export default function ReviewSummaryGrid({ type = "user", refreshTrigger = 0 }: ReviewSummaryGridProps) {
  const [metrics, setMetrics] = useState<ReviewSummaryMetric[]>([]);

  useEffect(() => {
    async function loadStats() {
      try {
        if (type === "user") {
          const stats = await getAdminUserReviewsStats({ range: "30d" });
          setMetrics([
            { label: "Total Reviews", value: stats.total.toString(), change: stats.trends.total, trend: stats.trends.total.startsWith("-") ? "down" : "up", tone: "green", icon: "total-reviews" },
            { label: "Approved", value: stats.approved.toString(), change: stats.trends.approved, trend: stats.trends.approved.startsWith("-") ? "down" : "up", tone: "blue", icon: "approved" },
            { label: "Pending", value: stats.pending.toString(), change: stats.trends.pending, trend: stats.trends.pending.startsWith("-") ? "down" : "up", tone: "pink", icon: "pending" },
            { label: "Published", value: stats.featured.toString(), change: stats.trends.featured, trend: stats.trends.featured.startsWith("-") ? "down" : "up", tone: "orange", icon: "featured" },
          ]);
        } else {
          const stats = await getAdminTestimonialsStats({ range: "30d" });
          setMetrics([
            { label: "Total Testimonials", value: stats.total.toString(), change: stats.trends.total, trend: stats.trends.total.startsWith("-") ? "down" : "up", tone: "green", icon: "total-reviews" },
            { label: "Published Testimonials", value: stats.published.toString(), change: stats.trends.published, trend: stats.trends.published.startsWith("-") ? "down" : "up", tone: "blue", icon: "approved" },
            { label: "Unpublished Testimonials", value: stats.draft.toString(), change: stats.trends.draft, trend: stats.trends.draft.startsWith("-") ? "down" : "up", tone: "pink", icon: "pending" },
          ]);
        }
      } catch (error) {
        console.error("Failed to load review stats", error);
      }
    }
    loadStats();
  }, [type, refreshTrigger]);

  if (metrics.length === 0) return null;

  return (
    <section className={styles.grid} data-count={metrics.length} aria-label="Review summary metrics">
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
