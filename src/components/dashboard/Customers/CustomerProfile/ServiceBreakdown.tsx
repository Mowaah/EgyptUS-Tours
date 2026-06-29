import Image from "next/image";
import RoundedDonutChart from "@/components/dashboard/shared/RoundedDonutChart/RoundedDonutChart";
import styles from "./ServiceBreakdown.module.scss";

export default function ServiceBreakdown() {
  const chartData = [
    { label: "Trips", value: 50, color: "#93C5FD" }, // Blue
    { label: "Hotels", value: 20, color: "#E9D5FF" }, // Purple
    { label: "Transportation", value: 30, color: "#FDBA74" }, // Orange
  ];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Image src="/images/dashboard/customers/overview/service.svg" alt="" width={24} height={24} aria-hidden />
        </div>
        <div className={styles.headerText}>
          <h2>Service Breakdown</h2>
          <p>Outstanding payments grouped by service type.</p>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <RoundedDonutChart 
          data={chartData}
          centerValue="50%"
          centerLabel="Trips"
        />
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.dot} ${styles.dotBlue}`} />
          <div className={styles.text}>
            <strong>50%</strong>
            <span>Trips</span>
          </div>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.dot} ${styles.dotPurple}`} />
          <div className={styles.text}>
            <strong>20%</strong>
            <span>Hotels</span>
          </div>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.dot} ${styles.dotOrange}`} />
          <div className={styles.text}>
            <strong>30%</strong>
            <span>Transportation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
