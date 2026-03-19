import styles from "./StatsSection.module.scss";

const STATS = [
  {
    value: "73K+",
    description:
      "Join the millions who trust us for their travel plans. Our platform has successfully handled over 1 million bookings.",
  },
  {
    value: "99%",
    description:
      "Our customers love us! With a 96% satisfaction rate, we pride ourselves on providing exceptional service.",
  },
  {
    value: "1200",
    description:
      "Explore the world with us! We offer travel packages to over 200 destinations, giving you a wide range of options!",
  },
];

export default function StatsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {STATS.map((stat, i) => (
          <div key={i} className={styles.stat}>
            <span className={styles.value}>{stat.value}</span>
            <p className={styles.description}>{stat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
