import useSWR from "swr";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { getHotelStats } from "@/services/admin/adminBookingsService";

import styles from "./HotelsSummaryGrid.module.scss";

export default function HotelsSummaryGrid() {
  const { data, isLoading } = useSWR(["adminHotelStats", "30d"], () => getHotelStats("30d"));

  if (isLoading) {
    return <div className={styles.grid}>Loading metrics...</div>;
  }

  const parseTrend = (change: string) => change?.startsWith("-") ? "down" : "up";
  const metrics = [
    { label: "Total Hotel Bookings", value: data?.total?.toLocaleString() || "0", change: data?.trends?.total || "0%", trend: parseTrend(data?.trends?.total), tone: "pink", iconSrc: "/images/dashboard/booking/trips/total.svg" },
    { label: "Upcoming Bookings", value: data?.upcoming?.toLocaleString() || "0", change: data?.trends?.upcoming || "0%", trend: parseTrend(data?.trends?.upcoming), tone: "blue", iconSrc: "/images/dashboard/booking/hotels/upcoming_bookins.svg" },
    { label: "Pending Deposits", value: data?.pending_deposits?.toLocaleString() || "0", change: data?.trends?.pending_deposits || "0%", trend: parseTrend(data?.trends?.pending_deposits), tone: "orange", iconSrc: "/images/dashboard/booking/trips/pending.svg" },
    { label: "Completed Bookings", value: data?.completed?.toLocaleString() || "0", change: data?.trends?.completed || "0%", trend: parseTrend(data?.trends?.completed), tone: "green", iconSrc: "/images/dashboard/booking/trips/completed.svg" },
  ];

  return (
    <section className={styles.grid} aria-label="Hotel summary metrics">
      {metrics.map((metric, index) => (
        <SummaryCard
          key={index}
          label={metric.label}
          value={metric.value}
          change={metric.change}
          trend={metric.trend as any}
          tone={metric.tone as any}
          iconSrc={metric.iconSrc}
        />
      ))}
    </section>
  );
}
