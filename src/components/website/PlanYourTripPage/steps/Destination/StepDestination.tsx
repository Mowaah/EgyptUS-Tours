"use client";

import Image from "next/image";

import { CheckboxIndicator } from "@/components/shared";

import sharedStyles from "../../PlanYourTripPage.module.scss";
import type { PlanDestination } from "../../planYourTripTypes";
import styles from "./StepDestination.module.scss";

export default function StepDestination({
  destinations,
  selectedDestinationIds,
  onToggleDestination,
  onContinue,
  continueDisabled,
}: {
  destinations: PlanDestination[];
  selectedDestinationIds: (string | number)[];
  onToggleDestination: (id: string | number) => void;
  onContinue: () => void;
  continueDisabled: boolean;
}) {
  return (
    <div className={sharedStyles.stepFormCard}>
      <header className={sharedStyles.stepFormCardHeader}>
        <div className={sharedStyles.formHeaderColumn}>
          <h2 className={sharedStyles.formTitle}>Destination</h2>
          <p className={sharedStyles.formSubtitle}>
            Feel free to choose more than one destination.
          </p>
        </div>
      </header>

      <div className={sharedStyles.stepFormCardScroll}>
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
                  <img src={destination.image || undefined} alt={destination.name} />
                  <CheckboxIndicator
                    variant="square"
                    surface="overlay"
                    selected={selected}
                    className={styles.destinationCheckbox}
                    aria-hidden
                  />
                </div>
                <h3 className={styles.destinationName}>{destination.name}</h3>
              </button>
            );
          })}
        </div>
      </div>

      <hr className={sharedStyles.stepFormCardDivider} aria-hidden="true" />

      <div className={sharedStyles.stepFormCardFooter}>
        <div className={sharedStyles.formActions}>
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
    </div>
  );
}
