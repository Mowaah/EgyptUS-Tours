import styles from "./StatsBar.module.scss";

const STATS = [
  { value: "10M+", label: "Total Customers" },
  { value: "09+", label: "Years Of Experience" },
  { value: "12K", label: "Total Destinations" },
  { value: "4.9", label: "Average Rating" },
];

export default function StatsBar() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.stats}>
        {STATS.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <span className={styles.value}>{stat.value}</span>
            <span className={styles.label}>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
