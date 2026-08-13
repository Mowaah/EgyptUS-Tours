import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import HatchedBarChart from "@/components/dashboard/shared/HatchedBarChart/HatchedBarChart";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";
import { BookingsByService } from "@/services/admin/adminReportsService";
import { useMemo } from "react";

interface BookingsByServiceChartProps {
  data?: BookingsByService;
  actions?: React.ReactNode;
}

export default function BookingsByServiceChart({ data, actions }: BookingsByServiceChartProps) {
  const distribution = useMemo(() => {
    if (!data) return [];
    const values = [
      data.trip || 0,
      data.hotel || 0,
      data.transport || 0,
      data.mice || 0,
      data.b2b || 0,
    ];
    const maxVal = Math.max(10, ...values);

    return [
      { label: "Trips", value: ((data.trip || 0) / maxVal) * 100, displayValue: (data.trip || 0).toString(), color: "#A1CCFF", rawValue: data.trip || 0 },
      { label: "Hotels", value: ((data.hotel || 0) / maxVal) * 100, displayValue: (data.hotel || 0).toString(), color: "#FFC6A0", rawValue: data.hotel || 0 },
      { label: "Transport", value: ((data.transport || 0) / maxVal) * 100, displayValue: (data.transport || 0).toString(), color: "#FFD1DE", rawValue: data.transport || 0 },
      { label: "MICE", value: ((data.mice || 0) / maxVal) * 100, displayValue: (data.mice || 0).toString(), color: "#E9BDFF", rawValue: data.mice || 0 },
      { label: "B2B", value: ((data.b2b || 0) / maxVal) * 100, displayValue: (data.b2b || 0).toString(), color: "#A1F6CC", rawValue: data.b2b || 0 },
    ];
  }, [data]);

  const yAxisLabels = useMemo(() => {
    if (!distribution.length) return ["500", "400", "300", "200", "100", "0"];
    const maxVal = Math.max(10, ...distribution.map(d => d.rawValue));
    // We want 5 steps from 0 to maxVal (rounded up to nearest nice number if needed, but rounding directly is okay for now)
    const step = maxVal / 5;
    return [
      Math.round(maxVal).toString(),
      Math.round(maxVal - step).toString(),
      Math.round(maxVal - step * 2).toString(),
      Math.round(maxVal - step * 3).toString(),
      Math.round(maxVal - step * 4).toString(),
      "0"
    ];
  }, [distribution]);

  return (
    <article className={parentStyles.chartCard}>
      <PanelHeader
        icon="reports/bookings_by_service"
        title="Bookings by Service"
        subtitle="By service type"
        actions={actions}
      />
      
      <HatchedBarChart data={distribution} yAxisLabels={yAxisLabels} />
    </article>
  );
}
