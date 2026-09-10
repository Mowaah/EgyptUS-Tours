"use client";

import { useState } from "react";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber/AnimatedNumber";
import { formatCompactMetric } from "@/utils/formatMetric";
import styles from "./RevenueByDestinationChart.module.scss";

interface ChartData {
  label: string;
  value: number;
  percentage: number;
}

const defaultData: ChartData[] = [
  { label: "LUXOR", value: 256000, percentage: 57 },
  { label: "ASWAN", value: 292000, percentage: 65 },
  { label: "HURGHADA", value: 427000, percentage: 95 },
  { label: "DAHAB", value: 270000, percentage: 60 },
  { label: "SIWA", value: 283000, percentage: 63 },
];

const defaultGridLabels = ["$0", "$75k", "$150k", "$225k", "$300k", "$375k", "$450k"];

export interface RevenueByDestinationChartProps {
  title?: string;
  subtitle?: string;
  icon?: string;
  data?: ChartData[];
  gridLabels?: string[];
  tooltipFormat?: "revenue" | "booking";
  maxValue?: number;
  actions?: React.ReactNode;
}

export default function RevenueByDestinationChart({
  title = "Revenue by Destination in Egypt",
  subtitle = "Revenue distribution across destinations",
  icon = "booking-distribution",
  data = defaultData,
  gridLabels,
  tooltipFormat = "revenue",
  maxValue,
  actions,
}: RevenueByDestinationChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(0);

  const activeMaxVal = maxValue || Math.max(100, ...data.map(d => d.value));
  
  const activeGridLabels = gridLabels || [
    "$0",
    formatCompactMetric(activeMaxVal * 0.25, true),
    formatCompactMetric(activeMaxVal * 0.5, true),
    formatCompactMetric(activeMaxVal * 0.75, true),
    formatCompactMetric(activeMaxVal, true),
  ];

  return (
    <article className={styles.card}>
      <PanelHeader
        icon={icon}
        title={title}
        subtitle={subtitle}
        actions={actions}
      />

      <div className={styles.chartBody}>
        {data.length === 0 ? (
          <div className={styles.emptyMessage}>
            No destination revenue recorded for this period.
          </div>
        ) : (
          <div className={styles.chartGrid}>
            {/* Grid lines spanning the entire 2nd column */}
            <div className={styles.gridLines}>
              {activeGridLabels.map((label, idx) => (
                <div key={`${label}-${idx}`} className={styles.gridLine}>
                  <span className={styles.xLabel}>{label}</span>
                </div>
              ))}
            </div>

            {/* Data Rows */}
            {data.map((item, index) => {
              const isHovered = hoveredIdx === index;
              const widthPct = (item.value / activeMaxVal) * 100;
              
              return (
                <div 
                  key={item.label} 
                  className={`${styles.row} ${isHovered ? styles.active : ""}`}
                  onMouseEnter={() => setHoveredIdx(index)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <div className={`${styles.yLabel} ${isHovered ? styles.yLabelActive : ""}`}>
                    {item.label}
                  </div>
                  <div className={styles.barTrack}>
                    <div 
                      className={styles.barFill}
                      style={{ width: `${widthPct}%` }}
                    >
                      <div className={`${styles.tooltip} ${isHovered ? styles.tooltipVisible : ""}`}>
                        <span className={styles.tooltipText}>
                          {tooltipFormat === "revenue" ? (
                            <>
                              $
                              {item.value >= 1_000_000 ? (
                                <><AnimatedNumber value={Math.round(item.value / 1_000_000)} isActive={isHovered} />M</>
                              ) : item.value >= 1000 ? (
                                <><AnimatedNumber value={Math.round(item.value / 1000)} isActive={isHovered} />k</>
                              ) : (
                                <AnimatedNumber value={Math.round(item.value)} isActive={isHovered} />
                              )}
                            </>
                          ) : (
                            <>
                              <AnimatedNumber value={item.value} isActive={isHovered} /> Booking
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}
