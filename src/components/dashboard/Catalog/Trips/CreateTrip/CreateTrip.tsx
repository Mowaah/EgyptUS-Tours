"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTripSchema, type CreateTripValues } from "./CreateTripSchema";
import { IconStepper } from "@/components/shared";
import { OverviewStep } from "./Steps/Overview/OverviewStep";
import { InclusionsStep } from "./Steps/Inclusions/InclusionsStep";
import styles from "./CreateTrip.module.scss";

const STEPS = [
  { label: "Overview", iconSrc: "/images/dashboard/catalog/trips/overview.svg" },
  { label: "Inclusions", iconSrc: "/images/dashboard/catalog/trips/inclusions.svg" },
  { label: "Pricing", iconSrc: "/images/dashboard/catalog/trips/pricing.svg" },
  { label: "Itinerary", iconSrc: "/images/dashboard/catalog/trips/itinerary.svg" },
  { label: "Dates Availability", iconSrc: "/images/dashboard/catalog/trips/dates.svg" },
  { label: "Hotels", iconSrc: "/images/dashboard/catalog/trips/hotels.svg" },
  { label: "Media", iconSrc: "/images/dashboard/catalog/trips/media.svg" },
  { label: "SEO", iconSrc: "/images/dashboard/catalog/trips/seo.svg" },
];

export function CreateTrip({ tripId }: { tripId?: string }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0); // 0-indexed for IconStepper

  const methods = useForm<CreateTripValues>({
    resolver: zodResolver(createTripSchema),
    defaultValues: tripId ? {
      tripName: "Santorini Island Explorer",
      category: "multi-country-trips",
      destinations: ["luxor-aswan"],
      duration: "4d-3n",
      tourTypes: ["private-tour", "group-tour"],
      description: "Embark on an unforgettable journey through ancient Egypt along the legendary Nile River. Experience the magic of Luxor and Aswan with visits to magnificent temples, royal tombs, and timeless monuments. Sail aboard a luxury Nile cruise while exploring Karnak Temple, Valley of the Kings, Philae Temple, and the colossal Abu Simbel. Connect with 5,000 years of pharaonic history and ancient Egyptian civilization. Experience authentic Nubian culture, learn about hieroglyphics and ancient construction techniques, and participate in traditional felucca sailing. This journey offers insight into one of the world's oldest and most influential civilizations",
      culturalValue: "Connect with 5,000 years of pharaonic history and ancient Egyptian civilization. Experience authentic Nubian culture, learn about hieroglyphics and ancient construction techniques, and participate in traditional felucca sailing. This journey offers insight into one of the world's oldest and most influential civilizations",
      whoIsTripFor: "History enthusiasts, couples seeking romantic getaways, and culture lovers looking for an authentic Egyptian experience. Ideal for those who want to explore ancient wonders, learn about pharaonic dynasties, and experience the timeless beauty of the Nile River in comfort and luxury.",
      inclusions: [],
      exclusions: []
    } : {
      inclusions: [],
      exclusions: []
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: CreateTripValues) => {
    console.log("Submit Form Data:", data);
    // Proceed to next step or submit if on last step
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      router.push("/dashboard/catalog/trips?created=true");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <OverviewStep />;
      case 1:
        return <InclusionsStep />;
      default:
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', background: '#fff', borderRadius: '24px', color: '#9CA3AF', fontWeight: 500, fontSize: '16px' }}>
            Step {currentStep + 1} ({STEPS[currentStep].label}) — Coming Soon
          </div>
        );
    }
  };

  return (
    <FormProvider {...methods}>
      <form id="create-trip-form" className={styles.page} onSubmit={handleSubmit(onSubmit)}>
        {/* Wrapper containing the dashboard IconStepper component */}
        <div className={styles.stepIndicatorWrapper}>
          <IconStepper 
            steps={STEPS} 
            currentStep={currentStep}
            onStepClick={setCurrentStep}
          />
        </div>

        {/* Main wizard forms */}
        {renderStep()}

        {/* Bottom Actions */}
        <div className={styles.footerActions}>
          <button type="submit" className={styles.nextButton}>
            <span>Next</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.62 3.97L13.65 8L9.62 12.03" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2.3501 8H13.5301" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
