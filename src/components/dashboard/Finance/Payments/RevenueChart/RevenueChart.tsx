"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "../PaymentsPage/PaymentsPage.module.scss";

import { AnimatedNumber } from "@/components/shared/AnimatedNumber/AnimatedNumber";

interface RevenueChartProps {
  chartData: { label: string; value: number; heightPct: number }[];
}

export default function RevenueChart({ chartData }: RevenueChartProps) {
  if (!chartData || chartData.length === 0) {
    chartData = [{ label: "No Data", value: 0, heightPct: 0 }];
  }

  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  const maxVal = chartData.length > 0 ? Math.max(...chartData.map(d => d.value)) : 0;
  
  const yAxisLabels = [
    `$${maxVal >= 1000 ? (maxVal / 1000).toFixed(0) + 'k' : maxVal}`,
    `$${maxVal >= 1000 ? (maxVal * 0.75 / 1000).toFixed(0) + 'k' : Math.round(maxVal * 0.75)}`,
    `$${maxVal >= 1000 ? (maxVal * 0.5 / 1000).toFixed(0) + 'k' : Math.round(maxVal * 0.5)}`,
    `$${maxVal >= 1000 ? (maxVal * 0.25 / 1000).toFixed(0) + 'k' : Math.round(maxVal * 0.25)}`,
    "£0"
  ];

  return (
    <div className={styles.chartCard} style={{ padding: 32, gap: 32 }}>
      <div className={styles.cardHeader}>
        <div className={styles.iconBox}>
          <Image src="/images/dashboard/finance/payment/chart.svg" alt="" width={24} height={24} />
        </div>
        <div>
          <h2 className={styles.cardTitle}>Revenue</h2>
          <p className={styles.cardSubtitle}>
            Monthly revenue breakdown
          </p>
        </div>
      </div>

      <hr className={styles.divider} />

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
            {chartData.map((col) => {
              const isActive = hoveredLabel === col.label;
              return (
                <div 
                  key={col.label} 
                  className={styles.barColumn}
                  onMouseEnter={() => setHoveredLabel(col.label)}
                  onMouseLeave={() => setHoveredLabel(null)}
                >
                  <div className={styles.barWrapper}>
                    <div className={styles.tooltip}>
                      £ <AnimatedNumber value={col.value} isActive={isActive} />
                    </div>
                    <div 
                      className={`${styles.barFill} ${isActive ? styles.barFillActive : ""}`} 
                      style={{ height: `${col.heightPct}%` }}
                    />
                  </div>
                  <div className={styles.xAxisLabel} style={{ fontSize: "10px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%", textAlign: "center" }}>{col.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
