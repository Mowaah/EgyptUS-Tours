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
    }));
  }, [data]);

  const maxY = useMemo(() => {
    const maxVal = Math.max(...displayData.map((d) => d.avg_days), 0);
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

  const points = useMemo(() => {
    const n = displayData.length;
    return displayData.map((d, i) => {
      const x = n > 1 ? (i / (n - 1)) * 100 : 50;
      const scaledY = maxY > 0 ? 10 - (d.avg_days / maxY) * 10 : 10;
      return { x, y: Math.max(0, Math.min(10, scaledY)) };
    });
  }, [displayData, maxY]);

  const pathBlue = useMemo(() => getSmoothPath(points), [points]);
  const areaBlue = useMemo(() => {
    if (!pathBlue) return "";
    return `${pathBlue} L 100 10 L 0 10 Z`;
  }, [pathBlue]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!points.length) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const index = Math.round(percentage * (points.length - 1));
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const hoveredItem = hoverIndex !== null ? displayData[hoverIndex] : null;
  const hoverX = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex].x : 0;
  const hoverY = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex].y : 0;

  return (
    <article className={parentStyles.chartCard}>
      <PanelHeader
        icon="reports/avg_time"
        title="Avg Time to Convert"
        subtitle="By lead channel (Days)"
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
          {xAxisLabels.map((label) => (
            <span key={label} className={styles.xAxisLabel}>
              {label}
            </span>
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
            </defs>

            {/* Blue Area */}
            {areaBlue && <path d={areaBlue} fill="url(#blueGradient)" opacity="0.16" />}

            {/* Blue Line */}
            {pathBlue && (
              <path
                d={pathBlue}
                fill="none"
                stroke="#2388FF"
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
                top: `${hoverY * 10}%`,
              }}
            />

            {/* Hover Tooltip Point */}
            <div
              className={styles.tooltipPointOuter}
              style={{
                left: `${hoverX}%`,
                top: `${hoverY * 10}%`,
              }}
            >
              <div className={styles.tooltipPointInner} />
            </div>

            {/* Tooltip Box */}
            <div
              className={styles.tooltipBox}
              style={{
                left: `${hoverX}%`,
                top: `${hoverY * 10}%`,
              }}
            >
              {hoveredItem.label}: {hoveredItem.avg_days} Days
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
