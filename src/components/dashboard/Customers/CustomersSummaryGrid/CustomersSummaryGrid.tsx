import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { mockCustomerSummary } from "../customersData";
import styles from "./CustomersSummaryGrid.module.scss";

export default function CustomersSummaryGrid() {
  return (
    <section className={styles.grid} aria-label="Customer summary metrics">
      {mockCustomerSummary.map((metric) => (
        <SummaryCard
          key={metric.label}
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
