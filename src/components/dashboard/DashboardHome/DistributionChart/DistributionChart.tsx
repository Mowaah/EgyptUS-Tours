import { distribution } from "../dashboardHomeData";
import styles from "./DistributionChart.module.scss";

export default function DistributionChart() {
  return (
    <div className={styles.wrap}>
      <div className={styles.yAxis}>
        <span>5k</span>
        <span>4k</span>
        <span>3k</span>
        <span>2k</span>
        <span>1k</span>
        <span>0</span>
      </div>
      <div className={styles.chartArea}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`grid-${index}`}
            className={styles.gridLine}
            style={{ top: `${(index * 100) / 5}%` }}
          />
        ))}
        <div className={styles.bars}>
          {distribution.map((item) => (
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
