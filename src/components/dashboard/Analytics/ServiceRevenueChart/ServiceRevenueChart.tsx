import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import HatchedBarChart from "@/components/dashboard/shared/HatchedBarChart/HatchedBarChart";
import { BookingsByService } from "@/services/admin/adminReportsService";
import { formatCompactMetric, formatCurrencyAmount } from "@/utils/formatMetric";
import { useMemo } from "react";

interface ServiceRevenueChartProps {
  data?: BookingsByService;
  actions?: React.ReactNode;
}

export default function ServiceRevenueChart({ data, actions }: ServiceRevenueChartProps) {
  const distribution = useMemo(() => {
    if (!data) return [];
    const tripVal = parseFloat(data.trip as string) || 0;
    const hotelVal = parseFloat(data.hotel as string) || 0;
    const transportVal = parseFloat(data.transport as string) || 0;
    const miceVal = parseFloat(data.mice as string) || 0;
    const othersVal = (parseFloat(data.b2b as string) || 0) + (parseFloat(data.custom_trip as string) || 0);

    const values = [tripVal, hotelVal, transportVal, miceVal, othersVal];
    const maxVal = Math.max(10, ...values);

    return [
      { label: "Trips", value: (tripVal / maxVal) * 100, displayValue: formatCurrencyAmount(tripVal), color: "#A1CCFF", rawValue: tripVal },
      { label: "Hotels", value: (hotelVal / maxVal) * 100, displayValue: formatCurrencyAmount(hotelVal), color: "#FFC6A0", rawValue: hotelVal },
      { label: "Transport", value: (transportVal / maxVal) * 100, displayValue: formatCurrencyAmount(transportVal), color: "#FFD1DE", rawValue: transportVal },
      { label: "MICE", value: (miceVal / maxVal) * 100, displayValue: formatCurrencyAmount(miceVal), color: "#E9BDFF", rawValue: miceVal },
      { label: "Others", value: (othersVal / maxVal) * 100, displayValue: formatCurrencyAmount(othersVal), color: "#A1F6CC", rawValue: othersVal },
    ];
  }, [data]);

  const yAxisLabels = useMemo(() => {
    if (!distribution.length) return ["$100", "$80", "$60", "$40", "$20", "$0"];
    const maxVal = Math.max(10, ...distribution.map(d => d.rawValue));
    const step = maxVal / 5;
    return [
      formatCompactMetric(maxVal, true),
      formatCompactMetric(maxVal - step, true),
      formatCompactMetric(maxVal - step * 2, true),
      formatCompactMetric(maxVal - step * 3, true),
      formatCompactMetric(maxVal - step * 4, true),
      "$0"
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
