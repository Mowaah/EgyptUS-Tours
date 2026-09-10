import Image from "next/image";
import parentStyles from "../DepositsPage/DepositsPage.module.scss";
import HatchedBarChart from "@/components/dashboard/shared/HatchedBarChart/HatchedBarChart";
import { formatCompactMetric } from "@/utils/formatMetric";

export default function OverdueDepositsChart({ chartData }: { chartData?: Record<string, string> }) {
  const COLOR_MAP: Record<string, string> = {
    trip: "#A1CCFF",
    hotel: "#FFC6A0",
    transport: "#FFD1DE",
    custom_trip: "#E9BDFF",
  };
  const LABEL_MAP: Record<string, string> = {
    trip: "Trips",
    hotel: "Hotels",
    transport: "Transport",
    custom_trip: "Custom",
  };

  const distribution = Object.entries(chartData || {}).map(([key, val]) => {
    return {
      label: LABEL_MAP[key] || key,
      value: parseFloat(val || "0"),
      color: COLOR_MAP[key] || "#ccc",
    };
  });

  const maxVal = Math.max(0, ...distribution.map((d) => d.value));
  
  // Calculate dynamic heights
  const chartHeightData = distribution.map(d => ({
    ...d,
    value: maxVal > 0 ? (d.value / maxVal) * 100 : 0, // Using value for height
    originalValue: d.value,
    displayValue: formatCompactMetric(d.value, true),
  }));

  const yAxisLabels = [
    formatCompactMetric(maxVal, true),
    formatCompactMetric(maxVal * 0.75, true),
    formatCompactMetric(maxVal * 0.5, true),
    formatCompactMetric(maxVal * 0.25, true),
    "$0",
  ];

  return (
    <div className={parentStyles.chartCard}>
      <div className={parentStyles.cardHeader}>
        <div className={parentStyles.iconBox}>
          <Image src="/images/dashboard/customers/overview/service.svg" alt="" width={24} height={24} />
        </div>
        <div>
          <h2 className={parentStyles.cardTitle}>Overdue Deposits by Service</h2>
          <p className={parentStyles.cardSubtitle}>Outstanding payments grouped by service type.</p>
        </div>
      </div>
      
      <HatchedBarChart data={chartHeightData} yAxisLabels={yAxisLabels} />
    </div>
  );
}
