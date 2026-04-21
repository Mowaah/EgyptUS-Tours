import styles from './EventsStats.module.scss';

const STATS = [
  { value: "120+", label: "Corporate Events" },
  { value: "97%", label: "Client Satisfaction" },
  { value: "+15", label: "Countries Covered" },
  { value: "+10K", label: "Atendees Managed" },
];

export default function EventsStats() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.statsGrid}>
          {STATS.map((stat, idx) => (
            <div key={idx} className={styles.statItem}>
              <span className={styles.value}>{stat.value}</span>
              <span className={styles.label}>{stat.label}</span>
            </div>
          ))}
        </div>

        <h4 className={styles.trustTitle}>TRUSTED BY LEADING ORGANIZATIONS</h4>
      </div>
    </section>
  );
}
