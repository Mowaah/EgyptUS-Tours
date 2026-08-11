"use client";

import { useRef, useState } from "react";
import { months } from "../dashboardHomeData";
import type { ChartLine } from "../types";
import { pathFromPoints } from "./pathFromPoints";
import styles from "./LineChart.module.scss";

interface LineChartProps {
  lines: ChartLine[];
  area?: boolean;
  xAxisLabels?: string[];
}

export default function LineChart({ 
  lines, 
  area = false,
  xAxisLabels,
}: LineChartProps) {
  const labels = xAxisLabels || months;
  const numPoints = lines[0]?.points.length || 0;
  const maxIndex = Math.max(0, numPoints - 1);
  let computedMax = 0;
  lines.forEach(line => line.points.forEach(p => {
    if (p > computedMax) computedMax = p;
  }));

  let maxValue = Math.ceil(computedMax * 1.15);
  if (maxValue <= 0) maxValue = 10;

  let tickSize = maxValue / 5;
  const order = Math.pow(10, Math.floor(Math.log10(tickSize || 1)));
  const normalizedTick = tickSize / order;

  let niceTick;
  if (normalizedTick <= 1) niceTick = 1;
  else if (normalizedTick <= 2) niceTick = 2;
  else if (normalizedTick <= 2.5) niceTick = 2.5;
  else if (normalizedTick <= 5) niceTick = 5;
  else niceTick = 10;

  let step = niceTick * order;
  if (step === 0) step = 1;
  maxValue = step * 5;

  const yAxisLabels = Array.from({ length: 6 }, (_, i) => {
    const val = maxValue - step * i;
    return val >= 1000 ? `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}K` : Math.round(val).toString();
  });
  const width = 980;
  const height = 250;

  const wrapRef = useRef<HTMLDivElement>(null);
  const [hoverData, setHoverData] = useState<{ index: number; x: number; y: number } | null>(null);

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const fraction = x / rect.width;
    const index = Math.max(0, Math.min(maxIndex, Math.round(fraction * maxIndex)));

    if (wrapRef.current) {
      const wrapRect = wrapRef.current.getBoundingClientRect();
      setHoverData({
        index,
        x: e.clientX - wrapRect.left,
        y: e.clientY - wrapRect.top,
      });
    }
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <div className={styles.yAxis}>
        {yAxisLabels.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
      <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 0 }}>
        <svg
          className={styles.chart}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoverData(null)}
          style={{ cursor: "crosshair", touchAction: "none" }}
          aria-hidden
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <line
              key={`h-${index}`}
              x1="0"
              x2={width}
              y1={(index * height) / 5}
              y2={(index * height) / 5}
              className={styles.gridLine}
            />
          ))}
          {labels.map((_, index) => (
            <line
              key={`v-${index}`}
              y1="0"
              y2={height}
              x1={(index * width) / (maxIndex || 1)}
              x2={(index * width) / (maxIndex || 1)}
              className={styles.gridLine}
            />
          ))}
          {area ? (
            <defs>
              {lines.map((line) => {
                const gradColor = line.areaColor ?? line.color;
                const gradId = `areaGrad-${line.name.replace(/\s+/g, "-")}`;
                return (
                  <linearGradient
                    key={gradId}
                    id={gradId}
                    gradientUnits="userSpaceOnUse"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2={height}
                  >
                    <stop offset="0%" stopColor={gradColor} stopOpacity="0.7" />
                    <stop offset="100%" stopColor={gradColor} stopOpacity="0" />
                  </linearGradient>
                );
              })}
            </defs>
          ) : null}
          {lines.map((line) => {
            const path = pathFromPoints(line.points, width, height, maxValue);
            const gradId = `areaGrad-${line.name.replace(/\s+/g, "-")}`;
            return (
              <g key={line.name}>
                {area ? (
                  <path d={`${path} L ${width} ${height} L 0 ${height} Z`} fill={`url(#${gradId})`} />
                ) : null}
                <path
                  d={path}
                  fill="none"
                  stroke={line.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            );
          })}
          {hoverData !== null ? (
            <line
              x1={(hoverData.index * width) / (maxIndex || 1)}
              x2={(hoverData.index * width) / (maxIndex || 1)}
              y1="0"
              y2={height}
              className={styles.markerLine}
            />
          ) : null}
        </svg>

        {hoverData !== null
          ? lines.map((line, i) => {
              const leftPercent = (hoverData.index / (maxIndex || 1)) * 100;
              const topPercent = (1 - (line.points[hoverData.index] ?? 0) / maxValue) * 100;
              return (
                <div
                  key={`marker-${i}`}
                  style={{
                    position: "absolute",
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`,
                    transform: "translate(-50%, -50%)",
                    width: "15px",
                    height: "15px",
                    backgroundColor: "#fff",
                    border: `1.5px solid ${line.color.startsWith("#") ? `${line.color}66` : line.color.replace(/[\d.]+\)$/, "0.4)")}`,
                    borderRadius: "50%",
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 5,
                  }}
                >
                  <div
                    style={{
                      width: "7px",
                      height: "7px",
                      backgroundColor: line.color,
                      borderRadius: "50%",
                    }}
                  />
                </div>
              );
            })
          : null}
      </div>

      {hoverData !== null ? (
        <div
          className={styles.tooltip}
          style={{
            left: Math.min(
              hoverData.x + 20,
              wrapRef.current ? wrapRef.current.offsetWidth - 120 : 0
            ),
            top: Math.max(10, hoverData.y - 40),
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            padding: "10px 12px",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, marginBottom: "2px" }}>
            {labels[hoverData.index]}
          </div>
          {lines.map((line) => {
            const val = line.points[hoverData.index] ?? 0;
            const displayVal = val >= 1000 ? `${(val / 1000).toFixed(1)}K` : val.toString();
            return (
              <div
                key={line.name}
                style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: line.color,
                  }}
                />
                <span style={{ color: "#4b5563", whiteSpace: "nowrap" }}>{line.name}:</span>
                <span style={{ fontWeight: 700, marginLeft: "auto" }}>{displayVal}</span>
              </div>
            );
          })}
        </div>
      ) : null}
      <div className={styles.months}>
        {labels.map((label, i) => {
          const showLabel = labels.length <= 12 || i % Math.ceil(labels.length / 8) === 0 || i === labels.length - 1;
          return (
            <span key={i} style={{ opacity: showLabel ? 1 : 0, pointerEvents: "none" }}>
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
