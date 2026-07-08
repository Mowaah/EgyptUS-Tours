import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

export interface WizardStepConfig {
  label: string;
  iconSrc: string;
  fieldsToValidate?: string[]; // Array of dot-notation field paths, or empty array if none
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface UseWizardOptions<TFormValues extends Record<string, any>> {
  steps: WizardStepConfig[];
  methods: UseFormReturn<TFormValues>;
  onSubmit: (data: TFormValues) => void;
  onFinished?: () => void; // Triggered when last step submits
  isEdit?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useWizard<TFormValues extends Record<string, any>>({
  steps,
  methods,
  onSubmit,
  onFinished,
  isEdit = false,
}: UseWizardOptions<TFormValues>) {
  const [currentStep, setCurrentStep] = useState(0);
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = async () => {
    const currentFields = steps[currentStep].fieldsToValidate;
    let isValid = true;

    if (currentFields && currentFields.length > 0) {
      // Trigger validation for only the current step's fields
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      isValid = await methods.trigger(currentFields as any);
    } else {
      // If no fields defined for this step, optionally validate nothing or whole form
      // Here we assume it's valid if no fields are specified.
    }

    if (isValid) {
      if (isLastStep) {
        // Run the main onSubmit wrapper which handles getting all form data
        methods.handleSubmit((data) => {
          onSubmit(data);
          onFinished?.();
        })();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStepClick = async (targetStep: number) => {
    // Usually, we only allow jumping back.
    // If they click a future step, we validate the current step first, but it can get complex.
    // For now, only allow jumping to previous steps to prevent skipping validation, unless we are in edit mode.
    if (isEdit || targetStep < currentStep) {
      setCurrentStep(targetStep);
    }
  };

  return {
    currentStep,
    isLastStep,
    handleNext,
    handlePrevious,
    handleStepClick,
    stepsConfig: steps,
  };
}
