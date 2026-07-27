"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { submitEventProposal, extractApiError } from "@/lib/api";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | number>("");

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

  const handleContinue = async () => {
    setSubmitError(null);

    if (currentStep === 1) {
      const org = proposalData.organization;
      const newErrors: Record<string, string> = {};
      if (!org.name.trim()) newErrors.name = "Organization Name is required.";
      if (!org.contactPerson.trim()) newErrors.contactPerson = "Contact Person is required.";
      if (!org.email.trim()) {
        newErrors.email = "Email Address is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(org.email.trim())) {
        newErrors.email = "Please enter a valid email address.";
      }
      const phoneDigits = org.phone.replace(/\D/g, "");
      if (!org.phone.trim() || phoneDigits.length === 0) {
        newErrors.phone = "Phone Number is required.";
      } else if (phoneDigits.length < 10) {
        newErrors.phone = "Please enter a valid phone number with country code.";
      }
      if (Object.keys(newErrors).length > 0) {
        setFieldErrors(newErrors);
        return;
      }
      setFieldErrors({});
    }

    if (currentStep === 2) {
      const evt = proposalData.eventDetails;
      const newErrors: Record<string, string> = {};
      if (!evt.eventType) newErrors.eventType = "Event Type is required.";
      if (!evt.eventName.trim()) newErrors.eventName = "Event Name is required.";
      if (!evt.expectedAttendees) newErrors.expectedAttendees = "Expected Attendees is required.";
      if (!evt.preferredCity) newErrors.preferredCity = "Preferred City is required.";
      if (!evt.startDate) newErrors.startDate = "Start Date is required.";
      if (!evt.endDate) newErrors.endDate = "End Date is required.";
      if (Object.keys(newErrors).length > 0) {
        setFieldErrors(newErrors);
        return;
      }
      setFieldErrors({});
    }

    if (currentStep === 3) {
      const req = proposalData.requirements;
      const newErrors: Record<string, string> = {};
      if (!req.venueType) newErrors.venueType = "Venue Type is required.";
      if (Object.keys(newErrors).length > 0) {
        setFieldErrors(newErrors);
        return;
      }
      setFieldErrors({});
    }

    if (currentStep === 4) {
      const bud = proposalData.budget;
      const newErrors: Record<string, string> = {};
      if (!bud.estimatedBudget) newErrors.estimatedBudget = "Estimated Budget is required.";
      if (!bud.budgetFlexibility) newErrors.budgetFlexibility = "Budget Flexibility is required.";
      if (Object.keys(newErrors).length > 0) {
        setFieldErrors(newErrors);
        return;
      }
      setFieldErrors({});
    }
    if (currentStep < 4) {
      setCurrentStep((s) => (s + 1) as EventStep);
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await submitEventProposal(proposalData);
      if (res && res.id) {
        setSubmittedId(res.id);
      } else {
        setSubmittedId(Math.floor(100000 + Math.random() * 900000));
      }
      setShowModal(true);
    } catch (err: any) {
      console.error("Failed to submit event proposal:", err);
      setSubmitError(extractApiError(err));
    } finally {
      setIsSubmitting(false);
    }
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
              onChange={(patch) => { updateOrganization(patch); setFieldErrors({}); }}
              onContinue={handleContinue}
              onPrevious={handlePrevious}
              errors={fieldErrors}
            />
          )}

          {currentStep === 2 && (
            <StepEventDetails
              data={proposalData.eventDetails}
              onChange={(patch) => { updateEventDetails(patch); setFieldErrors({}); }}
              onContinue={handleContinue}
              onPrevious={handlePrevious}
              errors={fieldErrors}
            />
          )}

          {currentStep === 3 && (
            <StepRequirements
              data={proposalData.requirements}
              onChange={(patch) => { updateRequirements(patch); setFieldErrors({}); }}
              onContinue={handleContinue}
              onPrevious={handlePrevious}
              errors={fieldErrors}
            />
          )}

          {currentStep === 4 && (
            <StepBudget
              data={proposalData.budget}
              onChange={(patch) => { updateBudget(patch); setFieldErrors({}); }}
              onContinue={handleContinue}
              onPrevious={handlePrevious}
              isSubmitting={isSubmitting}
              submitError={submitError}
              errors={fieldErrors}
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
          onPrimaryClick={() => router.push("/profile?tab=requests")}
          onClose={handleReset}
          metadata={[
            { label: "Reference Number", value: `#MICE-${submittedId || "059208"}` },
            { label: "Organization", value: proposalData.organization.name || "AUS Agency" },
            { label: "Event Type", value: proposalData.eventDetails.eventType || "Incentive" },
            { label: "Expected Attendees", value: proposalData.eventDetails.expectedAttendees || "101-250" },
          ]}
        />
      )}
    </div>
  );
}
