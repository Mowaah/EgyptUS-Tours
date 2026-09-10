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
  
  const formatAxisLabel = (val: number): string => {
    if (val === 0) return "$0";
    if (val >= 1_000_000_000) return `$${Math.round(val / 1_000_000_000)}B`;
    if (val >= 1_000_000) return `$${Math.round(val / 1_000_000)}M`;
    if (val >= 1_000) return `$${Math.round(val / 1_000)}k`;
    return `$${Math.round(val).toLocaleString("en-US")}`;
  };

  const yAxisLabels = [
    formatAxisLabel(maxVal),
    formatAxisLabel(maxVal * 0.75),
    formatAxisLabel(maxVal * 0.5),
    formatAxisLabel(maxVal * 0.25),
    "$0",
  ];

  return (
    <div className={styles.revenueChartCard}>
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
                      $ <AnimatedNumber value={Math.round(col.value)} isActive={isActive} />
                    </div>
                    <div 
                      className={`${styles.barFill} ${isActive ? styles.barFillActive : ""}`} 
                      style={{ height: `${col.heightPct}%` }}
                    />
                  </div>
                  <div className={styles.xAxisLabel}>{col.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
