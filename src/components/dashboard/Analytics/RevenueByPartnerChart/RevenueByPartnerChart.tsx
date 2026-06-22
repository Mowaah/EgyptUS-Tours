"use client";

import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";
import styles from "./RevenueByPartnerChart.module.scss";

export default function RevenueByPartnerChart() {
  const chartData = [
    { label: "MALDIVES PARADISE RESORTS", value: 165000 },
    { label: "MALDIVES PARADISE RESORTS", value: 110000 },
    { label: "MALDIVES PARADISE RESORTS", value: 165000 },
    { label: "MALDIVES PARADISE RESORTS", value: 210000 },
    { label: "MALDIVES PARADISE RESORTS", value: 150000 },
    { label: "MALDIVES PARADISE RESORTS", value: 100000 },
  ];

  const yAxisLabels = ["220000 $", "165000 $", "110000 $", "55000 $", "0"];
  const maxValue = 220000;

  return (
    <article className={styles.chartCard}>
      <PanelHeader
        icon="reports/profile"
        title="Revenue by Partner"
        actions={<ExportButtons />}
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
                    />
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
