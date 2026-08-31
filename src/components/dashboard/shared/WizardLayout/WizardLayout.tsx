import React, { ReactNode } from "react";
import Image from "next/image";
import { IconStepper } from "@/components/shared";
import { DashboardFooter } from "@/components/dashboard/shared";
import styles from "./WizardLayout.module.scss";

export interface WizardStep {
  label: string;
  iconSrc: string;
}

interface WizardLayoutProps {
  steps: WizardStep[];
  currentStep: number;
  isEdit?: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onStepClick?: (step: number) => void;
  children: ReactNode;
  lastUpdateDate?: string;
  publishLabel?: string;
  isLoading?: boolean;
}

export default function WizardLayout({
  steps,
  currentStep,
  isEdit = false,
  onNext,
  onPrevious,
  onStepClick,
  children,
  lastUpdateDate,
  publishLabel = "Publish",
  isLoading = false,
}: WizardLayoutProps) {
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className={styles.wizardLayout}>
      <div className={styles.stepIndicatorWrapper}>
        <IconStepper 
          steps={steps} 
          currentStep={currentStep}
          onStepClick={onStepClick}
        />
      </div>

      <div className={styles.content}>
        {children}
      </div>

      {isEdit ? (
        <DashboardFooter lastUpdateDate={lastUpdateDate} hideActions />
      ) : (
        <div className={styles.footerActions}>
          <div className={styles.actionsContainer}>
            <button 
              type="button" 
              className={styles.previousButton}
              onClick={onPrevious}
              disabled={currentStep === 0}
            >
              <Image src="/images/dashboard/previous.svg" alt="Previous" width={20} height={20} />
              <span>Previous</span>
            </button>
            <button type="button" className={styles.nextButton} onClick={onNext} disabled={isLoading}>
              <span>{isLastStep ? publishLabel : "Next"}</span>
              {!isLastStep && <Image src="/images/dashboard/next.svg" alt="Next" width={20} height={20} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
