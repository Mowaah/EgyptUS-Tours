import { distribution } from "./dashboardHomeData";
import styles from "./DashboardHome.module.scss";

export default function DistributionChart() {
  return (
    <div className={styles.distChartWrap}>
      <div className={styles.distYAxis}>
        <span>5k</span>
        <span>4k</span>
        <span>3k</span>
        <span>2k</span>
        <span>1k</span>
        <span>0</span>
      </div>
      <div className={styles.distChartArea}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`grid-${index}`} className={styles.distGridLine} style={{ top: `${(index * 100) / 5}%` }} />
        ))}
        <div className={styles.distBars}>
          {distribution.map((item) => (
            <div className={styles.distBarCol} key={item.label}>
              <div className={styles.distBarTrack} />
              <div 
                className={styles.distBarFill} 
                style={{ height: `${item.value}%`, background: item.color }}
              >
                <span className={styles.distBarPct}>{item.value}%</span>
              </div>
              <span className={styles.distBarLabel}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
