"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createHotelSchema, type CreateHotelValues } from "./CreateHotelSchema";
import { IconStepper } from "@/components/shared";
import { OverviewStep } from "./Steps/Overview/OverviewStep";
import { RoomsStep } from "./Steps/Rooms/RoomsStep";
import { MediaStep } from "./Steps/Media/MediaStep";
import { SEOStep } from "./Steps/SEO/SEOStep";
import { PricingStep } from "./Steps/Pricing/PricingStep";
import SuccessModal from "@/components/shared/SuccessModal/SuccessModal";
import { DashboardFooter } from "@/components/dashboard/shared";
import Image from "next/image";
import styles from "./CreateHotel.module.scss";

const STEPS = [
  { label: "Overview", iconSrc: "/images/dashboard/catalog/trips/overview.svg" },
  { label: "Rooms", iconSrc: "/images/dashboard/catalog/hotels/basic.svg" },
  { label: "Pricing", iconSrc: "/images/dashboard/catalog/trips/pricing.svg" },
  { label: "Media", iconSrc: "/images/dashboard/catalog/trips/media.svg" },
  { label: "SEO", iconSrc: "/images/dashboard/catalog/trips/seo.svg" },
];

export function CreateHotel({ hotelId, onDirtyChange }: { hotelId?: string; onDirtyChange?: (isDirty: boolean) => void }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0); // 0-indexed for IconStepper
  const [isPublishedModalOpen, setIsPublishedModalOpen] = useState(false);

  const methods = useForm<CreateHotelValues>({
    resolver: zodResolver(createHotelSchema) as any,
    defaultValues: hotelId ? {
      hotelName: "Nile Palace Hotel & Spa",
      totalRooms: "250",
      subtitle: "Your gateway to Cairo's iconic landmarks.",
      cityLocation: "123 Corniche El Nile, Cairo, Egypt",
      starRating: "5",
      facilities: ["Henna Painting", "Restaurant", "Luxury Transport"],
      description: "Nestled in the heart of Cairo along the iconic Nile Corniche, the Nile Palace Hotel & Spa offers panoramic Nile views and direct access to the city’s vibrant center. Ideally located near the Egyptian Museum, Khan El Khalili, and the Great Pyramids of Giza, guests can easily explore Egypt’s most iconic landmarks.",
      secondDescription: "Blending timeless Egyptian heritage with contemporary five-star comfort, the hotel offers elegant interiors, premium amenities, and exceptional hospitality. Whether traveling for leisure, romance, family vacations, or business, guests enjoy a refined atmosphere designed for relaxation, cultural discovery, and unforgettable Nile-side moments.",
      rooms: [
        {
          category: "Standard Room",
          type: "Deluxe Room",
          view: "City View",
          pricePerNight: "180",
          description: "Spacious deluxe room featuring panoramic sea views and modern amenities.",
          facilities: ["Daily VIP Treatment", "Bathroom with Shower", "49\" Smart TV", "Daily Access to the Spa", "Evening Turndown Service", "Coffee and Tea Service", "Air Conditioning", "Safety Deposit Box", "Minibar Drinks", "24-Hour Room Service", "Laundry Service", "Free WiFi"],
          photos: ["/images/dashboard/catalog/hotels/hotel-mock.png"]
        }
      ]
    } : {
      hotelName: "",
      totalRooms: "",
      subtitle: "",
      cityLocation: "",
      starRating: "",
      description: "",
      secondDescription: "",
      facilities: [],
      rooms: []
    },
  });

  const { handleSubmit, formState: { isDirty } } = methods;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const onSubmit = (data: any) => {
    console.log("Submit Form Data:", data);
    // Proceed to next step or submit if on last step
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsPublishedModalOpen(true);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <OverviewStep />;
      case 1:
        return <RoomsStep />;
      case 2:
        return <PricingStep />;
      case 3:
        return <MediaStep />;
      case 4:
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
      <form id="create-hotel-form" className={styles.page} onSubmit={handleSubmit(onSubmit)}>
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
        {hotelId ? (
          <DashboardFooter lastUpdateDate="6/6/2026" hideActions />
        ) : (
          <div className={styles.footerActions}>
            <div className={styles.actionsContainer}>
              <button 
                type="button" 
                className={styles.previousButton}
                onClick={() => {
                  if (currentStep > 0) setCurrentStep(prev => prev - 1);
                }}
                disabled={currentStep === 0}
              >
                <Image src="/images/dashboard/previous.svg" alt="Previous" width={20} height={20} />
                <span>Previous</span>
              </button>
              <button type="submit" className={styles.nextButton}>
                <span>{currentStep === STEPS.length - 1 ? "Publish Hotel" : "Next"}</span>
                {currentStep !== STEPS.length - 1 && <Image src="/images/dashboard/next.svg" alt="Next" width={20} height={20} />}
              </button>
            </div>
          </div>
        )}
      </form>

      {isPublishedModalOpen && (
        <SuccessModal
          title={hotelId ? "Hotel Updated Successfully" : "Hotel Published Successfully"}
          message={hotelId ? "All changes have been saved and are now reflected across the system." : "Your hotel has been published and is now available for bookings and customer inquiries."}
          primaryButtonText="View Hotel"
          buttonText="Back to Catalog"
          hideSecondaryButton={!hotelId}
          onPrimaryClick={() => {
            setIsPublishedModalOpen(false);
            router.push(hotelId ? `/dashboard/catalog/hotels/${hotelId}` : "/dashboard/catalog/hotels?created=true");
          }}
          onClose={() => {
            setIsPublishedModalOpen(false);
            if (hotelId) {
              router.push("/dashboard/catalog/hotels");
            }
          }}
        />
      )}
    </FormProvider>
  );
}
