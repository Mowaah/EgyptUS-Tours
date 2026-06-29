import styles from "./HatchedBarChart.module.scss";

export interface HatchedBarChartProps {
  data: {
    label: string;
    value: number; // percentage (0-100)
    color: string;
  }[];
  yAxisLabels: string[];
  barWidth?: number;
}

export default function HatchedBarChart({ data, yAxisLabels, barWidth }: HatchedBarChartProps) {
  const lineCount = yAxisLabels.length;
  const gapCount = Math.max(1, lineCount - 1);

  return (
    <div className={styles.wrap}>
      <div className={styles.yAxis}>
        {yAxisLabels.map((label, index) => (
          <span 
            key={`y-label-${index}`}
            style={{ top: `${(index * 100) / gapCount}%` }}
          >
            {label}
          </span>
        ))}
      </div>
      <div 
        className={styles.chartArea}
        style={barWidth ? { '--bar-width': `${barWidth}px` } as React.CSSProperties : undefined}
      >
        {Array.from({ length: lineCount }).map((_, index) => (
          <div
            key={`grid-${index}`}
            className={styles.gridLine}
            style={{ top: `${(index * 100) / gapCount}%` }}
          />
        ))}
        <div className={styles.bars}>
          {data.map((item) => (
            <div className={styles.barCol} key={item.label}>
              <div className={styles.barTrack} />
              <div
                className={styles.barFill}
                style={{ height: `${item.value}%`, background: item.color }}
              >
                <span className={styles.barPct}>{item.value}%</span>
              </div>
              <span className={styles.barLabel}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
