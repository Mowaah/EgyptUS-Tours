import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { useAdminCustomerStats } from "@/hooks/useCustomers";
import styles from "./CustomersSummaryGrid.module.scss";

export default function CustomersSummaryGrid() {
  const { stats, isLoading, isError } = useAdminCustomerStats();

  if (isError) {
    return <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center", color: "red" }}>Failed to load stats</div>;
  }

  if (isLoading || !stats) {
    return <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>Loading stats...</div>;
  }

  const metrics = [
    { label: "Total Customers", value: stats.total.toString(), change: stats.trends.total, trend: (stats.trends.total.startsWith("-") ? "down" : "up") as "up"|"down", tone: "blue" as const, iconSrc: "/images/dashboard/customers/total.svg" },
    { label: "VIP Customers", value: stats.vip.toString(), change: stats.trends.vip, trend: (stats.trends.vip.startsWith("-") ? "down" : "up") as "up"|"down", tone: "green" as const, iconSrc: "/images/dashboard/customers/vip.svg" },
    { label: "Active Customers", value: stats.active.toString(), change: stats.trends.active, trend: (stats.trends.active.startsWith("-") ? "down" : "up") as "up"|"down", tone: "orange" as const, iconSrc: "/images/dashboard/customers/active.svg" },
    { label: "Inactive Customers", value: stats.inactive.toString(), change: stats.trends.inactive, trend: (stats.trends.inactive.startsWith("-") ? "down" : "up") as "up"|"down", tone: "gray" as const, iconSrc: "/images/dashboard/customers/inactive.svg" },
  ];

  return (
    <section className={styles.grid} aria-label="Customer summary metrics">
      {metrics.map((metric) => (
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
