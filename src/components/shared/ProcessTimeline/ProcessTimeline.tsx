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

/** Must match `.lineActive` transition duration in SCSS */
const LINE_DURATION_MS = 3500;

/** When the linear progress line reaches this step's column center */
function getActivateDelay(stepIndex: number, totalSteps: number, activeRatio: number): string {
  const columnCenter = (stepIndex + 0.5) / totalSteps;
  const delayMs = Math.min((columnCenter / activeRatio) * LINE_DURATION_MS, LINE_DURATION_MS);
  return `${delayMs}ms`;
}

export default function ProcessTimeline({
  title,
  subtitle,
  steps,
  sectionPadding = "normal",
}: ProcessTimelineProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [lineStarted, setLineStarted] = useState(false);

  const totalSteps = steps.length;
  const activeRatio = steps.filter((s) => s.active !== false).length / totalSteps;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => setLineStarted(true));
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`${styles.section} ${styles[`padding-${sectionPadding}`]}`} ref={sectionRef}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div className={styles.timelineContainer}>
        <div className={styles.lineBase} />

        <div
          className={`${styles.lineProgress} ${lineStarted ? styles.lineActive : ""}`}
          style={{ "--active-ratio": activeRatio } as React.CSSProperties}
        />

        <div className={styles.steps}>
          {steps.map((step, idx) => {
            const isPermanentlyInactive = step.active === false;
            const shouldActivate = lineStarted && !isPermanentlyInactive;
            const activateDelay = isPermanentlyInactive
              ? undefined
              : getActivateDelay(idx, totalSteps, activeRatio);
            const nextStepActive = idx < steps.length - 1 && steps[idx + 1].active !== false;
            const vLineShouldActivate = lineStarted && nextStepActive;
            const vLineDelay = nextStepActive ? getActivateDelay(idx + 1, totalSteps, activeRatio) : undefined;

            return (
              <div
                key={idx}
                className={styles.stepItem}
                style={
                  activateDelay
                    ? ({
                        "--activate-delay": activateDelay,
                        "--vline-activate-delay": vLineDelay,
                      } as React.CSSProperties)
                    : undefined
                }
              >
                <div className={styles.stepAside}>
                  <div
                    className={`${styles.circle} ${shouldActivate ? styles.circleActive : ""} ${
                      isPermanentlyInactive ? styles.circlePermanentInactive : ""
                    }`}
                  >
                    <span className={styles.number}>{step.number}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`${styles.vLine} ${vLineShouldActivate ? styles.vLineActive : ""}`}
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
