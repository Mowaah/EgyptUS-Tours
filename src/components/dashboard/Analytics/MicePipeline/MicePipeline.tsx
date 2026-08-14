import { ReactNode } from "react";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import RoundedDonutChart from "@/components/dashboard/shared/RoundedDonutChart/RoundedDonutChart";
import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import styles from "./MicePipeline.module.scss";

interface MicePipelineProps {
  pipeline?: {
    stage: string;
    label: string;
    count: number;
  }[];
  actions?: ReactNode;
}

export default function MicePipeline({ pipeline = [], actions }: MicePipelineProps) {
  const total = pipeline.reduce((sum, item) => sum + item.count, 0);

  const colors = ["#8DC1FF", "#FDBA74", "#FFD1DE"]; // Blue, Orange, Pink
  const bgColors = ["#A1CCFF", "#FFC6A0", "#FFD6DD"];

  const donutData = pipeline.map((item, index) => ({
    label: item.label,
    value: total > 0 ? (item.count / total) * 100 : 0,
    color: colors[index % colors.length],
  }));

  return (
    <article className={parentStyles.chartCard}>
      <PanelHeader
        icon="finance/payment/chart"
        title="MICE Pipeline"
        subtitle="RFPs Received → Proposals Sent → Contracts Signed"
        actions={actions}
      />

      <div className={styles.content}>
        <div className={styles.donutWrapper}>
          <RoundedDonutChart
            data={donutData}
            centerValue={total.toString()}
          />
        </div>

        <div className={styles.stats}>
          {pipeline.map((item, index) => {
            const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
            return (
              <div key={item.stage} className={styles.stat}>
                <div className={styles.heading}>
                  <div className={styles.company}>{item.label}</div>
                  <div className={styles.percentage}>{percentage}%</div>
                </div>
                <div className={styles.line}>
                  <div 
                    className={styles.indicator} 
                    style={{ width: `${percentage}%`, background: bgColors[index % bgColors.length] }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}
