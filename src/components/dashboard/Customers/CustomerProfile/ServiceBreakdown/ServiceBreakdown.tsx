import Image from "next/image";
import RoundedDonutChart from "@/components/dashboard/shared/RoundedDonutChart/RoundedDonutChart";
import styles from "./ServiceBreakdown.module.scss";

interface ServiceBreakdownProps {
  data?: Record<string, number> | Array<{
    service?: string;
    name?: string;
    bookings_count?: number;
    count?: number;
    [key: string]: any;
  }>;
}

export default function ServiceBreakdown({ data = {} }: ServiceBreakdownProps) {
  // Map backend keys to colors and display labels
  const mapping: Record<string, { label: string; color: string; styleClass: string }> = {
    trip: { label: "Trips", color: "#93C5FD", styleClass: styles.dotBlue },
    hotel: { label: "Hotels", color: "#E9D5FF", styleClass: styles.dotPurple },
    transport: { label: "Transportation", color: "#FDBA74", styleClass: styles.dotOrange },
    transportation: { label: "Transportation", color: "#FDBA74", styleClass: styles.dotOrange },
    custom_trip: { label: "Plan Your Trip", color: "#6EE7B7", styleClass: styles.dotBlue },
    b2b: { label: "B2B", color: "#FCA5A5", styleClass: styles.dotPurple },
    b2b_proposal: { label: "B2B", color: "#FCA5A5", styleClass: styles.dotPurple },
    events: { label: "MICE", color: "#FDE047", styleClass: styles.dotOrange },
    event_proposal: { label: "MICE", color: "#FDE047", styleClass: styles.dotOrange },
  };

  const parsedItems: { key: string; count: number }[] = [];

  if (Array.isArray(data)) {
    for (const item of data) {
      const key = (item.service || item.name || "").toLowerCase();
      const count = Number(item.bookings_count ?? item.count ?? 0);
      if (key && count > 0) {
        parsedItems.push({ key, count });
      }
    }
  } else if (data && typeof data === "object") {
    for (const [key, val] of Object.entries(data)) {
      const count = Number(val || 0);
      if (count > 0) {
        parsedItems.push({ key: key.toLowerCase(), count });
      }
    }
  }

  const total = parsedItems.reduce((acc, curr) => acc + curr.count, 0);

  const chartData = parsedItems
    .map((item) => ({
      label: mapping[item.key]?.label || item.key.charAt(0).toUpperCase() + item.key.slice(1),
      value: total > 0 ? Math.round((item.count / total) * 100) : 0,
      color: mapping[item.key]?.color || "#A1CCFF",
      styleClass: mapping[item.key]?.styleClass || styles.dotBlue,
    }))
    .sort((a, b) => b.value - a.value);

  const hasData = chartData.length > 0;

  // Default to 100% placeholder if no data so donut chart renders nicely
  const displayChartData = hasData
    ? chartData
    : [{ label: "None", value: 100, color: "#E5E7EB", styleClass: "" }];

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
          data={displayChartData}
          centerValue={hasData ? `${chartData[0].value}%` : "0%"}
          centerLabel={hasData ? chartData[0].label : "No Bookings"}
        />
      </div>

      <div className={styles.legend}>
        {hasData ? (
          chartData.map((item, idx) => (
            <div className={styles.legendItem} key={idx}>
              <div className={`${styles.dot} ${item.styleClass}`} style={{ backgroundColor: item.color }} />
              <div className={styles.text}>
                <strong>{item.value}%</strong>
                <span>{item.label}</span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.legendItem}>
            <div className={styles.text}>
              <span>No bookings recorded yet</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
