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
  const currentIndex = Math.max(0, currentStep - 1);
  const currentLabel = steps[currentIndex]?.label ?? "";
  const progressPct = steps.length > 1 ? (currentIndex / (steps.length - 1)) * 100 : 100;

  return (
    <div className={styles.stepIndicator}>
      {/* Mobile: compact "Step X of Y" + progress bar. Hidden on md+. */}
      <div className={styles.compact} aria-hidden="true">
        <div className={styles.compactRow}>
          <span className={styles.compactCounter}>
            Step {currentStep} of {steps.length}
          </span>
          <span className={styles.compactLabel}>{currentLabel}</span>
        </div>
        <div className={styles.compactTrack}>
          <div
            className={styles.compactFill}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Desktop pill stepper. Hidden below md. */}
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
