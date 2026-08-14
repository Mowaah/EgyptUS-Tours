import { useMemo } from "react";
import RoundedDonutChart from "@/components/dashboard/shared/RoundedDonutChart/RoundedDonutChart";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import styles from "./LostLeadsAnalysis.module.scss";
import type { LostLeadsAnalysisData } from "@/services/admin/adminReportsService";

const COLORS = [
  "#A1CCFF",
  "#FFC6A0",
  "#FFD6DD",
  "#E9BDFF",
  "#A1FFAF",
  "#FDE68A",
  "#C7D2FE",
  "#FECDD3",
];

interface LostLeadsAnalysisProps {
  data?: LostLeadsAnalysisData;
  actions?: React.ReactNode;
}

export default function LostLeadsAnalysis({ data, actions }: LostLeadsAnalysisProps) {
  const chartData = useMemo(() => {
    if (!data?.by_reason_count || data.by_reason_count.length === 0) {
      return [];
    }
    return data.by_reason_count.map((item, index) => ({
      label: item.reason,
      value: item.percentage,
      count: item.count,
      color: COLORS[index % COLORS.length],
    }));
  }, [data]);

  const { leftColumnData, rightColumnData } = useMemo(() => {
    if (!chartData.length) {
      return { leftColumnData: [], rightColumnData: [] };
    }
    const mid = Math.ceil(chartData.length / 2);
    return {
      leftColumnData: chartData.slice(0, mid),
      rightColumnData: chartData.slice(mid),
    };
  }, [chartData]);

  const totalLost = data?.total_lost !== undefined ? data.total_lost.toString() : "0";

  return (
    <article className={parentStyles.chartCard}>
      <PanelHeader
        icon="reports/lost_leads"
        title="Lost Leads Analysis"
        subtitle="Reasons for lost leads"
        actions={actions}
      />
      
      <div className={styles.donutWrapper}>
        <div className={styles.donutChartContainer}>
          <RoundedDonutChart 
            data={chartData} 
            centerValue={totalLost} 
            centerLabel="Lost" 
          />
        </div>
        
        <div className={styles.legendCard}>
          <div className={styles.legendColumn}>
            {leftColumnData.map((item) => (
              <div key={item.label} className={styles.legendItem}>
                <span 
                  className={styles.legendColor} 
                  style={{ backgroundColor: item.color }} 
                  aria-hidden
                />
                <div className={styles.legendText}>
                  <span className={styles.legendValue}>{item.value}%</span>
                  <span className={styles.legendLabel} title={item.label}>{item.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.legendColumn}>
            {rightColumnData.map((item) => (
              <div key={item.label} className={styles.legendItem}>
                <span 
                  className={styles.legendColor} 
                  style={{ backgroundColor: item.color }} 
                  aria-hidden
                />
                <div className={styles.legendText}>
                  <span className={styles.legendValue}>{item.value}%</span>
                  <span className={styles.legendLabel} title={item.label}>{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
