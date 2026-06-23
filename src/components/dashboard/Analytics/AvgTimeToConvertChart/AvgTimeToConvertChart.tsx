"use client";

import { useState } from "react";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";
import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import styles from "./AvgTimeToConvertChart.module.scss";

// 75 data points to map closely to the 5 horizontal segments
const dataBlue = [6.6, 6.4, 6.3, 6.3, 6.1, 6.1, 6.4, 6.4, 6.3, 6.4, 6.7, 6.7, 6.7, 6.4, 6.1, 6.2, 6.0, 6.0, 5.9, 5.9, 5.6, 5.8, 5.8, 5.9, 5.9, 6.0, 6.0, 5.8, 6.0, 6.1, 6.4, 6.5, 6.5, 6.4, 6.4, 6.5, 6.5, 6.4, 6.4, 6.3, 6.2, 6.2, 6.2, 6.4, 6.2, 6.6, 7.4, 7.1, 7.2, 6.5, 6.6, 6.3, 6.4, 6.4, 6.4, 6.2, 6.3, 6.3, 6.4, 6.2, 6.4, 6.2, 6.0, 6.0, 6.1, 6.0, 5.8, 5.9, 5.3, 5.4, 5.3, 5.4, 5.5, 5.5, 5.5, 5.5, 5.3, 5.7, 5.7, 6.0, 6.0];
const dataOrange = [3.6, 3.9, 3.7, 3.7, 3.6, 3.6, 3.8, 3.8, 4.2, 4.3, 4.0, 3.6, 3.5, 3.5, 3.5, 3.6, 3.6, 3.8, 3.8, 3.5, 3.3, 3.5, 3.4, 3.3, 3.0, 3.4, 3.5, 3.7, 3.6, 3.4, 3.4, 3.5, 3.4, 3.4, 3.5, 3.6, 3.4, 3.2, 3.0, 3.2, 3.3, 3.3, 3.1, 3.0, 3.0, 3.0, 3.0, 2.6, 2.4, 2.2, 2.2, 2.1, 2.0, 2.2, 2.4, 2.1, 1.8, 2.2, 2.1, 2.2, 2.6, 2.8, 2.9, 2.6, 2.6, 2.5, 2.9, 2.9, 2.6, 2.5, 2.6, 2.6, 2.8, 3.5, 4.6];

const generatePath = (dataArray: number[]) => {
  const stepX = 100 / (dataArray.length - 1);
  return dataArray.map((y, i) => {
    const x = i * stepX;
    const scaledY = 10 - y; // map 0-10 domain to 10-0 range
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${scaledY.toFixed(2)}`;
  }).join(' ');
};

const pathBlue = generatePath(dataBlue);
const pathOrange = generatePath(dataOrange);
const areaBlue = `${pathBlue} L 100 10 L 0 10 Z`;
const areaOrange = `${pathOrange} L 100 10 L 0 10 Z`;

const yAxisLabels = [10, 8, 6, 4, 2, 0];
const xAxisLabels = ["WEBSITE", "PHONE", "EMAIL", "WALK-IN", "SOCIAL MEDIA", "OTHERS"];

export default function AvgTimeToConvertChart() {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const index = Math.round(percentage * (dataBlue.length - 1));
    setHoverIndex(Math.max(0, Math.min(index, dataBlue.length - 1)));
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  let hoverX = 0;
  let hoverY = 0;
  let hoverVal = 0;
  if (hoverIndex !== null) {
    hoverX = (hoverIndex / (dataBlue.length - 1)) * 100;
    hoverVal = dataBlue[hoverIndex];
    hoverY = 10 - hoverVal;
  }

  return (
    <article className={parentStyles.chartCard}>
      <PanelHeader
        icon="reports/avg_time"
        title="Avg Time to Convert (days)"
        actions={<ExportButtons />}
      />

      <div className={styles.chartContainer}>
        {/* Grid Lines Overlay */}
        <div className={styles.gridLines}>
          {yAxisLabels.map((_, i) => (
            <div key={i} className={i === yAxisLabels.length - 1 ? styles.gridLineSolid : styles.gridLine} />
          ))}
        </div>

        {/* Y-Axis */}
        <div className={styles.yAxis}>
          {yAxisLabels.map(label => (
            <span key={label} className={styles.yAxisLabel}>{label}</span>
          ))}
        </div>

        {/* X-Axis */}
        <div className={styles.xAxis}>
          {xAxisLabels.map((label) => (
            <span key={label} className={styles.xAxisLabel}>{label}</span>
          ))}
        </div>

        {/* SVG Chart */}
        <div className={styles.svgWrapper}>
          <svg 
            viewBox="0 0 100 10" 
            preserveAspectRatio="none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: "crosshair" }}
          >
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2388FF" />
                <stop offset="48.25%" stopColor="#8DC1FF" />
                <stop offset="103.37%" stopColor="rgba(255, 255, 255, 0.16)" />
              </linearGradient>
              <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FDBA74" />
                <stop offset="48.25%" stopColor="rgba(253, 186, 116, 0.5)" />
                <stop offset="103.37%" stopColor="rgba(255, 255, 255, 0.16)" />
              </linearGradient>
            </defs>

            {/* Blue Area */}
            <path d={areaBlue} fill="url(#blueGradient)" opacity="0.12" />
            
            {/* Orange Area */}
            <path d={areaOrange} fill="url(#orangeGradient)" opacity="0.32" />

            {/* Blue Line */}
            <path d={pathBlue} fill="none" stroke="#2388FF" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            
            {/* Orange Line */}
            <path d={pathOrange} fill="none" stroke="#FDBA74" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>

        {/* Interactive Tooltip Overlay (HTML instead of SVG to avoid distortion) */}
        {hoverIndex !== null && (
          <div className={styles.tooltipContainer}>
            {/* Vertical Marker Line */}
            <div 
              className={styles.tooltipMarkerLine} 
              style={{ 
                left: `${hoverX}%`, 
                top: `${hoverY * 10}%` 
              }} 
            />

            {/* Hover Tooltip Point */}
            <div 
              className={styles.tooltipPointOuter}
              style={{
                left: `${hoverX}%`,
                top: `${hoverY * 10}%`
              }}
            >
              <div className={styles.tooltipPointInner} />
            </div>
            
            {/* Tooltip Box */}
            <div 
              className={styles.tooltipBox}
              style={{
                left: `${hoverX}%`,
                top: `${hoverY * 10}%`
              }}
            >
              {hoverVal.toFixed(1)}M
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
