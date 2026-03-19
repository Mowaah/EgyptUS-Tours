import { Button } from "@/components/shared";
import styles from "./CtaBanner.module.scss";

export default function CtaBanner() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.heading}>Ready to Plan Your Next Corporate Event?</h2>
          <p className={styles.description}>
            Our expert team is ready to create a customized proposal for your organization&apos;s unique requirements.
          </p>
          <Button variant="secondary" href="/contact">
            Request a Proposal
          </Button>
        </div>
      </div>
    </section>
  );
}
