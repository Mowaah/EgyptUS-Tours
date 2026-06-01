import { destinations } from "./dashboardHomeData";
import styles from "./DashboardHome.module.scss";

const SIZE = 280;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R_OUTER = 130;
const R_INNER = 80;
const CORNER_R = 7;   // corner radius in px — matches Figma's border-radius: 5.09px
const GAP_DEG = 3;    // angular gap between segments

function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/**
 * Builds a donut segment path with rounded corners at all 4 edges.
 * Each corner uses a quadratic bezier curve (Q control endpoint) that approximates
 * the border-radius rounding shown in the Figma design.
 */
function roundedSegmentPath(
  cx: number, cy: number,
  rOuter: number, rInner: number,
  startDeg: number, endDeg: number
): string {
  // Angular offsets where each arc must step away from the corner to leave room for rounding
  const dOuter = (CORNER_R / rOuter) * (180 / Math.PI);
  const dInner = (CORNER_R / rInner) * (180 / Math.PI);
  const s = startDeg + GAP_DEG / 2;
  const e = endDeg - GAP_DEG / 2;
  const large = e - s > 180 ? 1 : 0;

  // 12 key points (3 per corner: arc-offset, radial-offset, corner-point for Q)
  const A  = polarToCartesian(cx, cy, rOuter, s + dOuter);   // outer arc start (after gap)
  const B  = polarToCartesian(cx, cy, rOuter, e - dOuter);   // outer arc end (before gap)
  const qB = polarToCartesian(cx, cy, rOuter, e);            // corner: outer-end
  const C  = polarToCartesian(cx, cy, rOuter - CORNER_R, e); // radial: top of end cut
  const D  = polarToCartesian(cx, cy, rInner + CORNER_R, e); // radial: bottom of end cut
  const qD = polarToCartesian(cx, cy, rInner, e);            // corner: inner-end
  const E  = polarToCartesian(cx, cy, rInner, e - dInner);   // inner arc end
  const F  = polarToCartesian(cx, cy, rInner, s + dInner);   // inner arc start
  const qF = polarToCartesian(cx, cy, rInner, s);            // corner: inner-start
  const G  = polarToCartesian(cx, cy, rInner + CORNER_R, s); // radial: bottom of start cut
  const H  = polarToCartesian(cx, cy, rOuter - CORNER_R, s); // radial: top of start cut
  const qH = polarToCartesian(cx, cy, rOuter, s);            // corner: outer-start

  return [
    `M ${A.x} ${A.y}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${B.x} ${B.y}`,  // outer arc
    `Q ${qB.x} ${qB.y} ${C.x} ${C.y}`,                   // round: outer-end corner
    `L ${D.x} ${D.y}`,                                     // down end radial cut
    `Q ${qD.x} ${qD.y} ${E.x} ${E.y}`,                   // round: inner-end corner
    `A ${rInner} ${rInner} 0 ${large} 0 ${F.x} ${F.y}`,  // inner arc (counter-clockwise)
    `Q ${qF.x} ${qF.y} ${G.x} ${G.y}`,                   // round: inner-start corner
    `L ${H.x} ${H.y}`,                                     // up start radial cut
    `Q ${qH.x} ${qH.y} ${A.x} ${A.y}`,                   // round: outer-start corner
    `Z`,
  ].join(" ");
}

export default function DestinationDonut() {
  const total = destinations.reduce((s, d) => s + d.value, 0);
  let cursor = 0;

  const segments = destinations.map((d) => {
    const startDeg = (cursor / total) * 360;
    cursor += d.value;
    const endDeg = (cursor / total) * 360;
    return { ...d, startDeg, endDeg };
  });

  return (
    <div className={styles.donutBlock}>
      <div className={styles.donutSvgWrap}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" height="100%" aria-label="Bookings by destination">
          {segments.map((seg) => (
            <path
              key={seg.label}
              d={roundedSegmentPath(CX, CY, R_OUTER, R_INNER, seg.startDeg, seg.endDeg)}
              fill={seg.color}
            />
          ))}
        </svg>
        <div className={styles.donutCenter}>
          <strong>147K</strong>
          <span>Booking</span>
        </div>
      </div>

      <div className={styles.destinationStats}>
        <div className={styles.destinationStatsCol}>
          {segments.slice(0, 2).map((seg) => (
            <div key={seg.label} className={styles.destinationStatCard}>
              <i style={{ backgroundColor: seg.color }} />
              <div>
                <strong>{seg.value}%</strong>
                <span>{seg.label}</span>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.destinationStatsCol}>
          {segments.slice(2).map((seg) => (
            <div key={seg.label} className={styles.destinationStatCard}>
              <i style={{ backgroundColor: seg.color }} />
              <div>
                <strong>{seg.value}%</strong>
                <span>{seg.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
