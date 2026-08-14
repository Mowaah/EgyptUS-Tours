import { ReactNode, useMemo } from "react";
import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import HatchedBarChart from "@/components/dashboard/shared/HatchedBarChart/HatchedBarChart";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";

interface MiceRevenueByEventTypeProps {
  data?: { event_type: string; proposal_count: number }[];
  actions?: ReactNode;
}

export default function MiceRevenueByEventType({ data = [], actions }: MiceRevenueByEventTypeProps) {
  const colors = ["#A1CCFF", "#FFC6A0", "#FFD6DD", "#E9BDFF", "#8DC1FF"];

  const maxY = useMemo(() => {
    if (!data.length) return 5;
    const max = Math.max(...data.map((d) => d.proposal_count));
    const step = Math.ceil(max / 5) || 1;
    return step * 5;
  }, [data]);

  const distribution = useMemo(() => {
    return data.map((item, index) => ({
      label: item.event_type,
      value: maxY > 0 ? (item.proposal_count / maxY) * 100 : 0,
      displayValue: item.proposal_count.toString(),
      color: colors[index % colors.length],
    }));
  }, [data, maxY]);

  const yAxisLabels = useMemo(() => {
    const step = maxY / 5;
    const labels = [];
    for (let i = 5; i >= 0; i--) {
      labels.push((step * i).toString());
    }
    return labels;
  }, [maxY]);

  return (
    <article className={parentStyles.chartCard}>
      <PanelHeader
        icon="customers/overview/service"
        title="Proposals by Event Type"
        actions={actions}
      />
      
      <HatchedBarChart 
        data={distribution} 
        yAxisLabels={yAxisLabels} 
        barWidth={100}
      />
    </article>
  );
}
