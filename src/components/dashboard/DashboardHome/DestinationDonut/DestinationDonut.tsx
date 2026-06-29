import { destinations } from "../dashboardHomeData";
import RoundedDonutChart from "@/components/dashboard/shared/RoundedDonutChart/RoundedDonutChart";
import styles from "./DestinationDonut.module.scss";

export default function DestinationDonut() {
  const chartData = destinations.map((d) => ({
    label: d.label,
    value: d.value,
    color: d.color,
  }));

  return (
    <div className={styles.block}>
      <RoundedDonutChart 
        data={chartData} 
        centerValue="147K" 
        centerLabel="Booking" 
      />

      <div className={styles.stats}>
        <div className={styles.statsCol}>
          {destinations.slice(0, 2).map((seg) => (
            <div key={seg.label} className={styles.statCard}>
              <i style={{ backgroundColor: seg.color }} />
              <div>
                <strong>{seg.value}%</strong>
                <span>{seg.label}</span>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.statsCol}>
          {destinations.slice(2).map((seg) => (
            <div key={seg.label} className={styles.statCard}>
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
