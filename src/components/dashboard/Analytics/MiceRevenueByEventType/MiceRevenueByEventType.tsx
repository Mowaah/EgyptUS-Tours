import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import HatchedBarChart from "@/components/dashboard/shared/HatchedBarChart/HatchedBarChart";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";

export default function MiceRevenueByEventType() {
  const distribution = [
    { label: "Conference", value: 32, color: "#A1CCFF" },
    { label: "Corporate Retreat", value: 22, color: "#FFC6A0" },
    { label: "Incentive Trip", value: 36, color: "#FFD6DD" },
    { label: "Exhibition", value: 74, color: "#E9BDFF" },
  ];

  const yAxisLabels = ["$2500", "$2000", "$1500", "$1000", "$500", "$0"];

  return (
    <article className={parentStyles.chartCard}>
      <PanelHeader
        icon="customers/overview/service"
        title="MICE Revenue by Event Type"
        actions={<ExportButtons />}
      />
      
      <HatchedBarChart 
        data={distribution} 
        yAxisLabels={yAxisLabels} 
        barWidth={100}
      />
    </article>
  );
}
