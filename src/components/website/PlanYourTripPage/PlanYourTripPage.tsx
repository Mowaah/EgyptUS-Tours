"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./PlanYourTripPage.module.scss";
import StepDestination from "./steps/Destination/StepDestination";
import StepTravelerInfo from "./steps/TravelerInfo/StepTravelerInfo";
import StepPreferences from "./steps/Preferences/StepPreferences";

type Step = 1 | 2 | 3;

type IconProps = {
  size?: number;
  className?: string;
};

function IconArrowLeft({ size = 16, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconHome({ size = 16, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 10.5L12 3l9 7.5V21a0 0 0 0 1 0 0h-6v-6H9v6H3V10.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSearch({ size = 20, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="M20 20l-3.5-3.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCheck({ size = 16, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMinus({ size = 16, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconPlus({ size = 16, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconStar({
  size = 14,
  className,
  fill = "none",
  opacity = 1,
}: IconProps & { fill?: string; opacity?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ opacity }}
    >
      <path
        d="M12 2l3.2 6.5 7.2 1-5.2 5.1 1.2 7.2L12 18.9 5.6 21.8l1.2-7.2L1.6 9.5l7.2-1L12 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconX({ size = 12, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

type TripData = {
  destinations: string[];
  travelerInfo: {
    name: string;
    email: string;
    phone: string;
    nationality: string;
    startDate: string;
    endDate: string;
    adults: number;
    children: number;
    infants: number;
    tripDetails: string;
  };
  preferences: {
    hotelCategory: number;
    roomType: string;
    transportation: string[];
    experiences: string[];
  };
};

type Destination = {
  id: string;
  name: string;
  image: string;
};

const DESTINATIONS: Destination[] = [
  {
    id: "egypt",
    name: "Egypt",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "dubai-1",
    name: "Dubai",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "saudi-1",
    name: "Saudi Arabia",
    image:
      "https://images.unsplash.com/photo-1614071403589-1e5d37b04b2d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "qatar-1",
    name: "Qatar",
    image:
      "https://images.unsplash.com/photo-1614003488101-4fe3b4a6f4f8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "turkey-1",
    name: "Turkey",
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "greece-1",
    name: "Greece",
    image:
      "https://images.unsplash.com/photo-1505735454785-337d7d3f7c2b?auto=format&fit=crop&w=1200&q=80",
  },
];

const TRANSPORT_OPTIONS = [
  "Shared Transport",
  "Private Transport",
  "VIP Luxury Car",
  "Airport Transfer Only",
  "I don't need transport",
] as const;

const EXPERIENCE_OPTIONS = [
  "Private Tour Guide",
  "Photographer",
  "Special Event during trip",
  "Nile Cruise",
  "Desert Safari",
] as const;

const STEPS: Array<{ number: Step; label: string }> = [
  { number: 1, label: "Destination" },
  { number: 2, label: "Traveler Information" },
  { number: 3, label: "Travel Preferences" },
];

function clampMin0(n: number) {
  return Math.max(0, n);
}

function toggleInArray(arr: string[], value: string) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export default function PlanYourTripPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const [tripData, setTripData] = useState<TripData>({
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
      hotelCategory: 5,
      roomType: "Standard Room",
      transportation: [],
      experiences: [],
    },
  });

  const filteredDestinations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return DESTINATIONS;
    return DESTINATIONS.filter((d) => d.name.toLowerCase().includes(q));
  }, [search]);

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
      travelerInfo: {
        ...prev.travelerInfo,
        [field]: value,
      },
    }));
  };

  const handleNumberChange = (field: "adults" | "children" | "infants", inc: boolean) => {
    setTripData((prev) => {
      const current = prev.travelerInfo[field];
      const next = inc ? current + 1 : clampMin0(current - 1);
      return {
        ...prev,
        travelerInfo: {
          ...prev.travelerInfo,
          [field]: next,
        },
      };
    });
  };

  const setPreferences = (patch: Partial<TripData["preferences"]>) => {
    setTripData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...patch,
      },
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
        <div className={styles.breadcrumbContainer}>
          <Link className={styles.backButton} href="/">
            <IconArrowLeft size={16} />
            Back To Home
          </Link>

          <div className={styles.breadcrumbPath} aria-label="Breadcrumb">
            <IconHome size={16} />
            <span className={styles.breadcrumbLabel}>Home</span>
            <span className={styles.breadcrumbSeparator} aria-hidden="true">
              \
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
            const circleClass =
              currentStep === step.number
                ? styles.stepCircleActive
                : currentStep > step.number
                  ? styles.stepCircleCompleted
                  : styles.stepCircleInactive;

            return (
              <div key={step.number} className={styles.stepChunk}>
                <div className={styles.step}>
                  <div className={`${styles.stepCircle} ${circleClass}`}>{step.number}</div>
                  <span
                    className={`${styles.stepLabel} ${
                      currentStep >= step.number ? styles.stepLabelActive : ""
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`${styles.stepLine} ${
                      currentStep > step.number ? styles.stepLineCompleted : ""
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
              IconSearch={IconSearch}
              IconCheck={IconCheck}
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
              IconStar={IconStar}
              IconX={IconX}
            />
          )}
        </div>
      </main>

      {showModal && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <div className={styles.modalIcon} aria-hidden="true">
              <IconCheck size={32} />
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

