"use client";

import Image from "next/image";

import sharedStyles from "../../PlanYourTripPage.module.scss";
import type { PlanDestination } from "../../planYourTripTypes";
import styles from "./StepDestination.module.scss";

export default function StepDestination({
  search,
  onSearchChange,
  destinations,
  selectedDestinationIds,
  onToggleDestination,
  onContinue,
  continueDisabled,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  destinations: PlanDestination[];
  selectedDestinationIds: string[];
  onToggleDestination: (id: string) => void;
  onContinue: () => void;
  continueDisabled: boolean;
}) {
  return (
    <div className={styles.destinationGrid}>
      <header className={styles.destinationGridHeader}>
        <div>
          <h2 className={sharedStyles.formTitle}>Destination</h2>
          <p className={sharedStyles.formSubtitle}>
            Feel free to choose more than one destination.
          </p>
        </div>

        <div className={styles.searchBox}>
          <Image
            src="/images/search.svg"
            alt=""
            width={20}
            height={20}
            className={styles.searchIcon}
            aria-hidden
          />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search destinations…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </header>

      <div className={styles.destinationScroll}>
        <div className={styles.destinationCards}>
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
                  <img src={destination.image} alt={destination.name} />
                  <span
                    className={`${styles.destinationCheckbox} ${selected ? styles.destinationCheckboxSelected : ""}`}
                    aria-hidden="true"
                  />
                </div>
                <h3 className={styles.destinationName}>{destination.name}</h3>
              </button>
            );
          })}
        </div>
      </div>

      <hr className={styles.destinationGridDivider} aria-hidden="true" />

      <div className={styles.destinationGridFooter}>
        <button
          className={sharedStyles.continueButton}
          onClick={onContinue}
          disabled={continueDisabled}
          type="button"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
