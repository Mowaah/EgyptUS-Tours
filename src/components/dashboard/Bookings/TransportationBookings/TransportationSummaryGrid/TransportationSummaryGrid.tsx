import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { transportationSummaryMetrics } from "../transportationData";
import styles from "./TransportationSummaryGrid.module.scss";

export default function TransportationSummaryGrid() {
  return (
    <section className={styles.grid} aria-label="Transportation summary metrics">
      {transportationSummaryMetrics.map((metric) => (
        <SummaryCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          change={metric.change}
          trend={metric.trend as any}
          tone={metric.tone as any}
          iconSrc={`/images/dashboard/${metric.icon}.svg`}
        />
      ))}
    </section>
  );
}
