import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { hotelSummaryMetrics } from "../hotelsData";
import styles from "./HotelsSummaryGrid.module.scss";

export default function HotelsSummaryGrid() {
  return (
    <section className={styles.grid} aria-label="Hotel summary metrics">
      {hotelSummaryMetrics.map((metric, index) => (
        <SummaryCard
          key={index}
          label={metric.label}
          value={metric.value}
          change={metric.change}
          trend={metric.trend}
          tone={metric.tone}
          iconSrc={metric.iconSrc}
        />
      ))}
    </section>
  );
}
