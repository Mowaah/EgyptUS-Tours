"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { CheckboxIndicator, BookingStepFooter } from "@/components/shared";

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
  const { t } = useTranslation("booking");
  return (
    <div className={sharedStyles.stepFormCard}>
      <header className={sharedStyles.stepFormCardHeader}>
        <div className={sharedStyles.formHeaderColumn}>
          <h2 className={sharedStyles.formTitle}>{t("planYourTrip.destination.title", "Where would you like to travel?")}</h2>
          <p className={sharedStyles.formSubtitle}>
            {t("planYourTrip.destination.subtitle", "Select one or more destinations to include in your custom trip.")}
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
                aria-pressed={selected}
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

      <BookingStepFooter
        onContinue={onContinue}
        continueDisabled={continueDisabled}
      />
    </div>
  );
}
