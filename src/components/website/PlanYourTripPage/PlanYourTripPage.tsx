"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./PlanYourTripPage.module.scss";
import { DESTINATIONS, EXPERIENCE_OPTIONS, STEPS, TRANSPORT_OPTIONS } from "./planYourTripData";
import { IconArrowLeft, IconMinus, IconPlus } from "./PlanYourTripIcons";
import type { PlanStep, TripData } from "./planYourTripTypes";
import { clampMin0, filterDestinations, toggleInArray } from "./planYourTripUtils";
import StepDestination from "./steps/Destination/StepDestination";
import StepTravelerInfo from "./steps/TravelerInfo/StepTravelerInfo";
import StepPreferences from "./steps/Preferences/StepPreferences";

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
    hotelCategory: "",
    roomType: "",
    transportation: "",
    experiences: [],
  },
};

export default function PlanYourTripPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<PlanStep>(1);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [tripData, setTripData] = useState<TripData>(initialTripData);

  const filteredDestinations = useMemo(
    () => filterDestinations(DESTINATIONS, search),
    [search],
  );

  const toggleDestination = (id: string) => {
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

  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep((s) => (s === 1 ? 2 : 3));
      return;
    }
    setShowModal(true);
  };

  const handlePrevious = () => {
    setCurrentStep((s) => (s === 3 ? 2 : 1));
  };

  const handleReset = () => {
    setShowModal(false);
    setCurrentStep(1);
    router.push("/");
  };

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbArt} aria-hidden="true">
          <div className={styles.breadcrumbDottedLine} />
          <Image
            src="/images/trips2.svg"
            alt=""
            width={22.5}
            height={19.5}
            className={styles.breadcrumbTripsIcon}
            aria-hidden
          />
        </div>
        <div className={styles.breadcrumbContainer}>
          <Link className={styles.backButton} href="/">
            <IconArrowLeft size={16} />
            Back To Home
          </Link>

          <div className={styles.breadcrumbPath} aria-label="Breadcrumb">
            <Image
              src="/images/home.svg"
              alt=""
              width={16}
              height={16}
              className={styles.breadcrumbHomeIcon}
              aria-hidden
            />
            <span className={styles.breadcrumbLabel}>Home</span>
            <span className={styles.breadcrumbSeparator} aria-hidden="true">
              /
            </span>
            <span className={styles.breadcrumbCurrent}>Plan Your Trip</span>
          </div>

          <h1 className={styles.breadcrumbTitle}>Plan Your Perfect Trip</h1>
          <p className={styles.breadcrumbSubtitle}>
            Fill out the form below and our team will craft a personalized travel experience
            tailored just for you.
          </p>
        </div>
      </div>

      <div className={styles.stepIndicator}>
        <div className={styles.stepContainer}>
          {STEPS.map((step, index) => {
            const isCurrent = currentStep === step.number;
            const isDone = currentStep > step.number;

            const circleClass = isCurrent
              ? styles.stepCircleActive
              : isDone
                ? styles.stepCircleCompleted
                : styles.stepCircleInactive;

            return (
              <div key={step.number} className={styles.stepChunk}>
                <div className={styles.step} aria-current={isCurrent ? "step" : undefined}>
                  <div className={`${styles.stepCircle} ${circleClass}`}>
                    {isCurrent ? (
                      <span className={styles.stepBullseyeDot} aria-hidden="true" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`${styles.stepLabel} ${
                      isCurrent ? styles.stepLabelCurrent : isDone ? styles.stepLabelDone : ""
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`${styles.stepLine} ${
                      currentStep >= step.number ? styles.stepLineActive : ""
                    }`}
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <main className={styles.mainContent}>
        <div className={styles.content}>
          {currentStep === 1 && (
            <StepDestination
              search={search}
              onSearchChange={setSearch}
              destinations={filteredDestinations}
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
              IconMinus={IconMinus}
              IconPlus={IconPlus}
            />
          )}

          {currentStep === 3 && (
            <StepPreferences
              preferences={tripData.preferences}
              transportOptions={TRANSPORT_OPTIONS}
              experienceOptions={EXPERIENCE_OPTIONS}
              onSetPreferences={setPreferences}
              onPrevious={handlePrevious}
              onContinue={handleContinue}
            />
          )}
        </div>
      </main>

      {showModal && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <div className={styles.modalIcon} aria-hidden="true">
              <Image
                src="/images/check.svg"
                alt=""
                width={32}
                height={32}
                className={styles.modalCheckIcon}
              />
            </div>

            <h2 className={styles.modalTitle}>Your Custom Trip Request Has Been Received!</h2>

            <p className={styles.modalMessage}>
              Thank you for designing your journey with us. Our travel specialists are reviewing
              your preferences and will contact you within 24 hours.
            </p>

            <div className={styles.modalActions}>
              <button className={styles.modalSecondaryButton} onClick={handleReset} type="button">
                Back to Home
              </button>
              <button className={styles.modalPrimaryButton} onClick={handleReset} type="button">
                Explore More Experiences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
