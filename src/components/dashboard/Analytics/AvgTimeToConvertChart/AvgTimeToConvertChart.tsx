"use client";

import React, { useState, useMemo } from "react";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import styles from "./AvgTimeToConvertChart.module.scss";
import type { AvgTimeToConvertItem } from "@/services/admin/adminReportsService";

interface AvgTimeToConvertChartProps {
  data?: AvgTimeToConvertItem[];
  actions?: React.ReactNode;
}

const DEFAULT_CHANNELS = ["Website", "Phone", "Email", "Walk-In", "Social Media", "Others"];

const getSmoothPath = (points: { x: number; y: number }[]) => {
  if (!points.length) return "";
  if (points.length === 1) return `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

  let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return path;
};

export default function AvgTimeToConvertChart({ data = [], actions }: AvgTimeToConvertChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const displayData = useMemo(() => {
    if (data && data.length > 0) {
      return data;
    }
    return DEFAULT_CHANNELS.map((ch) => ({
      channel: ch.toLowerCase().replace(/\s+/g, "_"),
      label: ch,
      avg_days: 0,
      converted_count: 0,
      lost_count: 0,
    }));
  }, [data]);

  const maxY = useMemo(() => {
    const maxVal = Math.max(
      ...displayData.map((d) => Math.max(d.converted_count, d.lost_count)),
      0
    );
    if (maxVal === 0) return 10;
    return Math.max(Math.ceil(maxVal * 1.2), 5);
  }, [displayData]);

  const yAxisLabels = useMemo(() => {
    return [
      maxY.toString(),
      (Math.round(maxY * 0.8 * 10) / 10).toString(),
      (Math.round(maxY * 0.6 * 10) / 10).toString(),
      (Math.round(maxY * 0.4 * 10) / 10).toString(),
      (Math.round(maxY * 0.2 * 10) / 10).toString(),
      "0",
    ];
  }, [maxY]);

  const xAxisLabels = useMemo(() => {
    return displayData.map((d) => d.label.toUpperCase());
  }, [displayData]);

  const pointsConverted = useMemo(() => {
    const n = displayData.length;
    return displayData.map((d, i) => {
      const x = n > 1 ? (i / (n - 1)) * 100 : 50;
      const scaledY = maxY > 0 ? 10 - (d.converted_count / maxY) * 10 : 10;
      return { x, y: Math.max(0, Math.min(10, scaledY)) };
    });
  }, [displayData, maxY]);

  const pointsLost = useMemo(() => {
    const n = displayData.length;
    return displayData.map((d, i) => {
      const x = n > 1 ? (i / (n - 1)) * 100 : 50;
      const scaledY = maxY > 0 ? 10 - (d.lost_count / maxY) * 10 : 10;
      return { x, y: Math.max(0, Math.min(10, scaledY)) };
    });
  }, [displayData, maxY]);

  const pathConverted = useMemo(() => getSmoothPath(pointsConverted), [pointsConverted]);
  const areaConverted = useMemo(() => {
    if (!pathConverted) return "";
    return `${pathConverted} L 100 10 L 0 10 Z`;
  }, [pathConverted]);

  const pathLost = useMemo(() => getSmoothPath(pointsLost), [pointsLost]);
  const areaLost = useMemo(() => {
    if (!pathLost) return "";
    return `${pathLost} L 100 10 L 0 10 Z`;
  }, [pathLost]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!pointsConverted.length) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const index = Math.round(percentage * (pointsConverted.length - 1));
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const hoveredItem = hoverIndex !== null ? displayData[hoverIndex] : null;
  const hoverX = hoverIndex !== null && pointsConverted[hoverIndex] ? pointsConverted[hoverIndex].x : 0;
  const hoverYConverted = hoverIndex !== null && pointsConverted[hoverIndex] ? pointsConverted[hoverIndex].y : 0;
  const hoverYLost = hoverIndex !== null && pointsLost[hoverIndex] ? pointsLost[hoverIndex].y : 0;

  return (
    <article className={parentStyles.chartCard}>
      <PanelHeader
        icon="reports/avg_time"
        title="Converted vs Lost Leads"
        subtitle="By lead channel (Count)"
        actions={actions}
      />

      <div className={styles.chartContainer}>
        {/* Grid Lines Overlay */}
        <div className={styles.gridLines}>
          {yAxisLabels.map((_, i) => (
            <div
              key={i}
              className={i === yAxisLabels.length - 1 ? styles.gridLineSolid : styles.gridLine}
            />
          ))}
        </div>

        {/* Y-Axis */}
        <div className={styles.yAxis}>
          {yAxisLabels.map((label) => (
            <span key={label} className={styles.yAxisLabel}>
              {label}
            </span>
          ))}
        </div>

        {/* X-Axis */}
        <div className={styles.xAxis}>
          {xAxisLabels.map((label, i) => {
            const xPos = xAxisLabels.length > 1 ? (i / (xAxisLabels.length - 1)) * 100 : 50;
            return (
              <span 
                key={label} 
                className={styles.xAxisLabel}
                style={{ 
                  left: `${xPos}%`,
                  transform: 'translateX(-50%)',
                  textAlign: 'center',
                }}
                title={label}
              >
                {label}
              </span>
            );
          })}
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
              <linearGradient id="convertedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3DB37C" />
                <stop offset="100%" stopColor="rgba(61, 179, 124, 0)" />
              </linearGradient>
              <linearGradient id="lostGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FDBA74" />
                <stop offset="100%" stopColor="rgba(253, 186, 116, 0)" />
              </linearGradient>
            </defs>

            {areaConverted && <path d={areaConverted} fill="url(#convertedGradient)" opacity="0.15" />}
            {areaLost && <path d={areaLost} fill="url(#lostGradient)" opacity="0.15" />}

            {pathConverted && (
              <path
                d={pathConverted}
                fill="none"
                stroke="#3DB37C"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
            )}
            {pathLost && (
              <path
                d={pathLost}
                fill="none"
                stroke="#FDBA74"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>
        </div>

        {/* Interactive Tooltip Overlay */}
        {hoverIndex !== null && hoveredItem && (
          <div className={styles.tooltipContainer}>
            {/* Vertical Marker Line */}
            <div
              className={styles.tooltipMarkerLine}
              style={{
                left: `${hoverX}%`,
                top: `${Math.min(hoverYConverted, hoverYLost) * 10}%`,
                height: `${(10 - Math.min(hoverYConverted, hoverYLost)) * 10}%`
              }}
            />

            {/* Converted Tooltip Point */}
            <div
              className={`${styles.tooltipPointOuter} ${styles.tooltipPointOuterConverted}`}
              style={{
                left: `${hoverX}%`,
                top: `${hoverYConverted * 10}%`,
              }}
            >
              <div className={`${styles.tooltipPointInner} ${styles.tooltipPointInnerConverted}`} />
            </div>

            {/* Lost Tooltip Point */}
            <div
              className={`${styles.tooltipPointOuter} ${styles.tooltipPointOuterLost}`}
              style={{
                left: `${hoverX}%`,
                top: `${hoverYLost * 10}%`,
              }}
            >
              <div className={`${styles.tooltipPointInner} ${styles.tooltipPointInnerLost}`} />
            </div>

            {/* Tooltip Box */}
            <div
              className={styles.tooltipBox}
              style={{
                left: `${hoverX}%`,
                top: `${Math.min(hoverYConverted, hoverYLost) * 10}%`,
              }}
            >
              <div className={styles.tooltipBoxTitle}>{hoveredItem.label}</div>
              <div className={styles.tooltipBoxRow}>
                <span className={styles.tooltipDotConverted}></span>
                <span>Converted: {hoveredItem.converted_count}</span>
              </div>
              <div className={styles.tooltipBoxRow}>
                <span className={styles.tooltipDotLost}></span>
                <span>Lost: {hoveredItem.lost_count}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
