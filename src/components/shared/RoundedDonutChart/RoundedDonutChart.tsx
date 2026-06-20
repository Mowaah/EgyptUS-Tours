import styles from "./RoundedDonutChart.module.scss";

export interface DonutSegmentData {
  label: string;
  value: number;
  color: string;
}

interface RoundedDonutChartProps {
  data: DonutSegmentData[];
  centerValue?: React.ReactNode;
  centerLabel?: React.ReactNode;
  size?: number;
}

const DEFAULT_SIZE = 280;
const R_OUTER = 130;
const R_INNER = 80;
const CORNER_R = 7;
const GAP_DEG = 3;

function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    x: (cx + r * Math.cos(rad)).toFixed(2),
    y: (cy + r * Math.sin(rad)).toFixed(2),
  };
}

function roundedSegmentPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startDeg: number,
  endDeg: number
): string {
  const dOuter = (CORNER_R / rOuter) * (180 / Math.PI);
  const dInner = (CORNER_R / rInner) * (180 / Math.PI);
  const s = startDeg + GAP_DEG / 2;
  const e = endDeg - GAP_DEG / 2;
  const large = e - s > 180 ? 1 : 0;

  const A = polarToCartesian(cx, cy, rOuter, s + dOuter);
  const B = polarToCartesian(cx, cy, rOuter, e - dOuter);
  const qB = polarToCartesian(cx, cy, rOuter, e);
  const C = polarToCartesian(cx, cy, rOuter - CORNER_R, e);
  const D = polarToCartesian(cx, cy, rInner + CORNER_R, e);
  const qD = polarToCartesian(cx, cy, rInner, e);
  const E = polarToCartesian(cx, cy, rInner, e - dInner);
  const F = polarToCartesian(cx, cy, rInner, s + dInner);
  const qF = polarToCartesian(cx, cy, rInner, s);
  const G = polarToCartesian(cx, cy, rInner + CORNER_R, s);
  const H = polarToCartesian(cx, cy, rOuter - CORNER_R, s);
  const qH = polarToCartesian(cx, cy, rOuter, s);

  return [
    `M ${A.x} ${A.y}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${B.x} ${B.y}`,
    `Q ${qB.x} ${qB.y} ${C.x} ${C.y}`,
    `L ${D.x} ${D.y}`,
    `Q ${qD.x} ${qD.y} ${E.x} ${E.y}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${F.x} ${F.y}`,
    `Q ${qF.x} ${qF.y} ${G.x} ${G.y}`,
    `L ${H.x} ${H.y}`,
    `Q ${qH.x} ${qH.y} ${A.x} ${A.y}`,
    `Z`,
  ].join(" ");
}

export default function RoundedDonutChart({ data, centerValue, centerLabel, size = DEFAULT_SIZE }: RoundedDonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  let cursor = 0;

  const segments = data.map((d) => {
    const startDeg = (cursor / total) * 360;
    cursor += d.value;
    const endDeg = (cursor / total) * 360;
    return { ...d, startDeg, endDeg };
  });

  return (
    <div className={styles.svgWrap}>
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" aria-label="Donut chart">
        {segments.map((seg) => (
          <path
            key={seg.label}
            d={roundedSegmentPath(cx, cy, R_OUTER, R_INNER, seg.startDeg, seg.endDeg)}
            fill={seg.color}
          />
        ))}
      </svg>
      <div className={styles.center}>
        {centerValue && <strong>{centerValue}</strong>}
        {centerLabel && <span>{centerLabel}</span>}
      </div>
    </div>
  );
}
