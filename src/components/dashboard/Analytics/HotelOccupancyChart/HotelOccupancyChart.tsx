import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";
import DoubleBarChart, { DoubleBarData } from "@/components/dashboard/shared/DoubleBarChart/DoubleBarChart";
import { HotelOccupancy } from "@/services/admin/adminReportsService";
import { useMemo } from "react";

interface HotelOccupancyChartProps {
  data?: HotelOccupancy[];
  actions?: React.ReactNode;
}

export default function HotelOccupancyChart({ data = [], actions }: HotelOccupancyChartProps) {
  const chartData: DoubleBarData[] = useMemo(() => {
    if (!data.length) return [];
    
    // Find the max available nights to set as 100% baseline for the chart height
    const maxAvailable = Math.max(...data.map(d => d.available_room_nights));
    
    return data.map(item => ({
      label: item.hotel_name,
      // Available nights is the faded background bar
      value2: maxAvailable > 0 ? (item.available_room_nights / maxAvailable) * 100 : 0,
      // Booked nights is the solid foreground bar
      value1: maxAvailable > 0 ? (item.booked_room_nights / maxAvailable) * 100 : 0,
      // Pass the raw numbers so we can show them on hover if DoubleBarChart supported it,
      // or at least to document why we scale by maxAvailable.
    }));
  }, [data]);

  const yAxisLabels = useMemo(() => {
    if (!data.length) return ["100", "75", "50", "25", "0"];
    const maxAvailable = Math.max(...data.map(d => d.available_room_nights));
    
    // Create 5 steps (e.g., max, 75%, 50%, 25%, 0)
    return [
      Math.round(maxAvailable).toString(),
      Math.round(maxAvailable * 0.75).toString(),
      Math.round(maxAvailable * 0.5).toString(),
      Math.round(maxAvailable * 0.25).toString(),
      "0"
    ];
  }, [data]);

  return (
    <article className={parentStyles.chartCard}>
      <PanelHeader
        icon="reports/hotel_occupancy"
        title="Hotel Occupancy"
        subtitle="Booked vs Available Room Nights"
        actions={actions}
      />
      <DoubleBarChart data={chartData} yAxisLabels={yAxisLabels} />
    </article>
  );

}
