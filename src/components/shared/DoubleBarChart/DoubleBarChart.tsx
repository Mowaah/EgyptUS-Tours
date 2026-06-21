"use client";

import { useEffect, useState } from "react";
import styles from "./DoubleBarChart.module.scss";

export interface DoubleBarData {
  label: string;
  value1: number; // primary bar (solid) percentage 0-100
  value2: number; // secondary bar (faded) percentage 0-100
}

interface DoubleBarChartProps {
  data: DoubleBarData[];
  yAxisLabels?: string[];
}

const defaultYLabels = ["100", "75", "50", "25", "0"];

export default function DoubleBarChart({ 
  data, 
  yAxisLabels = defaultYLabels 
}: DoubleBarChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay to trigger animation after initial render
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const lineCount = yAxisLabels.length;

  return (
    <div className={styles.wrap}>
      <div className={styles.yAxis}>
        {yAxisLabels.map((label, i) => (
          <span key={`y-label-${i}`}>{label}</span>
        ))}
      </div>
      
      <div className={styles.chartArea}>
        {/* Horizontal grid lines */}
        <div className={styles.gridLines}>
          {Array.from({ length: lineCount }).map((_, index) => (
            <div key={`grid-${index}`} className={styles.gridLine} />
          ))}
        </div>

        {/* The Bars and Labels */}
        <div className={styles.barsContainer}>
          {data.map((item) => (
            <div key={item.label} className={styles.barGroup}>
              <div className={styles.doubleColumn}>
                <div className={styles.colWrap}>
                  <div 
                    className={styles.colPrimary} 
                    style={{ height: mounted ? `${item.value1}%` : "0%" }}
                  />
                </div>
                <div className={styles.colWrap}>
                  <div 
                    className={styles.colSecondary} 
                    style={{ height: mounted ? `${item.value2}%` : "0%" }}
                  />
                </div>
              </div>
              <div className={styles.xLabelWrap}>
                <span className={styles.xLabel}>{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
