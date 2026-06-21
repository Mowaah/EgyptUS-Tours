"use client";

import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import styles from "./SeasonalRevenueHeatmap.module.scss";

type HeatLevel = 1 | 2 | 3;

interface HeatmapRow {
  label: string;
  data: HeatLevel[];
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const heatmapData: HeatmapRow[] = [
  {
    label: "Trips",
    data: [2, 3, 1, 2, 1, 2, 2, 3, 1, 3, 1, 2],
  },
  {
    label: "Hotels",
    data: [2, 1, 3, 3, 3, 1, 2, 3, 1, 3, 1, 2],
  },
  {
    label: "Transport",
    data: [1, 1, 3, 1, 3, 1, 2, 1, 3, 3, 1, 2],
  },
  {
    label: "MICE",
    data: [3, 2, 1, 1, 2, 1, 2, 1, 3, 1, 1, 2],
  },
];

export default function SeasonalRevenueHeatmap() {
  const getLevelClass = (level: HeatLevel) => {
    switch (level) {
      case 1: return styles.level1;
      case 2: return styles.level2;
      case 3: return styles.level3;
      default: return styles.level1;
    }
  };

  return (
    <article className={styles.card}>
      <PanelHeader
        icon="finance/payment/seasonal"
        title="Seasonal Revenue Heatmap"
        subtitle="Peak season: Oct-Dec & Mar — MICE dead zone in Jul-Aug (Ramadan/Summer)"
      />

      <div className={styles.heatmapContainer}>
        <div className={styles.grid}>
          {heatmapData.map((row, rowIndex) => (
            <div key={row.label} style={{ display: 'contents' }}>
              <div className={styles.rowLabel}>{row.label}</div>
              {row.data.map((level, colIndex) => (
                <div 
                  key={`${rowIndex}-${colIndex}`} 
                  className={`${styles.block} ${getLevelClass(level)}`} 
                />
              ))}
            </div>
          ))}

          {/* X Axis Labels */}
          <div className={styles.monthLabelRow}>
            {/* Empty cell for row labels column */}
            <div />
            {months.map((month) => (
              <div key={month} className={styles.monthLabel}>
                {month}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className={styles.legendArea}>
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span className={styles.legendLabel}>&lt; 50</span>
              <div className={`${styles.legendColor} ${styles.level1}`} />
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendLabel}>50-200</span>
              <div className={`${styles.legendColor} ${styles.level2}`} />
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendLabel}>&gt;200</span>
              <div className={`${styles.legendColor} ${styles.level3}`} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
