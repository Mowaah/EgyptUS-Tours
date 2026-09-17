import Image from "next/image";
import parentStyles from "../DepositsPage/DepositsPage.module.scss";
import HatchedBarChart from "@/components/dashboard/shared/HatchedBarChart/HatchedBarChart";
import { formatCompactMetric } from "@/utils/formatMetric";

interface OverdueDepositsChartProps {
  chartData?: Record<string, string | number>;
}

const SERVICES = [
  { key: "trip", aliases: ["trips"], label: "Trips", color: "#A1CCFF" },
  { key: "hotel", aliases: ["hotels"], label: "Hotels", color: "#FFC6A0" },
  { key: "transport", aliases: ["transportation"], label: "Transport", color: "#FFD1DE" },
  { key: "mice", aliases: ["event_proposal", "event"], label: "MICE", color: "#E9BDFF" },
  { key: "b2b", aliases: ["b2b_proposal"], label: "B2B", color: "#B7F4D8" },
  { key: "custom_trip", aliases: ["custom", "plan_your_trip"], label: "Custom Trip", color: "#FFB4B4" },
];

export default function OverdueDepositsChart({ chartData }: OverdueDepositsChartProps) {
  const serviceItems = SERVICES.map((service) => {
    let rawVal = chartData?.[service.key];
    if (rawVal === undefined) {
      for (const alias of service.aliases) {
        if (chartData?.[alias] !== undefined) {
          rawVal = chartData[alias];
          break;
        }
      }
    }
    const val = typeof rawVal === "number" ? rawVal : parseFloat(rawVal || "0");
    return {
      label: service.label,
      value: isNaN(val) ? 0 : val,
      color: service.color,
    };
  });

  const maxVal = Math.max(0, ...serviceItems.map((d) => d.value));
  // Default to 2000 if empty or small, matching Figma's $2000 scale
  const maxY = maxVal <= 2000 ? 2000 : Math.ceil(maxVal / 500) * 500;

  const chartHeightData = serviceItems.map((item) => {
    const pct = maxY > 0 ? Math.round((item.value / maxY) * 100) : 0;
    const pctDisplay = pct === 0 && item.value > 0 ? "<1%" : `${pct}%`;
    return {
      label: item.label,
      value: item.value > 0 ? Math.min(100, Math.max(pct, 5)) : 0,
      color: item.color,
      displayValue: item.value > 0 ? pctDisplay : "",
    };
  });

  const formatAxis = (num: number) => {
    if (num === 0) return "$0";
    if (maxY <= 2000) return `$${Math.round(num)}`;
    return formatCompactMetric(num, true);
  };

  const yAxisLabels = [
    formatAxis(maxY),
    formatAxis(maxY * 0.75),
    formatAxis(maxY * 0.5),
    formatAxis(maxY * 0.25),
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
