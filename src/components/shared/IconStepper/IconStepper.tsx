import React from "react";
import Image from "next/image";
import styles from "./IconStepper.module.scss";

export interface IconStepDef {
  label: string;
  iconSrc: string;
}

interface IconStepperProps {
  steps: IconStepDef[];
  currentStep: number; // 0-indexed
}

export function IconStepper({ steps, currentStep }: IconStepperProps) {
  return (
    <div className={styles.stepper}>
      {steps.map((step, index) => {
        const isCurrent = currentStep === index;
        const isCompleted = currentStep > index;
        const isPending = currentStep < index;

        let iconWrapClass = styles.stepIconWrapPending;
        let labelClass = styles.stepLabelPending;

        if (isCurrent) {
          iconWrapClass = styles.stepIconWrapActive;
          labelClass = styles.stepLabelActive;
        } else if (isCompleted) {
          iconWrapClass = styles.stepIconWrapCompleted;
          labelClass = styles.stepLabelCompleted;
        }

        const showWhiteIcon = isCurrent || isCompleted;

        return (
          <React.Fragment key={index}>
            <div className={styles.step}>
              <div className={`${styles.stepIconWrap} ${iconWrapClass}`}>
                <Image
                  src={step.iconSrc}
                  alt={step.label}
                  width={20}
                  height={20}
                  style={showWhiteIcon ? { filter: "brightness(0) invert(1)" } : undefined}
                />
              </div>
              <span className={`${styles.stepLabel} ${labelClass}`}>{step.label}</span>
            </div>

            {index < steps.length - 1 && (
              <div className={styles.stepDividerWrap}>
                <div
                  className={`${styles.stepDivider} ${
                    currentStep > index ? styles.stepDividerCompleted : isCurrent ? styles.stepDividerActive : ""
                  }`}
                ></div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
