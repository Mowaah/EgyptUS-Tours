"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../PaymentsPage/PaymentsPage.module.scss";

import { AnimatedNumber } from "@/components/shared/AnimatedNumber/AnimatedNumber";

export default function RevenueByDestination() {
  const chartData = [
    { month: "JAN", value: 350, heightPct: 77 },
    { month: "FEB", value: 320, heightPct: 71 },
    { month: "MAR", value: 260, heightPct: 57 },
    { month: "ABR", value: 240, heightPct: 53 },
    { month: "MAY", value: 330, heightPct: 73 },
    { month: "JUN", value: 160, heightPct: 35 },
    { month: "JUL", value: 400, heightPct: 88 },
    { month: "AUG", value: 260, heightPct: 57 },
    { month: "SEP", value: 290, heightPct: 64 },
    { month: "OCT", value: 230, heightPct: 51 },
    { month: "NOV", value: 270, heightPct: 60 },
    { month: "DEC", value: 360, heightPct: 80 },
  ];

  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  const yAxisLabels = ["$450k", "$350k", "$250k", "$150k", "$0k"];

  return (
    <div className={styles.chartCard} style={{ padding: 32, gap: 32 }}>
      <div className={styles.cardHeader}>
        <div className={styles.iconBox}>
          <Image src="/images/dashboard/finance/payment/chart.svg" alt="" width={24} height={24} />
        </div>
        <div>
          <h2 className={styles.cardTitle}>Revenue by Destination</h2>
          <p className={styles.cardSubtitle}>
            Cairo dominates (26%), but Siwa shows highest per-booking value ($734)
          </p>
        </div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.barChartContainer}>
        {/* Y Axis Labels */}
        <div className={styles.yAxis}>
          {yAxisLabels.map((label, i) => (
            <div key={label} className={styles.yAxisLine}>
              {label}
            </div>
          ))}
        </div>

        {/* Grid Lines Overlay */}
        <div className={styles.gridLines}>
          {yAxisLabels.map((label, i) => (
            <div 
              key={label} 
              className={i === yAxisLabels.length - 1 ? styles.gridLineSolid : styles.gridLine} 
            />
          ))}
        </div>

        {/* Chart Area */}
        <div className={styles.chartArea}>
          <div className={styles.chartBars}>
            {chartData.map((col) => {
              const isActive = hoveredMonth === col.month;
              return (
                <div 
                  key={col.month} 
                  className={styles.barColumn}
                  onMouseEnter={() => setHoveredMonth(col.month)}
                  onMouseLeave={() => setHoveredMonth(null)}
                >
                  <div className={styles.barWrapper}>
                    <div className={styles.tooltip}>
                      $ <AnimatedNumber value={col.value} isActive={isActive} />k
                    </div>
                    <div 
                      className={`${styles.barFill} ${isActive ? styles.barFillActive : ""}`} 
                      style={{ height: `${col.heightPct}%` }}
                    />
                  </div>
                  <div className={styles.xAxisLabel}>{col.month}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
