"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import styles from "./PlanYourTripPage.module.scss";
import { EXPERIENCE_OPTIONS, STEPS, TRANSPORT_OPTIONS } from "./planYourTripData";
import type { PlanStep, TripData, PlanDestination } from "./planYourTripTypes";
import { clampMin0, toggleInArray } from "./planYourTripUtils";
import { SuccessModal, Breadcrumb, PageHeader, StepIndicator } from "@/components/shared";
import StepDestination from "./steps/Destination/StepDestination";
import StepTravelerInfo from "./steps/TravelerInfo/StepTravelerInfo";
import StepPreferences from "./steps/Preferences/StepPreferences";
import StepReview from "./steps/Review/StepReview";
import { getDestinations, getCategories } from "@/lib/api";
import { useTranslation } from "@/hooks/useTranslation";

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
  const searchParams = useSearchParams();
  const [isAgentMode, setIsAgentMode] = useState(false);
  const [currentStep, setCurrentStep] = useState<PlanStep>(1);
  const [showModal, setShowModal] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | number>("");
  const [tripData, setTripData] = useState<TripData>(initialTripData);
  const [availableDestinations, setAvailableDestinations] = useState<PlanDestination[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    const hasAdminToken = Boolean(Cookies.get("admin_access_token"));
    setIsAgentMode(searchParams.get("mode") === "agent" && hasAdminToken);
  }, [searchParams]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [destData, catData] = await Promise.all([
          getDestinations(),
          getCategories()
        ]);
        
        if (destData?.results) {
          const apiDests: PlanDestination[] = destData.results.map((d: any) => ({
            id: d.id,
            name: d.name,
            region: d.region_display || "Africa",
            image: d.image || ""
          }));
          setAvailableDestinations(apiDests);
        }

        if (catData?.results) {
          const apiCats: string[] = catData.results.map((c: any) => c.name);
          setAvailableCategories(apiCats);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    }
    fetchData();
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

      if (isAgentMode) {
        const { createAdminPlanYourTripRequest } = await import("@/services/admin/adminRequestsService");
        const { formatDateForBackend } = await import("@/lib/api");

        let budget_min = null;
        let budget_max = null;
        if (tripData.preferences.budget) {
          const budgetStr = tripData.preferences.budget.replace(/[^0-9\-+]/g, '');
          const parts = budgetStr.split('-');
          if (parts.length === 2) {
            budget_min = parseInt(parts[0], 10);
            budget_max = parseInt(parts[1], 10);
          } else if (budgetStr.includes('+')) {
            budget_min = parseInt(budgetStr.replace('+', ''), 10);
          } else {
            budget_min = parseInt(budgetStr, 10);
            budget_max = parseInt(budgetStr, 10);
          }
        }

        const roomTypesList = Array.isArray(tripData.preferences.roomType)
          ? tripData.preferences.roomType
          : tripData.preferences.roomType ? [tripData.preferences.roomType] : [];

        const adminPayload = {
          full_name: tripData.travelerInfo.name,
          email: tripData.travelerInfo.email,
          phone: tripData.travelerInfo.phone,
          nationality: tripData.travelerInfo.nationality || '',
          start_date: formatDateForBackend(tripData.travelerInfo.startDate),
          end_date: formatDateForBackend(tripData.travelerInfo.endDate),
          adults: tripData.travelerInfo.adults || 1,
          children: tripData.travelerInfo.children || 0,
          infants: tripData.travelerInfo.infants || 0,
          trip_details_text: finalTripData.travelerInfo.tripDetails || '',
          hotel_category: tripData.preferences.hotelCategory || '',
          room_type: roomTypesList[0] || '',
          room_types: roomTypesList,
          transportation_type: tripData.preferences.transportation || '',
          experiences: tripData.preferences.experiences || [],
          trip_categories: tripData.preferences.tripCategory || [],
          activities: tripData.preferences.activities || [],
          additional_experiences: [],
          preferred_contact_method: tripData.preferences.contactMethod === "Phone Call" 
            ? "phone" 
            : (tripData.preferences.contactMethod?.toLowerCase() || ''),
          budget_min,
          budget_max,
          currency: 'usd',
          source: 'agent',
          destination_ids: validIds,
        };

        const res = await createAdminPlanYourTripRequest(adminPayload);
        const newId = res?.id ?? res?.data?.id ?? "";
        if (newId) {
          setSubmittedId(newId);
        }
      } else {
        const { createCustomTripRequest } = await import("@/lib/api");
        const res = await createCustomTripRequest(finalTripData);
        const newId = res?.id ?? res?.data?.id ?? "";
        if (newId) {
          setSubmittedId(newId);
        }
      }

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
    if (isAgentMode) {
      router.push("/dashboard/requests/plan-your-trip");
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const { t } = useTranslation("booking");

  const steps = [
    { number: 1, label: t("planYourTrip.steps.destination", "Destination") },
    { number: 2, label: t("planYourTrip.steps.travelerInfo", "Traveler Info") },
    { number: 3, label: t("planYourTrip.steps.preferences", "Preferences") },
    { number: 4, label: t("planYourTrip.steps.review", "Review") },
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumbs={[{ label: t("planYourTrip.breadcrumb", "Plan Your Trip"), isCurrent: true }]}
        title={t("planYourTrip.pageTitle", "Plan Your Perfect Trip")}
        subtitle={t("planYourTrip.pageSubtitle", "Fill out the form below and our team will craft a personalized travel experience tailored just for you.")}
        backButton={{
          text: isAgentMode ? "Back to Dashboard" : t("planYourTrip.success.backToHome", "Back To Home"),
          href: isAgentMode ? "/dashboard/requests/plan-your-trip" : "/",
        }}
        decorationSrc="/images/dotted-line3.svg"
        subtitleMaxWidth="750px"
      />

      <div ref={stepIndicatorRef}>
        <StepIndicator steps={steps} currentStep={currentStep} wrapLabels={true} />
      </div>

      <main className={styles.mainContent}>
        <div className={styles.content}>
          {isAgentMode && (
            <div className={styles.agentModeBanner}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>
                <strong>Agent Mode</strong>
                <span className={styles.agentModeDesc}>: This request is being created on behalf of a client and will be registered in the dashboard with Source: Agent.</span>
              </span>
            </div>
          )}

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
              availableCategories={availableCategories}
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
          title={
            isAgentMode
              ? "Trip Request Created Successfully!"
              : t("planYourTrip.success.title", "Your Custom Trip Request Has Been Received!")
          }
          message={
            isAgentMode
              ? "The trip request has been recorded under your agent account with Source: Agent. You can now view and manage it directly in the dashboard."
              : t("planYourTrip.success.message", "Thank you for designing your journey with us. Our travel specialists are reviewing your preferences and will contact you within 24 hours.")
          }
          primaryButtonText={
            isAgentMode
              ? "View Request in Dashboard"
              : t("planYourTrip.success.viewRequest", "View Request Details")
          }
          buttonText={isAgentMode ? "Back to Dashboard" : t("planYourTrip.success.backToHome", "Back to Home")}
          onPrimaryClick={() => {
            if (isAgentMode) {
              router.push(submittedId ? `/dashboard/requests/plan-your-trip/${submittedId}` : "/dashboard/requests/plan-your-trip");
            } else {
              router.push("/profile?tab=requests");
            }
          }}
          onClose={handleReset}
        />
      )}
    </div>
  );
}
