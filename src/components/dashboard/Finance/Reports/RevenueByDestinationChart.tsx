"use client";

import { useState } from "react";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber/AnimatedNumber";
import styles from "./RevenueByDestinationChart.module.scss";

interface ChartData {
  label: string;
  value: number;
  percentage: number;
}

const data: ChartData[] = [
  { label: "LUXOR", value: 256000, percentage: 57 },
  { label: "ASWAN", value: 292000, percentage: 65 },
  { label: "HURGHADA", value: 427000, percentage: 95 },
  { label: "DAHAB", value: 270000, percentage: 60 },
  { label: "SIWA", value: 283000, percentage: 63 },
];

const gridLabels = ["$0K", "$75K", "$150K", "$225K", "$300K", "$375K", "$450K"];

export default function RevenueByDestinationChart() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(2); // Default Hurghada to be hovered as in mockup?

  return (
    <article className={styles.card}>
      <PanelHeader
        icon="booking-distribution"
        title="Revenue by Destination in Egypt"
        subtitle="Cairo dominates (26%), but Siwa shows highest per-booking value ($734)"
      />

      <div className={styles.chartBody}>
        <div className={styles.chartGrid}>
          {/* Grid lines spanning the entire 2nd column */}
          <div className={styles.gridLines}>
            {gridLabels.map((label) => (
              <div key={label} className={styles.gridLine}>
                <span className={styles.xLabel}>{label}</span>
              </div>
            ))}
          </div>

          {/* Data Rows */}
          {data.map((item, index) => {
            const isHovered = hoveredIdx === index;
            const widthPct = (item.value / 450000) * 100;
            
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
                        $
                        {item.value >= 1000 ? (
                          <>
                            <AnimatedNumber value={Math.round(item.value / 1000)} isActive={isHovered} />K
                          </>
                        ) : (
                          <AnimatedNumber value={item.value} isActive={isHovered} />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}
