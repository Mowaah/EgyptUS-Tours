import type { DestinationItem } from "../types";
import RoundedDonutChart from "@/components/dashboard/shared/RoundedDonutChart/RoundedDonutChart";
import styles from "./DestinationDonut.module.scss";

interface DestinationDonutProps {
  destinations: DestinationItem[];
  centerValue?: string | number;
}

export default function DestinationDonut({ destinations = [], centerValue = "0" }: DestinationDonutProps) {
  const chartData = destinations.map((d) => ({
    label: d.label,
    value: d.value,
    color: d.color,
  }));

  return (
    <div className={styles.block}>
      <RoundedDonutChart 
        data={chartData} 
        centerValue={String(centerValue)} 
        centerLabel="Bookings" 
      />

      <div className={styles.stats}>
        <div className={styles.statsCol}>
          {destinations.slice(0, 2).map((seg) => (
            <div key={seg.label} className={styles.statCard}>
              <i style={{ backgroundColor: seg.color }} />
              <div>
                <strong>{seg.value}</strong>
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
                <strong>{seg.value}</strong>
                <span>{seg.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
