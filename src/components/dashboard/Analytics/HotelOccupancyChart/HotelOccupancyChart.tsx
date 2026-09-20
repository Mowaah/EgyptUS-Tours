import { useMemo } from "react";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import styles from "./HotelOccupancyChart.module.scss";
import DoubleBarChart, { DoubleBarData } from "@/components/dashboard/shared/DoubleBarChart/DoubleBarChart";
import type { HotelOccupancy } from "@/services/admin/adminReportsService";

interface HotelOccupancyChartProps {
  data?: HotelOccupancy[];
  actions?: React.ReactNode;
}

const Y_AXIS_LABELS = ["100%", "75%", "50%", "25%", "0%"];

function occupancyLegendYears(data: HotelOccupancy[]) {
  const calendarYear = new Date().getFullYear();
  const apiCurrent = data[0]?.current_year;
  const apiPrevious = data[0]?.previous_year;
  const currentLooksValid =
    typeof apiCurrent === "number" &&
    apiCurrent >= calendarYear - 20 &&
    apiCurrent <= calendarYear;

  const currentYear = currentLooksValid ? apiCurrent : calendarYear;
  const previousYear =
    typeof apiPrevious === "number" && apiPrevious === currentYear - 1
      ? apiPrevious
      : currentYear - 1;

  return { currentYear, previousYear };
}

export default function HotelOccupancyChart({ data = [], actions }: HotelOccupancyChartProps) {
  const { currentYear, previousYear } = occupancyLegendYears(data);

  const chartData: DoubleBarData[] = useMemo(() => {
    if (!data.length) return [];

    return data.map((item) => {
      const currentPct = parseFloat(item.current_year_occupancy_pct || item.approximate_occupancy_pct || "0");
      const prevPct = parseFloat(item.previous_year_occupancy_pct || "0");

      return {
        label: item.hotel_name,
        value1: Math.min(100, Math.max(0, currentPct)),
        value2: Math.min(100, Math.max(0, prevPct)),
      };
    });
  }, [data]);

  const isEmpty = useMemo(() => {
    return !chartData.length || chartData.every((item) => item.value1 === 0 && item.value2 === 0);
  }, [chartData]);

  return (
    <article className={parentStyles.chartCard}>
      <PanelHeader
        icon="reports/hotel_occupancy"
        title="Hotel Occupancy"
        subtitle={isEmpty ? undefined : "Approximate occupancy %"}
        actions={actions}
      />

      <DoubleBarChart data={chartData} yAxisLabels={Y_AXIS_LABELS} />

      <div className={styles.legendPill}>
        <div className={styles.legendItem}>
          <span className={styles.dotPrimary} aria-hidden />
          <span className={styles.legendLabel}>{currentYear}</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.dotSecondary} aria-hidden />
          <span className={styles.legendLabel}>{previousYear}</span>
        </div>
      </div>
    </article>
  );
}
