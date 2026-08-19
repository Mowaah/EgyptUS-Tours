import useSWR from "swr";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { getTransportationStats } from "@/services/admin/adminBookingsService";

import styles from "./TransportationSummaryGrid.module.scss";

export default function TransportationSummaryGrid() {
  const { data, isLoading } = useSWR(["adminTransportStats", "30d"], () => getTransportationStats("30d"));

  if (isLoading) {
    return <div className={styles.grid}>Loading metrics...</div>;
  }

  const parseTrend = (change: string) => change?.startsWith("-") ? "down" : "up";
  const metrics = [
    { label: "Total Transportation Bookings", value: data?.total?.toLocaleString() || "0", change: data?.trends?.total || "0%", trend: parseTrend(data?.trends?.total), tone: "pink", icon: "booking/trips/total" },
    { label: "Upcoming Transportation", value: data?.upcoming?.toLocaleString() || "0", change: data?.trends?.upcoming || "0%", trend: parseTrend(data?.trends?.upcoming), tone: "blue", icon: "booking/car" },
    { label: "Pending Deposits", value: data?.pending_deposits?.toLocaleString() || "0", change: data?.trends?.pending_deposits || "0%", trend: parseTrend(data?.trends?.pending_deposits), tone: "orange", icon: "booking/trips/pending" },
    { label: "Completed Transportation", value: data?.completed?.toLocaleString() || "0", change: data?.trends?.completed || "0%", trend: parseTrend(data?.trends?.completed), tone: "green", icon: "booking/trips/completed" }
  ];

  return (
    <section className={styles.grid} aria-label="Transportation summary metrics">
      {metrics.map((metric) => (
        <SummaryCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          change={metric.change}
          trend={metric.trend as "up" | "down"}
          tone={metric.tone as any}
          iconSrc={`/images/dashboard/${metric.icon}.svg`}
        />
      ))}
    </section>
  );
}
