"use client";

import { useRef, useState } from "react";
import { months } from "../dashboardHomeData";
import type { ChartLine } from "../types";
import { pathFromPoints } from "./pathFromPoints";
import styles from "./LineChart.module.scss";

const EMPTY_Y_AXIS_LABELS = ["12K", "9K", "6K", "3K", "1K", "0"];

export interface EmptyIndicatorConfig {
  color?: string;
  borderColor?: string;
  lineStyle?: "dashed-full" | "solid-bottom";
  yFraction?: number;
}

interface LineChartProps {
  lines: ChartLine[];
  area?: boolean;
  xAxisLabels?: string[];
  emptyIndicator?: EmptyIndicatorConfig;
}

export default function LineChart({ 
  lines, 
  area = false,
  xAxisLabels,
  emptyIndicator,
}: LineChartProps) {
  const rawLabels = xAxisLabels && xAxisLabels.length > 0 ? xAxisLabels : months;
  const numPoints = lines[0]?.points.length || 0;
  const maxIndex = Math.max(0, numPoints - 1);
  let computedMax = 0;
  lines.forEach(line => line.points.forEach(p => {
    if (p > computedMax) computedMax = p;
  }));

  const isEmpty = computedMax === 0;
  const labels = rawLabels.length > 0 ? rawLabels : months;

  let maxValue = 10;
  let step = 2;

  if (!isEmpty) {
    const paddedMax = computedMax * 1.05;
    const minStep = Math.max(paddedMax / 5, 0.2); // Ensure we don't get 0
    const order = Math.pow(10, Math.floor(Math.log10(minStep)));
    const normalizedTick = minStep / order;

    let niceTick;
    if (normalizedTick <= 1) niceTick = 1;
    else if (normalizedTick <= 2) niceTick = 2;
    else if (normalizedTick <= 2.5) niceTick = 2.5;
    else if (normalizedTick <= 5) niceTick = 5;
    else niceTick = 10;

    step = niceTick * order;
    if (step === 0) step = 1;
    maxValue = step * 5;
  }

  const yAxisLabels = isEmpty
    ? EMPTY_Y_AXIS_LABELS
    : Array.from({ length: 6 }, (_, i) => {
        const val = maxValue - step * i;
        return val >= 1000 ? `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}K` : Math.round(val).toString();
      });

  const width = 980;
  const height = 250;

  const wrapRef = useRef<HTMLDivElement>(null);
  const [hoverData, setHoverData] = useState<{ index: number; x: number; y: number } | null>(null);

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isEmpty || numPoints === 0) return;
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

  // Empty indicator styling configuration
  const defaultIndicator: EmptyIndicatorConfig = area
    ? {
        color: "rgba(41, 113, 230, 0.5)",
        borderColor: "#C3DDFF",
        lineStyle: "solid-bottom",
        yFraction: 3 / 5, // Lands on 3K
      }
    : {
        color: "#FB7D91",
        borderColor: "#FFD1DE",
        lineStyle: "dashed-full",
        yFraction: 2 / 5, // Lands on 6K
      };

  const indicator = { ...defaultIndicator, ...emptyIndicator };

  // Calculate indicator position (at JUN / index 5 for 12 months)
  const emptyIndex = labels.length >= 12 ? 5 : Math.floor((labels.length - 1) / 2);
  const emptyLeftPercent = (emptyIndex / (labels.length - 1 || 1)) * 100;
  const emptyTopPercent = (indicator.yFraction ?? 0.5) * 100;
  const emptySvgX = (emptyIndex * width) / (labels.length - 1 || 1);
  const emptySvgY = (indicator.yFraction ?? 0.5) * height;

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
          style={{ cursor: isEmpty ? "default" : "crosshair", touchAction: "none" }}
          aria-hidden
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <line
              key={`h-${index}`}
              x1="0"
              x2={width}
              y1={(index * height) / 5}
              y2={(index * height) / 5}
              className={
                isEmpty
                  ? index === 5
                    ? styles.emptyGridLineSolid
                    : styles.emptyGridLine
                  : styles.gridLine
              }
            />
          ))}
          {labels.map((_, index) => (
            <line
              key={`v-${index}`}
              y1="0"
              y2={height}
              x1={(index * width) / (labels.length - 1 || 1)}
              x2={(index * width) / (labels.length - 1 || 1)}
              className={
                isEmpty
                  ? index === 0
                    ? styles.emptyGridLineSolid
                    : styles.emptyGridLine
                  : styles.gridLine
              }
            />
          ))}

          {/* Empty state SVG marker line */}
          {isEmpty ? (
            indicator.lineStyle === "solid-bottom" ? (
              <line
                x1={emptySvgX}
                x2={emptySvgX}
                y1={emptySvgY}
                y2={height}
                stroke={indicator.color}
                strokeWidth="2"
              />
            ) : (
              <line
                x1={emptySvgX}
                x2={emptySvgX}
                y1={0}
                y2={height}
                stroke={indicator.color}
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            )
          ) : null}

          {!isEmpty && area ? (
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

          {!isEmpty
            ? lines.map((line) => {
                const path = pathFromPoints(line.points, width, height, maxValue);
                const gradId = `areaGrad-${line.name.replace(/\s+/g, "-")}`;
                return (
                  <g key={line.name}>
                    {area && path ? (
                      <path d={`${path} L ${width} ${height} L 0 ${height} Z`} fill={`url(#${gradId})`} />
                    ) : null}
                    {path ? (
                      <path
                        d={path}
                        fill="none"
                        stroke={line.color}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ) : null}
                  </g>
                );
              })
            : null}

          {!isEmpty && hoverData !== null && numPoints > 0 ? (
            <line
              x1={(hoverData.index * width) / (maxIndex || 1)}
              x2={(hoverData.index * width) / (maxIndex || 1)}
              y1="0"
              y2={height}
              className={styles.markerLine}
            />
          ) : null}
        </svg>

        {/* Empty state HTML marker & tooltip */}
        {isEmpty ? (
          <div
            className={styles.emptyMarker}
            style={{
              left: `${emptyLeftPercent}%`,
              top: `${emptyTopPercent}%`,
            }}
          >
            <div
              className={styles.emptyMarkerOuter}
              style={{ borderColor: indicator.borderColor }}
            >
              <div
                className={styles.emptyMarkerInner}
                style={{ backgroundColor: indicator.color }}
              />
            </div>
            <div className={styles.emptyTooltip}>0</div>
          </div>
        ) : null}

        {!isEmpty && hoverData !== null && numPoints > 0
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

      {!isEmpty && hoverData !== null && numPoints > 0 ? (
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
