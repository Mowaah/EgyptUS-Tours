import React, { useEffect } from "react";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";
import { IconStepper, IconStepDef } from "@/components/shared/IconStepper/IconStepper";
import Image from "next/image";
import styles from "./BookingModalContainer.module.scss";

interface BookingModalContainerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  iconSrc: string;
  
  steps: IconStepDef[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  
  onNext: () => void;
  onPrevious: () => void;
  
  hidePrimaryButton?: boolean;
  disablePrevious?: boolean;
  isPrimaryDisabled?: boolean;
  
  isSubmitting?: boolean;
  isConfirmed?: boolean;
  finalStepButtonLabel?: string;
  
  children: React.ReactNode;
}

export default function BookingModalContainer({
  open,
  onClose,
  title,
  subtitle,
  iconSrc,
  steps,
  currentStep,
  onStepClick,
  onNext,
  onPrevious,
  hidePrimaryButton = false,
  disablePrevious = false,
  isPrimaryDisabled = false,
  isSubmitting = false,
  isConfirmed = false,
  finalStepButtonLabel,
  children,
}: BookingModalContainerProps) {
  useEffect(() => {
    if (!open) return;
    
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || isConfirmed) return null;

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.headerWrap}>
          <ModalHeader
            title={title}
            subtitle={subtitle}
            iconSrc={iconSrc}
            onClose={onClose}
          />
        </div>

        <div className={styles.contentWrap}>
          <div className={styles.stepperWrap}>
            <IconStepper 
              steps={steps} 
              currentStep={currentStep} 
              onStepClick={onStepClick} 
            />
          </div>
          {children}
        </div>

        <div className={styles.footerWrap}>
          <ModalFooter
            secondaryLabel={
              currentStep > 0 ? (
                <>
                  <Image src="/images/dashboard/previous.svg" alt="" width={20} height={20} />
                  <span style={{ marginLeft: "0.5rem" }}>Previous</span>
                </>
              ) : (
                "Cancel"
              )
            }
            secondaryOnClick={currentStep > 0 ? onPrevious : onClose}
            secondaryDisabled={isSubmitting}
            primaryLabel={
              <>
                <span>
                  {isSubmitting 
                    ? "Submitting..." 
                    : (currentStep === steps.length - 1 ? (finalStepButtonLabel || "Confirm Booking") : "Next")}
                </span>
                {currentStep !== steps.length - 1 && !isSubmitting && (
                  <Image
                    src="/images/dashboard/next.svg"
                    alt=""
                    width={20}
                    height={20}
                    style={{ marginLeft: "0.5rem" }}
                  />
                )}
              </>
            }
            primaryOnClick={onNext}
            hidePrimaryButton={hidePrimaryButton}
            primaryDisabled={isSubmitting || isPrimaryDisabled}
            primaryIsLoading={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
