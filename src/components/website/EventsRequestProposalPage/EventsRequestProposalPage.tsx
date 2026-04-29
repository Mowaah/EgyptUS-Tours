"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./EventsRequestProposalPage.module.scss";
import { STEPS } from "./eventsRequestProposalData";
import type { EventProposalData, EventStep } from "./eventsRequestProposalTypes";
import { SuccessModal, PageHeader, StepIndicator } from "@/components/shared";

import StepOrganization from "./steps/Organization/StepOrganization";
import StepEventDetails from "./steps/EventDetails/StepEventDetails";
import StepRequirements from "./steps/Requirements/StepRequirements";
import StepBudget from "./steps/Budget/StepBudget";

const initialData: EventProposalData = {
  organization: {
    name: "",
    industry: "",
    country: "",
    website: "",
    contactPerson: "",
    jobTitle: "",
    email: "",
    phone: "",
  },
  eventDetails: {
    eventType: "",
    eventName: "",
    expectedAttendees: "",
    preferredCity: "",
    startDate: "",
    endDate: "",
    description: "",
  },
  requirements: {
    venueType: "",
    additionalServices: [],
    additionalRequirements: "",
  },
  budget: {
    estimatedBudget: "",
    budgetFlexibility: "",
    hearAboutUs: "",
  },
};

export default function EventsRequestProposalPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<EventStep>(1);
  const [showModal, setShowModal] = useState(false);
  const stepIndicatorRef = useRef<HTMLDivElement | null>(null);
  const [proposalData, setProposalData] = useState<EventProposalData>(initialData);

  const updateOrganization = (patch: Partial<EventProposalData["organization"]>) => {
    setProposalData((prev) => ({
      ...prev,
      organization: { ...prev.organization, ...patch },
    }));
  };

  const updateEventDetails = (patch: Partial<EventProposalData["eventDetails"]>) => {
    setProposalData((prev) => ({
      ...prev,
      eventDetails: { ...prev.eventDetails, ...patch },
    }));
  };

  const updateRequirements = (patch: Partial<EventProposalData["requirements"]>) => {
    setProposalData((prev) => ({
      ...prev,
      requirements: { ...prev.requirements, ...patch },
    }));
  };

  const updateBudget = (patch: Partial<EventProposalData["budget"]>) => {
    setProposalData((prev) => ({
      ...prev,
      budget: { ...prev.budget, ...patch },
    }));
  };

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep((s) => (s + 1) as EventStep);
      return;
    }
    setShowModal(true);
  };

  const handlePrevious = () => {
    setCurrentStep((s) => (s > 1 ? s - 1 : 1) as EventStep);
  };

  const handleReset = () => {
    setShowModal(false);
    setCurrentStep(1);
    router.push("/");
  };

  useEffect(() => {
    stepIndicatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentStep]);

  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumbs={[
          { label: "MICE & Corporate Events", href: "/events" },
          { label: "Requesting Proposal", isCurrent: true },
        ]}
        title="Create Your Event Details"
        subtitle="Professional meetings, conferences, incentives, and exhibitions tailored for impactful business experiences."
        backButton={{ text: "Back To Home", href: "/" }}
        decorationSrc="/images/dotted-line3.svg"
        subtitleMaxWidth="750px"
      />

      <div ref={stepIndicatorRef}>
        <StepIndicator steps={STEPS} currentStep={currentStep} />
      </div>

      <main className={styles.mainContent}>
        <div className={styles.content}>
          {currentStep === 1 && (
            <StepOrganization
              data={proposalData.organization}
              onChange={updateOrganization}
              onContinue={handleContinue}
              onPrevious={handlePrevious}
            />
          )}

          {currentStep === 2 && (
            <StepEventDetails
              data={proposalData.eventDetails}
              onChange={updateEventDetails}
              onContinue={handleContinue}
              onPrevious={handlePrevious}
            />
          )}

          {currentStep === 3 && (
            <StepRequirements
              data={proposalData.requirements}
              onChange={updateRequirements}
              onContinue={handleContinue}
              onPrevious={handlePrevious}
            />
          )}

          {currentStep === 4 && (
            <StepBudget
              data={proposalData.budget}
              onChange={updateBudget}
              onContinue={handleContinue}
              onPrevious={handlePrevious}
            />
          )}
        </div>
      </main>

      {showModal && (
        <SuccessModal
          title="Proposal Request Submitted!"
          message="Thank you for your interest. Our MICE team will review your requirements and contact you within 24 hours."
          primaryButtonText="View Request"
          buttonText="Back to Home"
          onPrimaryClick={handleReset}
          onClose={handleReset}
          metadata={[
            { label: "Reference Number", value: "#MICE059208" },
            { label: "Organization", value: proposalData.organization.name || "AUS Agency" },
            { label: "Event Type", value: proposalData.eventDetails.eventType || "Incentive" },
            { label: "Expected Attendees", value: proposalData.eventDetails.expectedAttendees || "101-250" },
          ]}
        />
      )}
    </div>
  );
}
