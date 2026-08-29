"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./PlanYourTripPage.module.scss";
import { EXPERIENCE_OPTIONS, STEPS, TRANSPORT_OPTIONS } from "./planYourTripData";
import type { PlanStep, TripData, PlanDestination } from "./planYourTripTypes";
import { clampMin0, toggleInArray } from "./planYourTripUtils";
import { SuccessModal, Breadcrumb, PageHeader, StepIndicator } from "@/components/shared";
import StepDestination from "./steps/Destination/StepDestination";
import StepTravelerInfo from "./steps/TravelerInfo/StepTravelerInfo";
import StepPreferences from "./steps/Preferences/StepPreferences";
import StepReview from "./steps/Review/StepReview";
import { getDestinations } from "@/lib/api";

const initialTripData: TripData = {
  destinations: [],
  travelerInfo: {
    name: "",
    email: "",
    phone: "",
    nationality: "",
    startDate: "",
    endDate: "",
    adults: 0,
    children: 0,
    infants: 0,
    tripDetails: "",
  },
  preferences: {
    tripCategory: [],
    duration: "",
    budget: "",
    hotelCategory: "",
    roomType: [],
    transportation: "",
    experiences: [],
    activities: [],
    contactMethod: "",
  },
};

export default function PlanYourTripPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<PlanStep>(1);
  const [showModal, setShowModal] = useState(false);
  const [tripData, setTripData] = useState<TripData>(initialTripData);
  const [availableDestinations, setAvailableDestinations] = useState<PlanDestination[]>([]);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const data = await getDestinations();
        if (data?.results) {
          const apiDests: PlanDestination[] = data.results.map((d: any) => ({
            id: d.id,
            name: d.name,
            region: d.region_display || "Africa",
            image: d.image || ""
          }));
          
          setAvailableDestinations(apiDests);
        }
      } catch (err) {
        console.error("Failed to fetch destinations", err);
      }
    }
    fetchDestinations();
  }, []);

  const stepIndicatorRef = useRef<HTMLDivElement | null>(null);

  const toggleDestination = (id: string | number) => {
    setTripData((prev) => ({
      ...prev,
      destinations: toggleInArray(prev.destinations, id),
    }));
  };

  const handleTravelerChange = <
    K extends keyof TripData["travelerInfo"],
    V extends TripData["travelerInfo"][K],
  >(
    field: K,
    value: V,
  ) => {
    setTripData((prev) => ({
      ...prev,
      travelerInfo: { ...prev.travelerInfo, [field]: value },
    }));
  };

  const handleNumberChange = (field: "adults" | "children" | "infants", inc: boolean) => {
    setTripData((prev) => {
      const current = prev.travelerInfo[field];
      const next = inc ? current + 1 : clampMin0(current - 1);
      return {
        ...prev,
        travelerInfo: { ...prev.travelerInfo, [field]: next },
      };
    });
  };

  const setPreferences = (patch: Partial<TripData["preferences"]>) => {
    setTripData((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, ...patch },
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (currentStep < 4) {
      setCurrentStep((s) => (s + 1) as PlanStep);
      return;
    }
    
    // Step 4: Submit to API
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      const { createCustomTripRequest } = await import("@/lib/api");
      
      const validIds: number[] = [];
      const invalidNames: string[] = [];

      for (const destId of tripData.destinations) {
        if (typeof destId === "number") {
          validIds.push(destId);
        } else {
          const destObj = availableDestinations.find((d) => d.id === destId);
          invalidNames.push(destObj ? destObj.name : String(destId));
        }
      }

      // If there are unmapped destinations, append them to tripDetails
      const finalTripData = { ...tripData };
      finalTripData.destinations = validIds;
      if (invalidNames.length > 0) {
        const appendText = `\n\nRequested Additional Destinations: ${invalidNames.join(", ")}`;
        finalTripData.travelerInfo.tripDetails += appendText;
      }

      await createCustomTripRequest(finalTripData);
      
      setShowModal(true);
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong submitting your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((s) => Math.max(1, s - 1) as PlanStep);
  };

  const handleReset = () => {
    setShowModal(false);
    setCurrentStep(1);
    router.push("/");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumbs={[{ label: "Plan Your Trip", isCurrent: true }]}
        title="Plan Your Perfect Trip"
        subtitle="Fill out the form below and our team will craft a personalized travel experience tailored just for you."
        backButton={{ text: "Back To Home", href: "/" }}
        decorationSrc="/images/dotted-line3.svg"
        subtitleMaxWidth="750px"
      />

      <div ref={stepIndicatorRef}>
        <StepIndicator steps={STEPS} currentStep={currentStep} wrapLabels={true} />
      </div>

      <main className={styles.mainContent}>
        <div className={styles.content}>
          {currentStep === 1 && (
            <StepDestination
              destinations={availableDestinations}
              selectedDestinationIds={tripData.destinations}
              onToggleDestination={toggleDestination}
              onContinue={handleContinue}
              continueDisabled={tripData.destinations.length === 0}
            />
          )}

          {currentStep === 2 && (
            <StepTravelerInfo
              travelerInfo={tripData.travelerInfo}
              onTravelerChange={handleTravelerChange}
              onNumberChange={handleNumberChange}
              onPrevious={handlePrevious}
              onContinue={handleContinue}
            />
          )}

          {currentStep === 3 && (
            <StepPreferences
              preferences={tripData.preferences}
              onSetPreferences={setPreferences}
              tripDetails={tripData.travelerInfo.tripDetails}
              onTripDetailsChange={(val) => handleTravelerChange("tripDetails", val)}
              onPrevious={handlePrevious}
              onContinue={handleContinue}
            />
          )}

          {currentStep === 4 && (
            <StepReview
              tripData={tripData}
              availableDestinations={availableDestinations}
              isSubmitting={isSubmitting}
              submitError={submitError}
              onPrevious={handlePrevious}
              onContinue={handleContinue}
            />
          )}
        </div>
      </main>

      {showModal && (
        <SuccessModal
          title="Your Custom Trip Request Has Been Received!"
          message="Thank you for designing your journey with us. Our travel specialists are reviewing your preferences and will contact you within 24 hours."
          primaryButtonText="View Request Details"
          onPrimaryClick={() => router.push("/profile?tab=requests")}
          onClose={() => router.push("/")}
        />
      )}
    </div>
  );
}
