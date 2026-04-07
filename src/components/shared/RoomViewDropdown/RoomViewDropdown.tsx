"use client";

import CheckboxDropdown from "@/components/shared/CheckboxDropdown/CheckboxDropdown";
import prefStyles from "@/components/website/PlanYourTripPage/steps/Preferences/StepPreferences.module.scss";
import styles from "./RoomViewDropdown.module.scss";

export interface RoomViewOption {
  label: string;
  value: string;
  price?: string; // e.g. "+$ 456", or omit/null for "Free"
}

interface RoomViewDropdownProps {
  id?: string;
  label?: string;
  options: RoomViewOption[];
  value: string;
  onChange: (val: string) => void;
}

export default function RoomViewDropdown({
  id,
  label,
  options,
  value,
  onChange,
}: RoomViewDropdownProps) {
  const selectedOption = options.find((o) => o.value === value) ?? options[0];

  return (
    <CheckboxDropdown
      options={options}
      value={value}
      onChange={onChange}
      checkboxStyle="radio"
      dropdownClassName={prefStyles.prefPanel}
      renderOption={(opt) => (
        <div className={styles.option}>
          <span className={styles.optionName}>{opt.label}</span>
          <span className={opt.price ? styles.optionPrice : styles.optionFree}>
            {opt.price ?? "Free"}
          </span>
        </div>
      )}
      renderTrigger={(isOpen, setIsOpen) => (
        <div
          id={id}
          className={`${prefStyles.prefTrigger} ${isOpen ? prefStyles.prefTriggerOpen : ""}`}
          tabIndex={0}
          role="combobox"
          aria-expanded={isOpen}
          aria-label={label}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}
        >
          <span className={prefStyles.prefTriggerValue}>{selectedOption.label}</span>
          <svg
            className={`${prefStyles.multiSelectChevron} ${isOpen ? prefStyles.multiSelectChevronOpen : ""}`}
            width={12}
            height={8}
            viewBox="0 0 10 6"
            fill="none"
            aria-hidden
          >
            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      )}
    />
  );
}
