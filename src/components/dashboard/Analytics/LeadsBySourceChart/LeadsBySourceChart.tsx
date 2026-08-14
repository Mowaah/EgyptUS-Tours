import { useMemo } from "react";
import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import HatchedBarChart from "@/components/dashboard/shared/HatchedBarChart/HatchedBarChart";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import type { LeadSourceItem } from "@/services/admin/adminReportsService";

const COLORS = [
  "#A1CCFF",
  "#FFC6A0",
  "#FFD1DE",
  "#E9BDFF",
  "#FDE68A",
  "#A1F6CC",
  "#C7D2FE",
  "#FECDD3",
];

interface LeadsBySourceChartProps {
  data?: LeadSourceItem[];
  actions?: React.ReactNode;
}

export default function LeadsBySourceChart({ data = [], actions }: LeadsBySourceChartProps) {
  const maxY = useMemo(() => {
    if (!data || data.length === 0) return 10;
    const maxVal = Math.max(...data.map((d) => d.count), 0);
    if (maxVal === 0) return 10;
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxVal)));
    return Math.ceil((maxVal * 1.2) / magnitude) * magnitude || 10;
  }, [data]);

  const distribution = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((item, index) => ({
      label: item.label,
      value: maxY > 0 ? (item.count / maxY) * 100 : 0,
      displayValue: item.count.toString(),
      color: COLORS[index % COLORS.length],
    }));
  }, [data, maxY]);

  const yAxisLabels = useMemo(() => {
    const step = maxY / 5;
    const labels: string[] = [];
    for (let i = 5; i >= 0; i--) {
      labels.push(Math.round(step * i).toString());
    }
    return labels;
  }, [maxY]);

  return (
    <article className={parentStyles.chartCard}>
      <PanelHeader
        icon="reports/leads_by_source"
        title="Leads by Source"
        subtitle="Overview of lead acquisition channels"
        actions={actions}
      />

      <HatchedBarChart data={distribution} yAxisLabels={yAxisLabels} />
    </article>
  );
}
