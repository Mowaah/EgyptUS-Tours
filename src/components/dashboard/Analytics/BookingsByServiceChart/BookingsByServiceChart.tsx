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
    const trip = Number(data.trip) || 0;
    const hotel = Number(data.hotel) || 0;
    const transport = Number(data.transport) || 0;
    const mice = Number(data.mice) || 0;
    const b2b = Number(data.b2b) || 0;

    const values = [trip, hotel, transport, mice, b2b];
    const maxVal = Math.max(10, ...values);

    return [
      { label: "Trips", value: (trip / maxVal) * 100, displayValue: trip.toString(), color: "#A1CCFF", rawValue: trip },
      { label: "Hotels", value: (hotel / maxVal) * 100, displayValue: hotel.toString(), color: "#FFC6A0", rawValue: hotel },
      { label: "Transport", value: (transport / maxVal) * 100, displayValue: transport.toString(), color: "#FFD1DE", rawValue: transport },
      { label: "MICE", value: (mice / maxVal) * 100, displayValue: mice.toString(), color: "#E9BDFF", rawValue: mice },
      { label: "B2B", value: (b2b / maxVal) * 100, displayValue: b2b.toString(), color: "#A1F6CC", rawValue: b2b },
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
