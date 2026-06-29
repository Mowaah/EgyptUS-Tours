import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import HatchedBarChart from "@/components/dashboard/shared/HatchedBarChart/HatchedBarChart";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";

export default function CustomersByNationality() {
  const distribution = [
    { label: "Saudi Arabia", value: 32, color: "#8DC1FF" },
    { label: "UAE", value: 22, color: "#FDBA74" },
    { label: "UK", value: 36, color: "#FFD1DE" },
    { label: "Egypt", value: 74, color: "#E9BDFF" },
    { label: "Spain", value: 58, color: "#FDE68A" },
    { label: "China", value: 58, color: "#C4B5FD" },
    { label: "Morocco", value: 58, color: "#D1D5DB" },
    { label: "Others", value: 20, color: "#86EFAC" },
  ];

  const yAxisLabels = ["80%", "60%", "40%", "20%", "0"];

  return (
    <article className={parentStyles.chartCard}>
      <PanelHeader
        icon="reports/customers_by_nationality"
        title="Customers by Nationality"
        actions={<ExportButtons />}
      />
      
      <HatchedBarChart data={distribution} yAxisLabels={yAxisLabels} />
    </article>
  );
}
