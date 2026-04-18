import React from 'react';
import styles from './B2BProcess.module.scss';

const STEPS = [
  {
    number: "01",
    title: "Understand Your Objectives",
    description: "We start by learning about your goals, audience, and expectations.",
    active: true,
  },
  {
    number: "02",
    title: "Design a Tailored Proposal",
    description: "A custom plan with transparent pricing and clear deliverables.",
    active: true,
  },
  {
    number: "03",
    title: "Venue & Logistics Setup",
    description: "Complete event infrastructure and coordination",
    active: true,
  },
  {
    number: "04",
    title: "Execute & Coordinate",
    description: "Seamless logistics, vendor management, and on-site support.",
    active: true,
  },
  {
    number: "05",
    title: "Measurable Experience",
    description: "Post-event reporting and feedback to ensure continuous improvement.",
    active: true,
  },
];

export default function B2BProcess() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Our Proven Corporate Process</h2>
        <p className={styles.subtitle}>A systematic approach that ensures every corporate event exceeds expectations.</p>
      </div>

      <div className={styles.timelineContainer}>
        {/* Background Lines */}
        <div className={styles.lineBase} />
        <div className={styles.lineProgress} />

        <div className={styles.steps}>
          {STEPS.map((step, idx) => (
            <div key={idx} className={styles.stepItem}>
              <div className={`${styles.circle} ${!step.active ? styles.inactive : ""}`}>
                <span className={styles.number}>{step.number}</span>
              </div>
              <div className={styles.content}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
