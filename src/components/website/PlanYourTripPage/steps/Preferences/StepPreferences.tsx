"use client";

import styles from "../../PlanYourTripPage.module.scss";

type Preferences = {
  hotelCategory: number;
  roomType: string;
  transportation: string[];
  experiences: string[];
};

export default function StepPreferences({
  preferences,
  transportOptions,
  experienceOptions,
  onSetPreferences,
  onPrevious,
  onContinue,
  IconStar,
  IconX,
}: {
  preferences: Preferences;
  transportOptions: readonly string[];
  experienceOptions: readonly string[];
  onSetPreferences: (patch: Partial<Preferences>) => void;
  onPrevious: () => void;
  onContinue: () => void;
  IconStar: (props: {
    size?: number;
    className?: string;
    fill?: string;
    opacity?: number;
  }) => React.ReactNode;
  IconX: (props: { size?: number; className?: string }) => React.ReactNode;
}) {
  const toggleInArray = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  return (
    <div className={styles.stepFormCard}>
      <header className={styles.stepFormCardHeader}>
        <div className={styles.formHeaderColumn}>
          <h2 className={styles.formTitle}>Travel Preferences</h2>
          <p className={styles.formSubtitle}>Select your travel options to help us plan your trip.</p>
        </div>
      </header>

      <div className={styles.stepFormCardScroll}>
        <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="pti-hotel">Preferred hotel category</label>
          <div className={styles.selectWrapper}>
            <div className={styles.stars} aria-hidden="true">
              {[1, 2, 3, 4, 5].map((star) => (
                <IconStar
                  key={star}
                  size={14}
                  fill="#FFBB00"
                  opacity={star <= preferences.hotelCategory ? 1 : 0.3}
                />
              ))}
            </div>
            <span className={styles.ratingValue}>{Number(preferences.hotelCategory).toFixed(1)}</span>
            <select
              id="pti-hotel"
              className={styles.formInput}
              value={preferences.hotelCategory}
              onChange={(e) => onSetPreferences({ hotelCategory: Number(e.target.value) })}
            >
              <option value={5}>5.0</option>
              <option value={4}>4.0</option>
              <option value={3}>3.0</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="pti-room">Ideal room type</label>
          <select
            id="pti-room"
            className={styles.formInput}
            value={preferences.roomType}
            onChange={(e) => onSetPreferences({ roomType: e.target.value })}
          >
            <option value="Standard Room">Standard Room</option>
            <option value="Deluxe Room">Deluxe Room</option>
            <option value="Suite">Suite</option>
            <option value="I don't need hotel">I don't need hotel</option>
          </select>
        </div>

        <div className={styles.formGroupFull}>
          <label>Transportation Preferences</label>
          <div className={styles.multiSelect}>
            <div className={styles.selectedItems} role="group" aria-label="Transportation">
              {preferences.transportation.length === 0 ? (
                <span className={styles.placeholder}>Select Transportation</span>
              ) : (
                preferences.transportation.map((item) => (
                  <div key={item} className={styles.tag}>
                    {item}
                    <button
                      type="button"
                      onClick={() =>
                        onSetPreferences({
                          transportation: toggleInArray(preferences.transportation, item),
                        })
                      }
                      aria-label={`Remove ${item}`}
                    >
                      <IconX size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className={styles.options} role="listbox" aria-label="Transport options">
              {transportOptions.map((option) => (
                <label key={option} className={styles.option}>
                  <input
                    type="checkbox"
                    checked={preferences.transportation.includes(option)}
                    onChange={() =>
                      onSetPreferences({
                        transportation: toggleInArray(preferences.transportation, option),
                      })
                    }
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.formGroupFull}>
          <label>Enhance Your Experience</label>
          <div className={styles.multiSelect}>
            <div className={styles.selectedItems} role="group" aria-label="Experiences">
              {preferences.experiences.length === 0 ? (
                <span className={styles.placeholder}>Select Experiences</span>
              ) : (
                preferences.experiences.map((item) => (
                  <div key={item} className={styles.tag}>
                    {item}
                    <button
                      type="button"
                      onClick={() =>
                        onSetPreferences({
                          experiences: toggleInArray(preferences.experiences, item),
                        })
                      }
                      aria-label={`Remove ${item}`}
                    >
                      <IconX size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className={styles.options} role="listbox" aria-label="Experience options">
              {experienceOptions.map((option) => (
                <label key={option} className={styles.option}>
                  <input
                    type="checkbox"
                    checked={preferences.experiences.includes(option)}
                    onChange={() =>
                      onSetPreferences({
                        experiences: toggleInArray(preferences.experiences, option),
                      })
                    }
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>

      <hr className={styles.stepFormCardDivider} aria-hidden="true" />

      <div className={styles.stepFormCardFooter}>
        <div className={styles.formActions}>
          <button className={styles.previousButton} onClick={onPrevious} type="button">
            Previous
          </button>
          <button className={styles.continueButton} onClick={onContinue} type="button">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

