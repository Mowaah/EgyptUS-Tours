import SummaryCard from "@/components/dashboard/SummaryCard/SummaryCard";
import styles from "./RequestsSummaryGrid.module.scss";
import { RequestStats } from "@/hooks/useRequestStats";

interface RequestsSummaryGridProps {
  stats: RequestStats;
}

export default function RequestsSummaryGrid({ stats }: RequestsSummaryGridProps) {
  return (
    <div className={styles.summaryGrid}>
      <SummaryCard
        label="Total Requests"
        value={stats.total.toLocaleString()}
        change="+0.0%"
        trend="up"
        tone="green"
        iconSrc="/images/dashboard/requests/plan-your-trip/total.svg"
      />
      <SummaryCard
        label="Completed Requests"
        value={stats.completed.toLocaleString()}
        change="+0.0%"
        trend="up"
        tone="blue"
        iconSrc="/images/dashboard/requests/plan-your-trip/completed.svg"
      />
      <SummaryCard
        label="In Progress Requests"
        value={stats.in_progress.toLocaleString()}
        change="+0.0%"
        trend="up"
        tone="orange"
        iconSrc="/images/dashboard/requests/plan-your-trip/in-progress.svg"
      />
      <SummaryCard
        label="Rejected Requests"
        value={stats.rejected.toLocaleString()}
        change="+0.0%"
        trend="down"
        tone="red"
        iconSrc="/images/dashboard/requests/plan-your-trip/rejected.svg"
      />
    </div>
  );
}
