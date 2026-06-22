"use client";

import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import HatchedBarChart from "@/components/shared/HatchedBarChart/HatchedBarChart";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";

export default function LeadsBySourceChart() {
  const distribution = [
    { label: "Website", value: 32, color: "#A1CCFF" },
    { label: "Phone", value: 22, color: "#FFC6A0" },
    { label: "Email", value: 36, color: "#FFD1DE" },
    { label: "Walk-In", value: 74, color: "#E9BDFF" },
    { label: "Social Media", value: 58, color: "#FDE68A" },
    { label: "Others", value: 56, color: "#A1F6CC" },
  ];

  const yAxisLabels = ["500000$", "400000$", "300000$", "200000$", "100000$", "0"];

  return (
    <article className={parentStyles.chartCard}>
      <PanelHeader
        icon="reports/leads_by_source"
        title="Leads by Source"
        subtitle="Overview of lead acquisition channels"
        actions={<ExportButtons />}
      />
      
      <HatchedBarChart data={distribution} yAxisLabels={yAxisLabels} />
    </article>
  );
}
