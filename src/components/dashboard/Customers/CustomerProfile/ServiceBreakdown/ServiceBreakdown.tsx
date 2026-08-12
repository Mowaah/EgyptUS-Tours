import Image from "next/image";
import RoundedDonutChart from "@/components/dashboard/shared/RoundedDonutChart/RoundedDonutChart";
import styles from "./ServiceBreakdown.module.scss";

export default function ServiceBreakdown({ data = {} }: { data?: Record<string, number> }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);

  // Map backend keys to colors and display labels
  const mapping: Record<string, { label: string; color: string; styleClass: string }> = {
    trip: { label: "Trips", color: "#93C5FD", styleClass: styles.dotBlue },
    hotel: { label: "Hotels", color: "#E9D5FF", styleClass: styles.dotPurple },
    transportation: { label: "Transportation", color: "#FDBA74", styleClass: styles.dotOrange },
  };

  const chartData = Object.entries(data)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      label: mapping[key.toLowerCase()]?.label || key,
      value: total > 0 ? Math.round((value / total) * 100) : 0,
      color: mapping[key.toLowerCase()]?.color || "#cccccc",
      styleClass: mapping[key.toLowerCase()]?.styleClass || styles.dotBlue,
    }))
    .sort((a, b) => b.value - a.value);

  // Default to 0% if no data
  if (chartData.length === 0) {
    chartData.push({ label: "None", value: 100, color: "#E5E7EB", styleClass: "" });
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Image src="/images/dashboard/customers/overview/service.svg" alt="" width={24} height={24} aria-hidden />
        </div>
        <div className={styles.headerText}>
          <h2>Service Breakdown</h2>
          <p>Outstanding payments grouped by service type.</p>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <RoundedDonutChart 
          data={chartData}
          centerValue={chartData.length > 0 && chartData[0].label !== "None" ? `${chartData[0].value}%` : "0%"}
          centerLabel={chartData.length > 0 && chartData[0].label !== "None" ? chartData[0].label : "No Bookings"}
        />
      </div>

      <div className={styles.legend}>
        {chartData.filter(d => d.label !== "None").map((item, idx) => (
          <div className={styles.legendItem} key={idx}>
            <div className={`${styles.dot} ${item.styleClass}`} />
            <div className={styles.text}>
              <strong>{item.value}%</strong>
              <span>{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
