"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVehicleSchema, type CreateVehicleValues } from "./CreateVehicleSchema";
import { IconStepper } from "@/components/shared";
import { OverviewStep } from "./Steps/Overview/OverviewStep";
import { PricingStep } from "./Steps/Pricing/PricingStep";
import { MediaStep } from "./Steps/Media/MediaStep";
import { SEOStep } from "./Steps/SEO/SEOStep";
import SuccessModal from "@/components/shared/SuccessModal/SuccessModal";
import { WizardLayout } from "@/components/dashboard/shared";
import { useWizard, WizardStepConfig } from "@/hooks/useWizard";
import styles from "./CreateVehicle.module.scss";

const STEPS: WizardStepConfig[] = [
  { label: "Overview", iconSrc: "/images/dashboard/catalog/trips/overview.svg", fieldsToValidate: ["vehicleName", "model", "category", "passengerCapacity"] },
  { label: "Pricing", iconSrc: "/images/dashboard/catalog/trips/pricing.svg", fieldsToValidate: ["basePrice"] },
  { label: "Media", iconSrc: "/images/dashboard/catalog/trips/media.svg", fieldsToValidate: [] },
  { label: "SEO", iconSrc: "/images/dashboard/catalog/trips/seo.svg", fieldsToValidate: ["seoTitle", "seoDescription", "seoKeywords", "seoSlug"] },
];

export function CreateVehicle({ vehicleId, onDirtyChange }: { vehicleId?: string; onDirtyChange?: (isDirty: boolean) => void }) {
  const router = useRouter();
  const [isPublishedModalOpen, setIsPublishedModalOpen] = useState(false);

  const methods = useForm<CreateVehicleValues>({
    resolver: zodResolver(createVehicleSchema) as any,
    defaultValues: {
      vehicleName: "",
      model: "",
      category: "",
      duration: "",
      passengerCapacity: "",
      luggageCapacity: "",
      starRating: "",
      features: [],
      description: "",
      basePrice: "",
      vat: "",
      insurance: "",
      pricePerKm: "",
      additionalServices: [
        "Meet & Greet",
        "Extra Luggage",
        "Child Seat",
        "Waiting Time (Per Hour)",
        "Airport Parking Fee",
        "Night Service"
      ],
      photos: [],
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
      seoSlug: "",
    },
  });

  const { handleSubmit, formState: { isDirty } } = methods;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const onSubmit = (data: any) => {
    console.log("Submit Vehicle Form Data:", data);
  };

  const { currentStep, handleNext, handlePrevious, handleStepClick } = useWizard<CreateVehicleValues>({
    steps: STEPS,
    methods,
    onSubmit,
    onFinished: () => setIsPublishedModalOpen(true),
    isEdit: !!vehicleId,
  });

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <OverviewStep />;
      case 1: return <PricingStep />;
      case 2: return <MediaStep />;
      case 3: return <SEOStep />;
      default: return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <div className={styles.page}>
        <WizardLayout
          steps={STEPS}
          currentStep={currentStep}
          isEdit={!!vehicleId}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onStepClick={handleStepClick}
          publishLabel="Publish Vehicle"
        >
          {renderStep()}
        </WizardLayout>
      </div>

      {isPublishedModalOpen && (
        <SuccessModal
          title={vehicleId ? "Vehicle Updated Successfully" : "Vehicle Published Successfully"}
          message={vehicleId ? "All changes have been saved and are now reflected across the system." : "Your vehicle has been published and is now available for bookings."}
          primaryButtonText="View Vehicle"
          buttonText="Back to Catalog"
          hideSecondaryButton={!vehicleId}
          onPrimaryClick={() => {
            setIsPublishedModalOpen(false);
            router.push(vehicleId ? `/dashboard/catalog/transportation/${vehicleId}` : "/dashboard/catalog/transportation?created=true");
          }}
          onClose={() => {
            setIsPublishedModalOpen(false);
            if (vehicleId) {
              router.push("/dashboard/catalog/transportation");
            }
          }}
        />
      )}
    </FormProvider>
  );
}
