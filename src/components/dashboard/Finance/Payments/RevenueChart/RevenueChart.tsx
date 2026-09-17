"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./RevenueChart.module.scss";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber/AnimatedNumber";

interface RevenueChartProps {
  chartData: { label: string; value: number; heightPct: number }[];
  title?: string;
  subtitle?: string;
}

const DEFAULT_EMPTY_MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

const EMPTY_Y_AXIS_LABELS = ["$450k", "$350k", "$250k", "$150k", "$0k"];

export default function RevenueChart({
  chartData,
  title = "Revenue",
  subtitle = "Monthly revenue breakdown",
}: RevenueChartProps) {
  const isEmpty = !chartData || chartData.length === 0 || chartData.every((d) => d.value === 0);

  const displayData = isEmpty
    ? DEFAULT_EMPTY_MONTHS.map((m) => ({ label: m, value: 0, heightPct: 0 }))
    : chartData;

  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  const maxVal = !isEmpty && displayData.length > 0 ? Math.max(...displayData.map((d) => d.value)) : 0;

  const formatAxisLabel = (val: number): string => {
    if (val === 0) return "$0k";
    if (val >= 1_000_000_000) return `$${Math.round(val / 1_000_000_000)}B`;
    if (val >= 1_000_000) return `$${Math.round(val / 1_000_000)}M`;
    if (val >= 1_000) return `$${Math.round(val / 1_000)}k`;
    return `$${Math.round(val).toLocaleString("en-US")}`;
  };

  const yAxisLabels = isEmpty
    ? EMPTY_Y_AXIS_LABELS
    : [
        formatAxisLabel(maxVal),
        formatAxisLabel(maxVal * 0.75),
        formatAxisLabel(maxVal * 0.5),
        formatAxisLabel(maxVal * 0.25),
        "$0k",
      ];

  return (
    <div className={styles.revenueChartCard}>
      <div className={styles.cardHeader}>
        <div className={styles.iconBox}>
          <Image src="/images/dashboard/finance/payment/chart.svg" alt="" width={24} height={24} />
        </div>
        <div>
          <h2 className={styles.cardTitle}>{title}</h2>
          <p className={styles.cardSubtitle}>{subtitle}</p>
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
          {yAxisLabels.map((_, i) => {
            if (i === yAxisLabels.length - 1) return null;
            return <div key={i} className={styles.gridLine} />;
          })}
        </div>

        {/* Chart Area */}
        <div className={styles.chartArea}>
          <div className={styles.chartBars}>
            {displayData.map((col) => {
              const isHovered = hoveredLabel === col.label;
              return (
                <div
                  key={col.label}
                  className={styles.barColumn}
                  onMouseEnter={() => setHoveredLabel(col.label)}
                  onMouseLeave={() => setHoveredLabel(null)}
                >
                  <div className={styles.barWrapper}>
                    <div
                      className={styles.tooltip}
                      style={{
                        bottom: col.value > 0 ? `calc(${col.heightPct}% + 16px)` : "23px",
                      }}
                    >
                      {col.value === 0 ? (
                        "0 k"
                      ) : (
                        <>
                          $ <AnimatedNumber value={Math.round(col.value)} isActive={isHovered} />
                        </>
                      )}
                    </div>
                    {col.value > 0 ? (
                      <div
                        className={`${styles.barFill} ${isHovered ? styles.barFillActive : ""}`}
                        style={{ height: `${col.heightPct}%` }}
                      />
                    ) : (
                      <div className={styles.barEmpty} />
                    )}
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
