import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { tripSummaryMetrics } from "../tripsData";
import styles from "./TripsSummaryGrid.module.scss";

export default function TripsSummaryGrid() {
  return (
    <section className={styles.grid} aria-label="Trip summary metrics">
      {tripSummaryMetrics.map((metric) => (
        <SummaryCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          change={metric.change}
          trend={metric.trend}
          tone={metric.tone}
          iconSrc={`/images/dashboard/${metric.icon}.svg`}
        />
      ))}
    </section>
  );
}
