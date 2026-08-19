import useSWR from "swr";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { getTripStats } from "@/services/admin/adminBookingsService";
import { TripSummaryMetric } from "../types";
import styles from "./TripsSummaryGrid.module.scss";

export default function TripsSummaryGrid() {
  const { data, isLoading } = useSWR(["adminTripStats", "30d"], () => getTripStats("30d"));

  if (isLoading) {
    return <div className={styles.grid}>Loading metrics...</div>;
  }

  const parseTrend = (change: string) => change?.startsWith("-") ? "down" : "up";
  const metrics = [
    { label: "Total Trip Bookings", value: data?.total?.toLocaleString() || "0", change: data?.trends?.total || "0%", trend: parseTrend(data?.trends?.total), tone: "pink", icon: "booking/trips/total" },
    { label: "Upcoming Trips", value: data?.upcoming?.toLocaleString() || "0", change: data?.trends?.upcoming || "0%", trend: parseTrend(data?.trends?.upcoming), tone: "blue", icon: "booking/trips/upcoming" },
    { label: "Pending Deposits", value: data?.pending_deposits?.toLocaleString() || "0", change: data?.trends?.pending_deposits || "0%", trend: parseTrend(data?.trends?.pending_deposits), tone: "orange", icon: "booking/trips/pending" },
    { label: "Completed Trips", value: data?.completed?.toLocaleString() || "0", change: data?.trends?.completed || "0%", trend: parseTrend(data?.trends?.completed), tone: "green", icon: "booking/trips/completed" },
  ];

  return (
    <section className={styles.grid} aria-label="Trip summary metrics">
      {metrics.map((metric) => (
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
