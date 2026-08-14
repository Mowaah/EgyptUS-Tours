import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import styles from "./RevenueByPartnerChart.module.scss";
import { RevenueByPartner } from "@/services/admin/adminReportsService";
import { useMemo } from "react";

interface RevenueByPartnerChartProps {
  data?: RevenueByPartner[];
  actions?: React.ReactNode;
}

export default function RevenueByPartnerChart({ data = [], actions }: RevenueByPartnerChartProps) {
  const chartData = useMemo(() => {
    if (!data.length) return [];
    return data.slice(0, 6).map(item => ({
      label: item.partner,
      value: parseFloat(item.total_revenue) || 0,
    }));
  }, [data]);

  const { yAxisLabels, maxValue } = useMemo(() => {
    if (!chartData.length) return { yAxisLabels: ["100 $", "75 $", "50 $", "25 $", "0 $"], maxValue: 100 };
    const max = Math.max(10, ...chartData.map(d => d.value));
    const step = max / 4;
    return {
      yAxisLabels: [
        Math.round(max) + " $",
        Math.round(max - step) + " $",
        Math.round(max - step * 2) + " $",
        Math.round(max - step * 3) + " $",
        "0 $"
      ],
      maxValue: max
    };
  }, [chartData]);

  return (
    <article className={styles.chartCard}>
      <PanelHeader
        icon="reports/profile_grey"
        title="Revenue by Partner"
        actions={actions}
      />

      <div className={styles.barChartContainer}>
        {/* Y Axis Labels */}
        <div className={styles.yAxis}>
          {yAxisLabels.map((label, i) => (
            <div key={i} className={styles.yAxisLine}>
              {label}
            </div>
          ))}
        </div>

        {/* Grid Lines Overlay */}
        <div className={styles.gridLines}>
          {yAxisLabels.map((label, i) => (
            <div 
              key={i} 
              className={i === yAxisLabels.length - 1 ? styles.gridLineSolid : styles.gridLine} 
            />
          ))}
        </div>

        {/* Chart Area */}
        <div className={styles.chartArea}>
          <div className={styles.chartBars}>
            {chartData.map((col, index) => {
              // Calculate height percentage relative to maxValue
              const heightPct = (col.value / maxValue) * 100;
              
              return (
                <div key={index} className={styles.barColumn}>
                  <div className={styles.barWrapper}>
                    <div 
                      className={styles.barFill} 
                      style={{ height: `${heightPct}%` }}
                      title={`$${col.value.toLocaleString()}`}
                    >
                      <span className={styles.barValueHover}>
                        ${col.value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className={styles.xAxisLabel}>{col.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}
