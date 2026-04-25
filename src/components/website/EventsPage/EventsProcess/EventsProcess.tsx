import React from "react";
import styles from "./EventsProcess.module.scss";

const STEPS = [
  {
    number: "01",
    title: "Consultation",
    description: "Understanding your event objectives and requirements",
    active: true,
  },
  {
    number: "02",
    title: "Proposal & Planning",
    description: "Detailed proposal with venue options and pricing",
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
    title: "Event Execution",
    description: "On-site management and technical support",
    active: true,
  },
  {
    number: "05",
    title: "Post-Event Reporting",
    description: "Comprehensive reporting and feedback analysis",
    active: false,
  },
];

export default function EventsProcess() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Our Events’ Process</h2>
        <p className={styles.subtitle}>Structured approach ensuring flawless execution</p>
      </div>

      <div className={styles.timelineContainer}>
        {/* Background Lines */}
        <div className={styles.lineBase} />
        <div className={styles.lineProgress} />

        <div className={styles.steps}>
          {STEPS.map((step, idx) => (
            <div key={idx} className={styles.stepItem}>
              <div className={styles.stepAside}>
                <div className={`${styles.circle} ${!step.active ? styles.inactive : ""}`}>
                  <span className={styles.number}>{step.number}</span>
                </div>
                {idx < STEPS.length - 1 && <div className={styles.vLine} aria-hidden />}
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
