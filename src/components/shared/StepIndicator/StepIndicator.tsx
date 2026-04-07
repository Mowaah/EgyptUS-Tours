import styles from "./StepIndicator.module.scss";

export interface StepDef {
  number: number;
  label: string;
}

interface StepIndicatorProps {
  steps: StepDef[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className={styles.stepIndicator}>
      <div className={styles.stepContainer}>
        {steps.map((step, index) => {
          const isCurrent = currentStep === step.number;
          const isDone = currentStep > step.number;
          const circleClass = isCurrent
            ? styles.stepCircleActive
            : isDone
              ? styles.stepCircleCompleted
              : styles.stepCircleInactive;

          return (
            <div key={step.number} className={styles.stepChunk}>
              <div className={styles.step} aria-current={isCurrent ? "step" : undefined}>
                <div className={`${styles.stepCircle} ${circleClass}`}>
                  {isCurrent ? (
                    <span className={styles.stepBullseyeDot} aria-hidden="true" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`${styles.stepLabel} ${
                    isCurrent ? styles.stepLabelCurrent : isDone ? styles.stepLabelDone : ""
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`${styles.stepLine} ${currentStep >= step.number ? styles.stepLineActive : ""}`}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
