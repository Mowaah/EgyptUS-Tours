"use client";

import sharedStyles from "../../PlanYourTripPage.module.scss";
import styles from "./StepDestination.module.scss";

type Destination = {
  id: string;
  name: string;
  image: string;
};

export default function StepDestination({
  search,
  onSearchChange,
  destinations,
  selectedDestinationIds,
  onToggleDestination,
  onContinue,
  continueDisabled,
  IconSearch,
  IconCheck,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  destinations: Destination[];
  selectedDestinationIds: string[];
  onToggleDestination: (id: string) => void;
  onContinue: () => void;
  continueDisabled: boolean;
  IconSearch: (props: { size?: number; className?: string }) => React.ReactNode;
  IconCheck: (props: { size?: number; className?: string }) => React.ReactNode;
}) {
  return (
    <>
      <div className={sharedStyles.formHeader}>
        <div>
          <h2 className={sharedStyles.formTitle}>Destination</h2>
          <p className={sharedStyles.formSubtitle}>Feel free to choose more than one destination.</p>
        </div>

        <div className={styles.searchBox}>
          <IconSearch size={20} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="EGY |"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.destinationGrid}>
        {destinations.map((destination) => {
          const selected = selectedDestinationIds.includes(destination.id);
          return (
            <button
              key={destination.id}
              type="button"
              className={`${styles.destinationCard} ${selected ? styles.destinationCardSelected : ""}`}
              onClick={() => onToggleDestination(destination.id)}
            >
              <div className={styles.destinationImageWrapper}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={destination.image} alt={destination.name} />
                {selected && (
                  <div className={styles.destinationCheckbox} aria-hidden="true">
                    <IconCheck size={14} />
                  </div>
                )}
              </div>
              <h3 className={styles.destinationName}>{destination.name}</h3>
            </button>
          );
        })}
      </div>

      <button
        className={sharedStyles.continueButton}
        onClick={onContinue}
        disabled={continueDisabled}
        type="button"
      >
        Continue
      </button>
    </>
  );
}

