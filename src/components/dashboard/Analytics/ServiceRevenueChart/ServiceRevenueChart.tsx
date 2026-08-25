import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import HatchedBarChart from "@/components/dashboard/shared/HatchedBarChart/HatchedBarChart";
import { BookingsByService } from "@/services/admin/adminReportsService";
import { useMemo } from "react";

interface ServiceRevenueChartProps {
  data?: BookingsByService;
  actions?: React.ReactNode;
}

export default function ServiceRevenueChart({ data, actions }: ServiceRevenueChartProps) {
  const distribution = useMemo(() => {
    if (!data) return [];
    const values = [
      parseFloat(data.trip as string) || 0,
      parseFloat(data.hotel as string) || 0,
      parseFloat(data.transport as string) || 0,
      parseFloat(data.mice as string) || 0,
      (parseFloat(data.b2b as string) || 0) + (parseFloat(data.custom_trip as string) || 0), // Mapping custom_trip into "Others" along with B2B (if any), actually let's just make it "Others" for custom_trip
    ];
    
    const othersVal = (parseFloat(data.b2b as string) || 0) + (parseFloat(data.custom_trip as string) || 0);

    const maxVal = Math.max(10, ...values);

    return [
      { label: "Trips", value: ((parseFloat(data.trip as string) || 0) / maxVal) * 100, displayValue: `$${parseFloat(data.trip as string) || 0}`, color: "#A1CCFF", rawValue: parseFloat(data.trip as string) || 0 },
      { label: "Hotels", value: ((parseFloat(data.hotel as string) || 0) / maxVal) * 100, displayValue: `$${parseFloat(data.hotel as string) || 0}`, color: "#FFC6A0", rawValue: parseFloat(data.hotel as string) || 0 },
      { label: "Transport", value: ((parseFloat(data.transport as string) || 0) / maxVal) * 100, displayValue: `$${parseFloat(data.transport as string) || 0}`, color: "#FFD1DE", rawValue: parseFloat(data.transport as string) || 0 },
      { label: "MICE", value: ((parseFloat(data.mice as string) || 0) / maxVal) * 100, displayValue: `$${parseFloat(data.mice as string) || 0}`, color: "#E9BDFF", rawValue: parseFloat(data.mice as string) || 0 },
      { label: "Others", value: (othersVal / maxVal) * 100, displayValue: `$${othersVal}`, color: "#A1F6CC", rawValue: othersVal },
    ];
  }, [data]);

  const yAxisLabels = useMemo(() => {
    if (!distribution.length) return ["100 $", "80 $", "60 $", "40 $", "20 $", "0 $"];
    const maxVal = Math.max(10, ...distribution.map(d => d.rawValue));
    const step = maxVal / 5;
    return [
      Math.round(maxVal) + "£",
      Math.round(maxVal - step) + "£",
      Math.round(maxVal - step * 2) + "£",
      Math.round(maxVal - step * 3) + "£",
      Math.round(maxVal - step * 4) + "£",
      "0$"
    ];
  }, [distribution]);

  return (
    <article className={parentStyles.chartCard}>
      <PanelHeader
        icon="reports/money-send_grey"
        title="Service Revenue"
        subtitle="By service type"
        actions={actions}
      />
      
      <HatchedBarChart data={distribution} yAxisLabels={yAxisLabels} />
    </article>
  );
}
