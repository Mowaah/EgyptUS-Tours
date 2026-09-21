import styles from "./HatchedBarChart.module.scss";

export interface HatchedBarChartProps {
  data: {
    label: string;
    value: number; // percentage (0-100)
    color: string;
    displayValue?: string; // Optional formatted string to show in the bar
  }[];
  yAxisLabels: string[];
  barWidth?: number;
  className?: string;
}

export default function HatchedBarChart({ data, yAxisLabels, barWidth, className }: HatchedBarChartProps) {
  const lineCount = yAxisLabels.length;
  const gapCount = Math.max(1, lineCount - 1);

  return (
    <div className={`${styles.wrap} ${className || ""}`.trim()}>
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
        {Array.from({ length: lineCount }).map((_, index) => {
          if (index === lineCount - 1) return null;
          return (
            <div
              key={`grid-${index}`}
              className={styles.gridLine}
              style={{ top: `${(index * 100) / gapCount}%` }}
            />
          );
        })}
        <div className={styles.bars}>
          {data.map((item, index) => {
            const isZero = item.value === 0;
            return (
              <div className={styles.barCol} key={`${item.label}-${index}`}>
                <div className={styles.barTrack} />
                <div
                  className={`${styles.barFill} ${isZero ? styles.barFillEmpty : ""}`}
                  style={{
                    height: isZero ? undefined : `${item.value}%`,
                    background: item.color,
                  }}
                >
                  <span className={styles.barPct}>
                    {item.displayValue !== undefined 
                      ? item.displayValue 
                      : (isZero ? "0" : `${Number.isInteger(item.value) ? item.value : item.value.toFixed(1)}%`)}
                  </span>
                </div>
                <span className={styles.barLabel} title={item.label}>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
