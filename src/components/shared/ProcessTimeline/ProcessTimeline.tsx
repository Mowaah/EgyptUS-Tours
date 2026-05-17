"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./ProcessTimeline.module.scss";

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  active?: boolean;
}

interface ProcessTimelineProps {
  title: string;
  subtitle: string;
  steps: ProcessStep[];
  sectionPadding?: "normal" | "large";
}

const STEP_DELAY_MS = 500;

export default function ProcessTimeline({
  title,
  subtitle,
  steps,
  sectionPadding = "normal",
}: ProcessTimelineProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(-1);
  const [lineStarted, setLineStarted] = useState(false);

  // Calculate total active steps for line progress calculation
  const totalActiveSteps = steps.filter((s) => s.active !== false).length;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLineStarted(true);

          steps.forEach((step, idx) => {
            // Only schedule activation if the step is meant to be active
            if (step.active !== false) {
              setTimeout(() => {
                setActiveStep(idx);
              }, idx * STEP_DELAY_MS + 200);
            }
          });

          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [steps]);

  return (
    <section className={`${styles.section} ${styles[`padding-${sectionPadding}`]}`} ref={sectionRef}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div className={styles.timelineContainer}>
        {/* Track */}
        <div className={styles.lineBase} />

        {/* Progress bar — smooth animation */}
        <div
          className={`${styles.lineProgress} ${lineStarted ? styles.lineActive : ""}`}
          style={
            {
              "--active-ratio": totalActiveSteps / steps.length,
            } as React.CSSProperties
          }
        />

        <div className={styles.steps}>
          {steps.map((step, idx) => {
            // A step is visible/animated if it's supposed to be active AND we've reached its turn
            const isActive = step.active !== false && idx <= activeStep;
            const isCurrent = step.active !== false && idx === activeStep;

            return (
              <div
                key={idx}
                className={`${styles.stepItem} ${
                  step.active === false
                    ? "" // Don't apply hidden/visible classes to permanently inactive steps
                    : isActive
                    ? styles.stepVisible
                    : styles.stepHidden
                }`}
                style={{ "--step-index": idx } as React.CSSProperties}
              >
                <div className={styles.stepAside}>
                  <div
                    className={`${styles.circle} ${step.active === false ? styles.inactive : ""} ${
                      isActive ? styles.circleActive : ""
                    } ${isCurrent ? styles.circlePulse : ""}`}
                  >
                    {isCurrent && <span className={styles.ripple} aria-hidden />}
                    <span className={styles.number}>{step.number}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`${styles.vLine} ${isActive ? styles.vLineActive : ""}`}
                      aria-hidden
                    />
                  )}
                </div>
                <div className={styles.content}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
