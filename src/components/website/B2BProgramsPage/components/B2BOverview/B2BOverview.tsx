import styles from "./B2BOverview.module.scss";

export default function B2BOverview() {
  return (
    <section id="overview" className={styles.section}>
      <div className={styles.content}>
        <h2 className={styles.title}>Overview</h2>
        <div className={styles.descriptionWrap}>
          <p className={styles.description}>
            Our B2B division is dedicated to building long-term partnerships with
            companies seeking reliable, results-driven corporate event and travel
            solutions.
          </p>
          <p className={styles.description}>
            We work closely with decision-makers, HR leaders, and event managers
            to deliver seamless MICE experiences â€” from executive meetings and
            conferences to incentive retreats and large-scale corporate events.
          </p>
          <p className={styles.description}>
            With a structured process, transparent pricing, and full operational
            support, we position ourselves not just as a service provider, but as
            a trusted corporate event partner.
          </p>
        </div>
      </div>
    </section>
  );
}
