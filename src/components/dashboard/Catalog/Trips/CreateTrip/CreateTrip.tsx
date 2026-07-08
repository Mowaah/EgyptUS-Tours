"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTripSchema, type CreateTripValues } from "./CreateTripSchema";
import { IconStepper } from "@/components/shared";
import { OverviewStep } from "./Steps/Overview/OverviewStep";
import { InclusionsStep } from "./Steps/Inclusions/InclusionsStep";
import { PricingStep } from "./Steps/Pricing/PricingStep";
import { ItineraryStep } from "./Steps/Itinerary/ItineraryStep";
import { DatesAvailabilityStep } from "./Steps/DatesAvailability/DatesAvailabilityStep";
import { HotelsStep } from "./Steps/Hotels/HotelsStep";
import { MediaStep } from "./Steps/Media/MediaStep";
import { SEOStep } from "./Steps/SEO/SEOStep";
import SuccessModal from "@/components/shared/SuccessModal/SuccessModal";
import { WizardLayout } from "@/components/dashboard/shared";
import { useWizard, WizardStepConfig } from "@/hooks/useWizard";
import Image from "next/image";
import styles from "./CreateTrip.module.scss";

const STEPS: WizardStepConfig[] = [
  { label: "Overview", iconSrc: "/images/dashboard/catalog/trips/overview.svg", fieldsToValidate: ["tripName", "category", "destinations", "duration", "tourTypes", "description", "culturalValue", "whoIsTripFor"] },
  { label: "Inclusions", iconSrc: "/images/dashboard/catalog/trips/inclusions.svg", fieldsToValidate: ["inclusions", "exclusions"] },
  { label: "Pricing", iconSrc: "/images/dashboard/catalog/trips/pricing.svg", fieldsToValidate: ["pricing"] },
  { label: "Itinerary", iconSrc: "/images/dashboard/catalog/trips/itinerary.svg", fieldsToValidate: ["itinerary"] },
  { label: "Dates Availability", iconSrc: "/images/dashboard/catalog/trips/dates.svg", fieldsToValidate: ["datesAvailability"] },
  { label: "Hotels", iconSrc: "/images/dashboard/catalog/trips/hotels.svg", fieldsToValidate: ["hotels"] },
  { label: "Media", iconSrc: "/images/dashboard/catalog/trips/media.svg", fieldsToValidate: ["photos", "brochureFile"] },
  { label: "SEO", iconSrc: "/images/dashboard/catalog/trips/seo.svg", fieldsToValidate: ["metaTitle", "metaDescription", "metaKeywords", "slug"] },
];

export function CreateTrip({ tripId, onDirtyChange }: { tripId?: string; onDirtyChange?: (isDirty: boolean) => void }) {
  const router = useRouter();
  const [isPublishedModalOpen, setIsPublishedModalOpen] = useState(false);

  const methods = useForm<CreateTripValues>({
    resolver: zodResolver(createTripSchema),
    defaultValues: tripId ? {
      tripName: "Santorini Island Explorer",
      category: "multi-country-trips",
      destinations: ["luxor-aswan"],
      duration: "4d-3n",
      tourTypes: ["private-tour", "group-tour"],
      brochureFile: undefined,
      description: "Embark on an unforgettable journey through ancient Egypt along the legendary Nile River. Experience the magic of Luxor and Aswan with visits to magnificent temples, royal tombs, and timeless monuments. Sail aboard a luxury Nile cruise while exploring Karnak Temple, Valley of the Kings, Philae Temple, and the colossal Abu Simbel. Connect with 5,000 years of pharaonic history and ancient Egyptian civilization. Experience authentic Nubian culture, learn about hieroglyphics and ancient construction techniques, and participate in traditional felucca sailing. This journey offers insight into one of the world's oldest and most influential civilizations",
      culturalValue: "Connect with 5,000 years of pharaonic history and ancient Egyptian civilization. Experience authentic Nubian culture, learn about hieroglyphics and ancient construction techniques, and participate in traditional felucca sailing. This journey offers insight into one of the world's oldest and most influential civilizations",
      whoIsTripFor: "History enthusiasts, couples seeking romantic getaways, and culture lovers looking for an authentic Egyptian experience. Ideal for those who want to explore ancient wonders, learn about pharaonic dynasties, and experience the timeless beauty of the Nile River in comfort and luxury.",
      inclusions: [],
      exclusions: [],
      pricing: {
        privateTour: {
          basePrice: "",
          seasons: [
            { dateRange: "", singleRoom: "", doubleRoom: "", tripleRoom: "" },
            { dateRange: "", singleRoom: "", doubleRoom: "", tripleRoom: "" },
          ],
        },
        groupTour: {
          basePrice: "",
          seasons: [
            { dateRange: "", singleRoom: "", doubleRoom: "", tripleRoom: "" },
            { dateRange: "", singleRoom: "", doubleRoom: "", tripleRoom: "" },
          ],
        },
      },
      itinerary: [
        { title: "", subtitle: "", description: "", highlights: [], image: undefined },
        { title: "", subtitle: "", description: "", highlights: [], image: undefined },
      ],
      hotels: [],
      photos: [],
      datesAvailability: { enabled: false, dates: [] },
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      slug: ""
    } : {
      tripName: "",
      category: "",
      destinations: [],
      duration: "",
      tourTypes: [],
      brochureFile: undefined,
      description: "",
      culturalValue: "",
      whoIsTripFor: "",
      inclusions: [],
      exclusions: [],
      pricing: {
        privateTour: {
          basePrice: "",
          seasons: [
            { dateRange: "", singleRoom: "", doubleRoom: "", tripleRoom: "" },
            { dateRange: "", singleRoom: "", doubleRoom: "", tripleRoom: "" },
          ],
        },
        groupTour: {
          basePrice: "",
          seasons: [
            { dateRange: "", singleRoom: "", doubleRoom: "", tripleRoom: "" },
            { dateRange: "", singleRoom: "", doubleRoom: "", tripleRoom: "" },
          ],
        },
      },
      itinerary: [
        { title: "", subtitle: "", description: "", highlights: [], image: undefined },
        { title: "", subtitle: "", description: "", highlights: [], image: undefined },
      ],
      hotels: [],
      photos: [],
      datesAvailability: { enabled: false, dates: [] },
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      slug: ""
    },
  });

  const { handleSubmit, formState: { isDirty } } = methods;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const onSubmit = (data: CreateTripValues) => {
    console.log("Submit Form Data:", data);
  };

  const {
    currentStep,
    handleNext,
    handlePrevious,
    handleStepClick,
  } = useWizard<CreateTripValues>({
    steps: STEPS,
    methods,
    onSubmit,
    onFinished: () => setIsPublishedModalOpen(true),
    isEdit: !!tripId,
  });

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <OverviewStep />;
      case 1:
        return <InclusionsStep />;
      case 2:
        return <PricingStep />;
      case 3:
        return <ItineraryStep />;
      case 4:
        return <DatesAvailabilityStep />;
      case 5:
        return <HotelsStep />;
      case 6:
        return <MediaStep />;
      case 7:
        return <SEOStep />;
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
      <div className={styles.page}>
        <WizardLayout
          steps={STEPS}
          currentStep={currentStep}
          isEdit={!!tripId}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onStepClick={handleStepClick}
          publishLabel="Publish Trip"
        >
          {/* Main wizard forms */}
          {renderStep()}
        </WizardLayout>
      </div>

      {isPublishedModalOpen && (
        <SuccessModal
          title={tripId ? "Trip Updated Successfully" : "Trip Published Successfully"}
          message={tripId ? "All changes have been saved and are now reflected across the system." : "Your trip package has been published and is now available for bookings and customer inquiries."}
          primaryButtonText="View Trip"
          buttonText="Back to Catalog"
          hideSecondaryButton={!tripId}
          onPrimaryClick={() => {
            setIsPublishedModalOpen(false);
            router.push(tripId ? `/dashboard/catalog/trips/${tripId}` : "/dashboard/catalog/trips?created=true");
          }}
          onClose={() => {
            setIsPublishedModalOpen(false);
            if (tripId) {
              router.push("/dashboard/catalog/trips");
            }
          }}
        />
      )}
    </FormProvider>
  );
}
