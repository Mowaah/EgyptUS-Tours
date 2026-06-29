import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import HatchedBarChart from "@/components/dashboard/shared/HatchedBarChart/HatchedBarChart";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";

export default function BookingsByServiceChart() {
  const distribution = [
    { label: "Trips", value: 32, color: "#A1CCFF" },
    { label: "Hotels", value: 22, color: "#FFC6A0" },
    { label: "Transport", value: 36, color: "#FFD1DE" },
    { label: "MICE", value: 74, color: "#E9BDFF" },
    { label: "B2B", value: 58, color: "#A1F6CC" },
  ];

  const yAxisLabels = ["500", "400", "300", "200", "100", "0"];

  return (
    <article className={parentStyles.chartCard}>
      <PanelHeader
        icon="reports/bookings_by_service"
        title="Bookings by Service"
        subtitle="By service type"
        actions={<ExportButtons />}
      />
      
      <HatchedBarChart data={distribution} yAxisLabels={yAxisLabels} />
    </article>
  );
}
