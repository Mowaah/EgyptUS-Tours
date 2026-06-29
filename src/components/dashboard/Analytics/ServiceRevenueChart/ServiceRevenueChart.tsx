"use client";

import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import HatchedBarChart from "@/components/dashboard/shared/HatchedBarChart/HatchedBarChart";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";

export default function ServiceRevenueChart() {
  const distribution = [
    { label: "Trips", value: 32, color: "#A1CCFF" },
    { label: "Hotels", value: 22, color: "#FFC6A0" },
    { label: "Transport", value: 36, color: "#FFD1DE" },
    { label: "MICE", value: 74, color: "#E9BDFF" },
    { label: "Others", value: 58, color: "#A1F6CC" },
  ];

  const yAxisLabels = ["500000$", "400000$", "300000$", "200000$", "100000$", "0"];

  return (
    <article className={parentStyles.chartCard}>
      <PanelHeader
        icon="reports/money-send_grey"
        title="Service Revenue"
        subtitle="By service type"
        actions={<ExportButtons />}
      />
      
      <HatchedBarChart data={distribution} yAxisLabels={yAxisLabels} />
    </article>
  );
}
